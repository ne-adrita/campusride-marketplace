import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage as sendMsg } from '../services/messageService';
import { getUserById } from '../services/userService';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaPaperPlane, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { sanitizeInput } from '../utils/sanitize';
import useRateLimit from '../hooks/useRateLimit';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const messagesEndRef = useRef(null);
  const initialLoadDone = useRef(false);
  const checkRateLimit = useRateLimit(2000);

  const fetchMessages = useCallback(async (userId) => {
    const { data, error: fetchError } = await getMessages(userId);
    if (fetchError) {
      console.error('Error fetching messages:', fetchError);
      toast.error(fetchError);
      return;
    }
    setMessages(data || []);
  }, []);

  const openConversation = useCallback(async (userId) => {
    const conv = conversations.find(c => c.user_id === userId);
    if (conv) {
      setCurrentConversation(conv);
      setMobileView(true);
      fetchMessages(conv.user_id);
      return;
    }
    const { data, error } = await getUserById(userId);
    if (error || !data) {
      toast.error(error || 'Could not load user');
      console.error('Error fetching user for new conversation:', error);
      return;
    }
    const newConv = {
      user_id: data.user_id || data._id || data.id,
      name: data.name,
      profile_pic: data.profile_pic || data.avatar,
      last_message: null,
    };
    setCurrentConversation(newConv);
    setMobileView(true);
    setMessages([]);
  }, [conversations, fetchMessages]);

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLoadDone.current) return;
    const userId = searchParams.get('user');
    if (userId && conversations.length > 0 || loading === false) {
      initialLoadDone.current = true;
      if (userId) openConversation(userId);
    }
  }, [searchParams, conversations, loading, openConversation]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchConversations = async () => {
    setError(null);
    const { data, error: fetchError } = await getConversations();
    if (fetchError) {
      setError(fetchError);
      toast.error(fetchError);
      setLoading(false);
      return;
    }
    setConversations(data || []);
    const userId = searchParams.get('user');
    if (!userId && data && data.length > 0) {
      setCurrentConversation(data[0]);
      fetchMessages(data[0].user_id);
    }
    setLoading(false);
  };

  const handleSelectConversation = (conv) => {
    setCurrentConversation(conv);
    setMobileView(true);
    fetchMessages(conv.user_id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const sanitized = sanitizeInput(newMessage.trim());
    if (!sanitized || !currentConversation) return;
    if (!checkRateLimit()) {
      toast.error('Please wait before sending another message');
      return;
    }
    setSending(true);
    const tId = toast.loading('Sending...');
    try {
      const { data, error: sendError } = await sendMsg(currentConversation.user_id, sanitized);
      toast.dismiss(tId);
      if (sendError) {
        toast.error(sendError);
        return;
      }
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      toast.success('Message sent');
      fetchConversations();
    } catch (err) {
      toast.dismiss(tId);
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    } finally { setSending(false); }
  };

  const handleInputChange = (e) => {
    setNewMessage(sanitizeInput(e.target.value));
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="min-h-screen bg-navy-50 py-8"><div className="container-custom"><div className="surface-card p-8 text-center"><p className="text-red-600">{error}</p><button onClick={fetchConversations} className="btn-primary mt-4">Retry</button></div></div></div>;

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Messages</h1>
        <Card className="overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversation list - hidden on mobile when viewing a chat */}
            <div className={`${mobileView ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-navy-100 overflow-y-auto flex-col`}>
              <div className="p-4 border-b border-navy-100 font-semibold text-navy-700">Conversations</div>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-navy-400">
                  <FaEnvelope className="text-navy-200 text-4xl mx-auto mb-3" />
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a conversation from a listing</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button key={conv.user_id} onClick={() => handleSelectConversation(conv)} className={`w-full flex items-center space-x-3 p-4 hover:bg-navy-50 border-b border-navy-100 focus-visible:bg-navy-50 focus-visible:ring-2 focus-visible:ring-primary-500 ${currentConversation?.user_id === conv.user_id ? 'bg-primary-50' : ''}`}>
                    <Avatar name={conv.name} src={conv.profile_pic} size="md" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-navy-700">{conv.name}</div>
                      <p className="text-sm text-navy-400 truncate">{conv.last_message || 'No messages'}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Chat area - visible on desktop always, on mobile only when mobileView true */}
            <div className={`${mobileView ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
              {currentConversation ? (
                <>
                  <div className="p-4 border-b border-navy-100 flex items-center space-x-3">
                    <button onClick={() => setMobileView(false)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-navy-100 focus-visible:ring-2 focus-visible:ring-primary-500" aria-label="Back to conversations">
                      <FaArrowLeft />
                    </button>
                    <Avatar name={currentConversation.name} src={currentConversation.profile_pic} size="md" />
                    <div><div className="font-medium text-navy-700">{currentConversation.name}</div></div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.message_id} className={`flex ${msg.sender_id === user?.user_id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender_id === user?.user_id ? 'bg-primary-600 text-white' : 'bg-navy-100 text-navy-800'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender_id === user?.user_id ? 'text-primary-200' : 'text-navy-400'}`}>{format(new Date(msg.sent_at), 'h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="p-4 border-t border-navy-100 flex space-x-2">
                    <Input type="text" placeholder="Type a message..." value={newMessage} onChange={handleInputChange} className="flex-1" />
                    <Button type="submit" isLoading={sending} className="px-4 focus-visible:ring-2 focus-visible:ring-primary-500"><FaPaperPlane /></Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-navy-400">
                  <div className="text-center"><FaEnvelope className="text-navy-200 text-4xl mx-auto mb-3" /><p className="text-lg">Select a conversation</p><p className="text-sm mt-1 md:hidden">Choose from the list</p></div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
