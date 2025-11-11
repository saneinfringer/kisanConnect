// server/src/controllers/messageController.js
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation'); // new model
const User = require('../models/User');
/**
 * GET /api/messages/conversations
 * Returns all conversations + unread count for logged-in user
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate('participants', 'name role')
      .populate('lastMessage');

    const formatted = await Promise.all(
      conversations.map(async (conv) => {
        const partner = conv.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );

        // 🔹 Count unread messages (not sent by current user)
        const unreadCount = await Message.countDocuments({
          receiver: userId,
          sender: partner?._id,
          read: false,
        });

        return {
          _id: conv._id,
          participants: conv.participants,
          lastMessage: conv.lastMessage
            ? { text: conv.lastMessage.text, time: conv.lastMessage.updatedAt }
            : null,
          partner: partner
            ? { _id: partner._id, name: partner.name, role: partner.role }
            : null,
          unreadCount,
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error('getConversations error:', err);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

/**
 * GET /api/messages/:partnerId
 * Returns all messages and marks partner's messages as read
 */
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const partnerId = req.params.partnerId;

    if (!partnerId) {
      return res.status(400).json({ message: 'Missing partner ID' });
    }

    // ✅ Convert both IDs to ObjectId to ensure Mongo matches properly
    const senderId = new mongoose.Types.ObjectId(userId);
    const receiverId = new mongoose.Types.ObjectId(partnerId);

    // ✅ Fetch both directions of the chat
    const msgs = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });

    // ✅ Mark partner’s unread messages as read
    await Message.updateMany(
      { sender: receiverId, receiver: senderId, read: false },
      { $set: { read: true } }
    );

    res.json(msgs);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};


/**
 * POST /api/messages/:partnerId
 * Body: { text }
 * Auto-create conversation if not exists, update last message
 */
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const { partnerId } = req.params;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const senderId = userId;
    const receiverId = partnerId;

    // ✅ 1️⃣ Check for duplicate message in last 2 seconds
    const recent = await Message.findOne({
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
      createdAt: { $gte: new Date(Date.now() - 2000) } // last 2 seconds
    });
    if (recent) {
      return res.status(200).json(recent); // early return, skip re-save
    }

    // ✅ 2️⃣ Create and save new message
    const newMsg = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      read: false,
    });
    await newMsg.save();

    // ✅ 3️⃣ Find or create conversation
    let conv = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conv) {
      conv = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: newMsg._id,
      });
    } else {
      conv.lastMessage = newMsg._id;
    }

    await conv.save();

    res.status(201).json(newMsg);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
