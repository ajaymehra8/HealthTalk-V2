const mongoose = require("mongoose");

/*
 * A single chat message scoped to a paid appointment (booking).
 *
 * Nothing here is stored in plaintext: text bodies live in `content/iv/tag`
 * and file metadata (original name + the encrypted blob's reference) carries
 * its own iv/tag. Decryption happens only in the controller, in memory.
 */
const messageSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointments",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },
    // Encrypted text payload (for type === "text").
    content: { type: String },
    iv: { type: String },
    tag: { type: String },
    // Encrypted file payload (for type === "file").
    file: {
      originalName: { type: String }, // encrypted (uses nameIv/nameTag below)
      nameIv: { type: String },
      nameTag: { type: String },
      mimeType: { type: String },
      size: { type: Number },
      cloudinaryId: { type: String },
      url: { type: String }, // points to the encrypted blob on Cloudinary
      iv: { type: String },
      tag: { type: String },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
