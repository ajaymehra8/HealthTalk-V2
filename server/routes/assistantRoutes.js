const express = require("express");
const Router = express.Router();
const assistantController = require("../controller/assistantController");

// Public chatbot endpoint — available to visitors and logged-in users alike.
Router.post("/chat", assistantController.chat);

module.exports = Router;
