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


const asyncHandler = require("express-async-handler"); // <-- ADD THIS
const Chat = require('../models/chat.model.js');
const Thread = require("../models/thread.model.js");
const User = require("../models/User.js");

exports.sendMessage = asyncHandler(async (req, res) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let thread = await Thread.findOne({
        participants: { $all: [sender, receiver] }
    });

    // ❌ Thread.create galat use hua tha
    if (!thread) {
        thread = await Thread.create({ participants: [sender, receiver] });
    }

    const chat = await Chat.create({
        sender,
        receiver,
        message,
        thread: thread._id
    });

    thread.lastMessage = message;
    thread.lastMessageAt = Date.now();
    await thread.save();

    // ❌ getSelection() galat tha (socket.io hoga)
    const receiverSocket = onlineUsers?.get(receiver);
    if (receiverSocket && io) {
        io.to(receiverSocket).emit("newMessage", chat);
    }

    res.status(201).json(chat);
});


exports.getMessages = asyncHandler(async (req, res) => {
    const { threadId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Chat.find({ thread: threadId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * Number(limit))
        .limit(Number(limit));

    res.status(200).json({
        messages,
        page: Number(page),
        limit: Number(limit)
    });
});
