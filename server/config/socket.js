const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const BookingModel = require("../model/bookingModel");
require("dotenv").config();

/*
 * Initialise Socket.io on top of the existing HTTP server.
 *
 * Auth mirrors authController.isProtect: the client passes its JWT via the
 * handshake auth payload, we verify it and attach the user to the socket.
 * Each conversation is a room keyed by bookingId; clients may only join a room
 * for a paid appointment they participate in.
 */
const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User no longer exists"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", async (bookingId) => {
      try {
        const booking = await BookingModel.findById(bookingId);
        if (!booking || !booking.payment) return;

        const userId = socket.user._id.toString();
        const isParticipant =
          booking.user.toString() === userId ||
          booking.doctor.toString() === userId;
        if (!isParticipant) return;

        socket.join(bookingId.toString());
      } catch (err) {
        // Swallow join errors; the client simply won't receive live updates.
      }
    });

    socket.on("leave", (bookingId) => {
      if (bookingId) socket.leave(bookingId.toString());
    });

    // Relay typing indicators to the other participant in the room.
    socket.on("typing", ({ bookingId, isTyping }) => {
      if (!bookingId) return;
      socket.to(bookingId.toString()).emit("typing", {
        userId: socket.user._id,
        isTyping,
      });
    });
  });

  return io;
};

module.exports = { initSocket };
