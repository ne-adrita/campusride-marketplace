import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/messages/conversations  (auth)
// Derives the list of people the current user has exchanged messages with,
// plus a preview of the last message - there's no separate "conversations"
// collection, it's computed from the flat `messages` collection.
export const getConversations = asyncHandler(async (req, res) => {
  const myId = new mongoose.Types.ObjectId(req.user.user_id);

  const thread = await Message.find({ $or: [{ sender_id: myId }, { receiver_id: myId }] }).sort({ sent_at: 1 });

  const byOther = new Map();
  for (const m of thread) {
    const otherId = m.sender_id.equals(myId) ? m.receiver_id.toString() : m.sender_id.toString();
    byOther.set(otherId, m); // sorted ascending, so the last write wins = most recent message
  }

  const others = await User.find({ _id: { $in: [...byOther.keys()] } });
  const conversations = others.map((u) => {
    const last = byOther.get(u._id.toString());
    return {
      user_id: u._id.toString(),
      name: u.name,
      profile_pic: u.avatar,
      last_message: last.content,
      last_message_at: last.sent_at,
    };
  });

  conversations.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
  res.json(conversations);
});

// GET /api/messages/:userId  (auth) - full thread between me and :userId
export const getMessages = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) return res.json([]);
  const myId = req.user.user_id;
  const otherId = req.params.userId;

  const thread = await Message.find({
    $or: [{ sender_id: myId, receiver_id: otherId }, { sender_id: otherId, receiver_id: myId }],
  }).sort({ sent_at: 1 });

  res.json(thread);
});

// POST /api/messages  (auth) - body: { receiver_id, content }
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiver_id, content } = req.body;
  if (!receiver_id || !content) {
    return res.status(400).json({ message: 'receiver_id and content are required' });
  }
  if (!mongoose.isValidObjectId(receiver_id) || !(await User.exists({ _id: receiver_id }))) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  const message = await Message.create({
    sender_id: req.user.user_id,
    receiver_id,
    content,
  });
  res.status(201).json(message);
});
