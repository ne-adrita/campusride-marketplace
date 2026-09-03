import { db, findUserById, sanitizeUser } from '../data/store.js';
import { generateId } from '../utils/ids.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/messages/conversations  (auth)
// Derives the list of people the current user has exchanged messages with,
// plus a preview of the last message - there's no separate "conversations"
// table, it's computed from the flat `messages` list.
export const getConversations = asyncHandler(async (req, res) => {
  const myId = req.user.user_id;
  const otherIds = new Set();
  db.messages.forEach((m) => {
    if (m.sender_id === myId) otherIds.add(m.receiver_id);
    if (m.receiver_id === myId) otherIds.add(m.sender_id);
  });

  const conversations = [...otherIds].map((otherId) => {
    const thread = db.messages
      .filter((m) => (m.sender_id === myId && m.receiver_id === otherId) || (m.sender_id === otherId && m.receiver_id === myId))
      .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
    const last = thread[thread.length - 1];
    const other = findUserById(otherId);
    return {
      user_id: otherId,
      name: other?.name || 'Unknown user',
      profile_pic: other?.avatar || null,
      last_message: last?.content || 'No messages',
      last_message_at: last?.sent_at || null,
    };
  });

  conversations.sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
  res.json(conversations);
});

// GET /api/messages/:userId  (auth) - full thread between me and :userId
export const getMessages = asyncHandler(async (req, res) => {
  const myId = req.user.user_id;
  const otherId = req.params.userId;

  const thread = db.messages
    .filter((m) => (m.sender_id === myId && m.receiver_id === otherId) || (m.sender_id === otherId && m.receiver_id === myId))
    .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));

  res.json(thread);
});

// POST /api/messages  (auth) - body: { receiver_id, content }
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiver_id, content } = req.body;
  if (!receiver_id || !content) {
    return res.status(400).json({ message: 'receiver_id and content are required' });
  }
  if (!findUserById(receiver_id)) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  const message = {
    message_id: generateId('msg_'),
    sender_id: req.user.user_id,
    receiver_id,
    content,
    sent_at: new Date().toISOString(),
  };
  db.messages.push(message);
  res.status(201).json(message);
});
