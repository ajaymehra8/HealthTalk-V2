const Message = require("../model/messageModel");
const BookingModel = require("../model/bookingModel");
const { uploadToCloudinary } = require("../config/firebase");
const {
  encryptText,
  decryptText,
  encryptBuffer,
  decryptBuffer,
} = require("../utils/crypto");

/*
 * Returns the booking if `userId` is a participant (patient or doctor) AND the
 * appointment has been paid for. Returns null otherwise so callers can respond
 * with the right status code.
 */
const getAuthorizedBooking = async (bookingId, userId) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) return { booking: null, reason: "not_found" };

  const isParticipant =
    booking.user.toString() === userId.toString() ||
    booking.doctor.toString() === userId.toString();
  if (!isParticipant) return { booking: null, reason: "forbidden" };

  if (!booking.payment) return { booking: null, reason: "unpaid" };

  return { booking, reason: null };
};

const denyResponse = (res, reason) => {
  if (reason === "not_found") {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
  }
  if (reason === "unpaid") {
    return res.status(403).json({
      success: false,
      message: "Chat unlocks once the appointment payment is complete.",
    });
  }
  return res.status(403).json({
    success: false,
    message: "You are not allowed to access this conversation.",
  });
};

// Convert a stored (encrypted) message document into a client-safe shape.
const serializeMessage = (msg) => {
  const base = {
    _id: msg._id,
    booking: msg.booking,
    sender: msg.sender,
    receiver: msg.receiver,
    type: msg.type,
    read: msg.read,
    createdAt: msg.createdAt,
  };

  if (msg.type === "file") {
    return {
      ...base,
      file: {
        name: msg.file?.nameIv
          ? decryptText({
              content: msg.file.originalName,
              iv: msg.file.nameIv,
              tag: msg.file.nameTag,
            })
          : msg.file?.originalName,
        mimeType: msg.file?.mimeType,
        size: msg.file?.size,
        downloadUrl: `/api/v1/chat/document/${msg._id}`,
      },
    };
  }

  return {
    ...base,
    text: decryptText({ content: msg.content, iv: msg.iv, tag: msg.tag }),
  };
};

const populateAndSerialize = async (messageId) => {
  const populated = await Message.findById(messageId)
    .populate({ path: "sender", select: "name image role" })
    .populate({ path: "receiver", select: "name image role" });
  return serializeMessage(populated);
};

const emitNewMessage = (req, bookingId, payload) => {
  const io = req.app.get("io");
  if (io) io.to(bookingId.toString()).emit("newMessage", payload);
};

// GET /api/v1/chat/conversations — paid bookings of the current user with a preview.
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookings = await BookingModel.find({
      payment: true,
      $or: [{ user: userId }, { doctor: userId }],
    })
      .populate({ path: "user", select: "name image role" })
      .populate({ path: "doctor", select: "name image role" })
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      bookings.map(async (booking) => {
        const lastMessage = await Message.findOne({ booking: booking._id }).sort(
          { createdAt: -1 }
        );
        const unreadCount = await Message.countDocuments({
          booking: booking._id,
          receiver: userId,
          read: false,
        });

        const otherParty =
          booking.user._id.toString() === userId.toString()
            ? booking.doctor
            : booking.user;

        let preview = "";
        if (lastMessage) {
          preview =
            lastMessage.type === "file"
              ? "📎 Document"
              : decryptText({
                  content: lastMessage.content,
                  iv: lastMessage.iv,
                  tag: lastMessage.tag,
                });
        }

        return {
          bookingId: booking._id,
          otherParty,
          mode: booking.mode,
          time: booking.time,
          lastMessage: lastMessage
            ? { preview, createdAt: lastMessage.createdAt }
            : null,
          unreadCount,
        };
      })
    );

    res.status(200).json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/chat/:bookingId/messages — authorized message history (decrypted).
exports.getMessages = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { booking, reason } = await getAuthorizedBooking(
      bookingId,
      req.user._id
    );
    if (!booking) return denyResponse(res, reason);

    const messages = await Message.find({ booking: bookingId })
      .populate({ path: "sender", select: "name image role" })
      .populate({ path: "receiver", select: "name image role" })
      .sort({ createdAt: 1 });

    // Mark messages addressed to the current user as read.
    await Message.updateMany(
      { booking: bookingId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages: messages.map(serializeMessage),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/chat/:bookingId/messages — send an encrypted text message.
exports.sendMessage = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message text is required." });
    }

    const { booking, reason } = await getAuthorizedBooking(
      bookingId,
      req.user._id
    );
    if (!booking) return denyResponse(res, reason);

    const receiver =
      booking.user.toString() === req.user._id.toString()
        ? booking.doctor
        : booking.user;

    const { content, iv, tag } = encryptText(text.trim());
    const message = await Message.create({
      booking: bookingId,
      sender: req.user._id,
      receiver,
      type: "text",
      content,
      iv,
      tag,
    });

    const payload = await populateAndSerialize(message._id);
    emitNewMessage(req, bookingId, payload);

    res.status(200).json({ success: true, message: payload });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/chat/:bookingId/document — encrypt then upload a shared document.
exports.uploadDocument = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    const { booking, reason } = await getAuthorizedBooking(
      bookingId,
      req.user._id
    );
    if (!booking) return denyResponse(res, reason);

    const receiver =
      booking.user.toString() === req.user._id.toString()
        ? booking.doctor
        : booking.user;

    // Encrypt the raw bytes before they ever leave the server.
    const { data, iv, tag } = encryptBuffer(req.file.buffer);
    const uploadResult = await uploadToCloudinary({
      buffer: data,
      mimetype: "application/octet-stream",
      folder: "healthtalk/chat",
      resourceType: "raw",
    });

    // Encrypt the original filename too (it can leak medical context).
    const encryptedName = encryptText(req.file.originalname);

    const message = await Message.create({
      booking: bookingId,
      sender: req.user._id,
      receiver,
      type: "file",
      file: {
        originalName: encryptedName.content,
        nameIv: encryptedName.iv,
        nameTag: encryptedName.tag,
        mimeType: req.file.mimetype,
        size: req.file.size,
        cloudinaryId: uploadResult.public_id,
        url: uploadResult.secure_url,
        iv,
        tag,
      },
    });

    const payload = await populateAndSerialize(message._id);
    emitNewMessage(req, bookingId, payload);

    res.status(200).json({ success: true, message: payload });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/chat/document/:messageId — decrypt and stream a shared document.
exports.downloadDocument = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message || message.type !== "file") {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const { booking, reason } = await getAuthorizedBooking(
      message.booking,
      req.user._id
    );
    if (!booking) return denyResponse(res, reason);

    // Pull the encrypted blob back from Cloudinary and decrypt it in memory.
    const response = await fetch(message.file.url);
    if (!response.ok) {
      return res
        .status(502)
        .json({ success: false, message: "Failed to retrieve document" });
    }
    const encryptedBuffer = Buffer.from(await response.arrayBuffer());
    const decrypted = decryptBuffer(
      encryptedBuffer,
      message.file.iv,
      message.file.tag
    );

    const fileName = decryptText({
      content: message.file.originalName,
      iv: message.file.nameIv,
      tag: message.file.nameTag,
    });

    res.setHeader(
      "Content-Type",
      message.file.mimeType || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );
    res.send(decrypted);
  } catch (err) {
    next(err);
  }
};
