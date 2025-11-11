// server/src/models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  { timestamps: true }
);

// prevent duplicate conversation between same users
// conversationSchema.index({ participants: 1 }, { unique: false });

module.exports = mongoose.model('Conversation', conversationSchema);
