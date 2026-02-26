const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.controller");

router.post("/send", chatController.sendMessage);
router.get("/:threadId", chatController.getMessages);
router.get("/conversation/:sender/:receiver", chatController.getConversation);
router.get("/users/online", chatController.getOnlineUsers);

module.exports = router;