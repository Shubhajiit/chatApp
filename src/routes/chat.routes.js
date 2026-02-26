const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.controller");

router.post("/send", chatController.sendMessage);
router.get("/:threadId", chatController.getMessages);

module.exports = router;