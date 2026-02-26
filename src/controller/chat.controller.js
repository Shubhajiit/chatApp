// const Chat = require('../models/chat.model.js');
// const Thread = require("../models/thread.model.js")
// const User = require("../models/User.js");

// exports.sendMessage = asyncHandler(async (req, res) => {
//     const { sender, receiver, message} = req.body;

//     if(!sender || !receiver || !message){
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     let thread = await Thread.findOne({ participants: { $all: [sender, receiver] } });

//     if(!thread){
//         thread = new Thread.create({ participants: [sender, receiver] });
//         await thread.save();
//     }

//     const chat= await Chat.create({
//         sender,
//         receiver,
//         message,
//         thread: thread._id
//     });

//     thread.lastMessage = message;
//     thread.lastMessageAt = Date.now();
//     await thread.save();

//     const receiverSocket = onlineUsers.get(receiver);
//     if(receiverSocket){
//         getSelection().to(receiverSocket).emit("newMessage", chat);
//     }
//     res.status(201).json(chat);
// });

// exports.getMessages = asyncHandler(async (req, res) => {
//     const { threadId } = req.params;
//     const {page = 1, limit = 20} = req.query;

//     const messages = await Chat.find({ thread: threadId }).sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(Number(limit));

//     res.status(200).json({
//         messages,
//         page: Number(page),
//         limit: Number(limit)
//     });
// });


const asyncHandler = require("express-async-handler");
const Chat = require('../models/chat.model.js');
const Thread = require("../models/thread.model.js");
const User = require("../models/User.js");
const { getIO, onlineUsers } = require('../socket/socket');

exports.sendMessage = asyncHandler(async (req, res) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Find or create users
    let senderUser = await User.findOne({ username: sender });
    let receiverUser = await User.findOne({ username: receiver });

    if (!senderUser) {
        senderUser = await User.create({ 
            username: sender, 
            email: `${sender}@chatapp.com` 
        });
    }

    if (!receiverUser) {
        receiverUser = await User.create({ 
            username: receiver, 
            email: `${receiver}@chatapp.com` 
        });
    }

    let thread = await Thread.findOne({
        participants: { $all: [senderUser._id, receiverUser._id] }
    });

    if (!thread) {
        thread = await Thread.create({ 
            participants: [senderUser._id, receiverUser._id] 
        });
    }

    const chat = await Chat.create({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message,
        thread: thread._id
    });

    thread.lastMessage = message;
    thread.lastMessageAt = Date.now();
    await thread.save();

    // Send real-time message to receiver if online
    const receiverSocket = onlineUsers.get(receiver);
    const io = getIO();
    if (receiverSocket && io) {
        io.to(receiverSocket).emit("new_message", {
            message: chat.message,
            sender: sender,
            timestamp: chat.createdAt
        });
    }

    res.status(201).json({
        success: true,
        message: chat.message,
        sender: sender,
        timestamp: chat.createdAt
    });
});


exports.getMessages = asyncHandler(async (req, res) => {
    const { threadId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Chat.find({ thread: threadId })
        .populate('sender', 'username')
        .populate('receiver', 'username')
        .sort({ createdAt: -1 })
        .skip((page - 1) * Number(limit))
        .limit(Number(limit));

    res.status(200).json({
        messages,
        page: Number(page),
        limit: Number(limit)
    });
});

// Get conversation between two users
exports.getConversation = asyncHandler(async (req, res) => {
    const { sender, receiver } = req.params;

    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const thread = await Thread.findOne({
        participants: { $all: [senderUser._id, receiverUser._id] }
    });

    if (!thread) {
        return res.status(200).json({ messages: [] });
    }

    const messages = await Chat.find({ thread: thread._id })
        .populate('sender', 'username')
        .populate('receiver', 'username')
        .sort({ createdAt: 1 });

    res.status(200).json({ messages });
});

// Get online users
exports.getOnlineUsers = asyncHandler(async (req, res) => {
    const users = Array.from(onlineUsers.keys());
    res.status(200).json({ users });
});
