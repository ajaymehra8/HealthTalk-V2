const express = require("express");
const Router = express.Router();
const chatController = require("../controller/chatController");
const authController = require("../controller/authController");
const { uploadChatFile } = require("../middlewares/file");

Router.use(authController.isProtect);

Router.get("/conversations", chatController.getConversations);
Router.get("/document/:messageId", chatController.downloadDocument);
Router.get("/:bookingId/messages", chatController.getMessages);
Router.post("/:bookingId/messages", chatController.sendMessage);
Router.post(
  "/:bookingId/document",
  uploadChatFile,
  chatController.uploadDocument
);

module.exports = Router;
