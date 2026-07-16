import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaPaperPlane } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const initialLoadDone = useRef(false);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data);
    } catch (error) { console.error('Error fetching messages:', error); }
  }, []);

  const openConversation = useCallback(async (userId) => {
    const conv = conversations.find(c => c.user_id === userId);
    if (conv) {
      setCurrentConversation(conv);
      fetchMessages(conv.user_id);
      return;
    }
    try {
      const { data } = await api.get(`/users/${userId}`);
      const newConv = {
        user_id: data.user_id || data._id || data.id,
        name: data.name,
        profile_pic: data.profile_pic || data.avatar,
        last_message: null,
      };
      setCurrentConversation(newConv);
      setMessages([]);
    } catch (error) {
      toast.error('Could not load user');
      console.error('Error fetching user for new conversation:', error);
    }
  }, [conversations, fetchMessages]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (initialLoadDone.current) return;
    const userId = searchParams.get('user');
    if (userId && !user?.user_id === !userId) {
      if (conversations.length > 0 || loading === false) {
        initialLoadDone.current = true;
        openConversation(userId);
      }
    } else if (!userId && loading === false) {
      initialLoadDone.current = true;
    }
  }, [searchParams, conversations, loading, user, openConversation]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
      const userId = searchParams.get('user');
      if (!userId && data.length > 0) {
        setCurrentConversation(data[0]);
        fetchMessages(data[0].user_id);
      }
    } catch (error) { console.error('Error fetching conversations:', error); }
    finally { setLoading(false); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;
    setSending(true);
    try {
      const { data } = await api.post('/messages', {
        receiver_id: currentConversation.user_id,
        content: newMessage.trim(),
      });
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      fetchConversations();
    } catch (error) { console.error('Error sending message:', error); }
    finally { setSending(false); }
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <Card className="overflow-hidden">
          <div className="flex h-[600px]">
            <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 font-semibold">Conversations</div>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <button key={conv.user_id} onClick={() => { setCurrentConversation(conv); fetchMessages(conv.user_id); }} className={`w-full flex items-center space-x-3 p-4 hover:bg-gray-50 border-b border-gray-100 ${currentConversation?.user_id === conv.user_id ? 'bg-primary-50' : ''}`}>
                    <Avatar name={conv.name} src={conv.profile_pic} size="md" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{conv.name}</div>
                      <p className="text-sm text-gray-500 truncate">{conv.last_message || 'No messages'}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="hidden md:flex flex-1 flex-col">
              {currentConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                    <Avatar name={currentConversation.name} src={currentConversation.profile_pic} size="md" />
                    <div><div className="font-medium">{currentConversation.name}</div></div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.message_id} className={`flex ${msg.sender_id === user?.user_id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender_id === user?.user_id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender_id === user?.user_id ? 'text-primary-200' : 'text-gray-500'}`}>{format(new Date(msg.sent_at), 'h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex space-x-2">
                    <Input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1" />
                    <Button type="submit" isLoading={sending} className="px-4"><FaPaperPlane /></Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center"><p className="text-lg">Select a conversation</p></div>
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