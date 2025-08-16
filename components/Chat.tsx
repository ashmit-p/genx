/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Send, Loader2, User } from 'lucide-react';
import Image from 'next/image';
import { useSocket } from '@/lib/useSocket';
import useUser from '@/lib/hooks/useUser';
import { useParams, usePathname } from 'next/navigation';
import { fetchChatHistory } from '@/lib/messages';
import { Virtuoso } from 'react-virtuoso';
import ProtectedRoute from './ProtectedRoute';
import { motion } from 'framer-motion'


type Message = {
  id: number | string;
  user_id: string;
  username: string;
  content: string | { summary?: string; bullets?: string[]; steps?: string[]; note?: string };
  inserted_at: string;
  pending?: boolean; 
  avatar_url?: string;
};


export default function ChatPage() {
  const path = usePathname();
  const isAIChat = path?.includes('/chat');
  const isCommunityChat = path?.includes('/community');

  const { user, loading: userLoading } = useUser();
  
  const para = useParams().roomId;
  const roomId = isAIChat && user ? `ai-${user.id}` : para;

  const pathname = usePathname();

  const socketRef = useSocket(user?.accessToken);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true); 
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const headerText = isCommunityChat ? 'Community Chat' : 'AI Therapist';

  const fadeIn = {
    initial: { opacity : 0, y : 20},
    animate: { opacity : 1, y : 20},
    exit: { opacity : 0, y : -20}
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId) return;

    socket.emit('join_room', roomId);

    const handleReceive = (msg: Message) => {
       const parsedMsg = { ...msg };

      if (parsedMsg.username === 'TherapistBot' && typeof parsedMsg.content === 'string') {
        try {
          const json = JSON.parse(parsedMsg.content);
          parsedMsg.content = json;
        } catch {
        }
      }
        setInput('');
        setMessages((prev) => {
        const newMessages = [...prev, parsedMsg];

        const isFromUser = msg.user_id === user?.id && msg.username !== 'TherapistBot';
        if (isAIChat && isFromUser) {
          const thinkingMessage: Message = {
            id: 'pending-bot',
            user_id: 'bot',
            username: 'TherapistBot',
            content: '...',
            inserted_at: new Date().toISOString(),
            pending: true,
          };
          return [...newMessages, thinkingMessage];
        }

        if (msg.username === 'TherapistBot') {
          const withoutPending = prev.filter((m) => !m.pending);
          return [...withoutPending, msg];
        }

        return newMessages;
      });
    };


    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [roomId, socketRef, isAIChat, user?.id]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!roomId || userLoading) return;
      setLoading(true);
      const result = await fetchChatHistory(roomId as string, 10);
      setMessages(result.messages);
      setHasMore(result.hasMore);
      setLastMessageId(result.lastMessageId);
      setLastTimestamp(result.lastTimestamp); 
      setLoading(false);
      setFirstItemIndex(0);
      
    };

    loadInitialMessages();
  }, [roomId, userLoading]);


  const sendMessage = (e?: React.FormEvent) => {
    console.log("SENDING MESSAGE");
    
    e?.preventDefault();
    if (!input.trim() || !user || !socketRef.current || !roomId) return;

    const payload = {
      room_id: roomId,
      user_id: user.id,
      username: user.username || 'Anonymous',
      avatar_url: user.avatar_url || '',
      message: input,
    };

    socketRef.current.emit('send_message', payload);

  };

  const resetChat = async () => {
    if (!roomId || !user || !socketRef.current) return;

    const confirm = window.confirm('Are you sure you want to reset the AI chat?');
    if (!confirm) return;

    socketRef.current.emit('reset_chat', roomId);

    socketRef.current.once('chat_reset_success', () => {
      setMessages([]);
      setHasMore(true);
      setLastMessageId(null);
      setLastTimestamp(null);
      setFirstItemIndex(0);
    });
    

    socketRef.current.once('error', (err: string) => {
      alert(err || 'Failed to reset chat');
    });
  };

  return (
    <ProtectedRoute>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        <div className="flex-1 flex flex-col max-w-6xl mx-auto mt-8">

          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700 flex w-full justify-between max-md:justify-end items-center bg-white dark:bg-gray-900 rounded-t-xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 max-md:hidden">
              {headerText}
            </h1>
            {isAIChat && (
              <div className="flex justify-end">
                <button
                  onClick={resetChat}
                  className="text-sm text-rose-400 cursor-pointer px-4 py-2 rounded-md transition-colors z-50"
                >
                  Reset Chat
                </button>
              </div>
            )}
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-hidden relative">
            {loading && hasMore && messages.length > 0 && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-md">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Loading more messages...</span>
                </div>
              </div>
            )}
            <Virtuoso
              data={messages}
              followOutput
              initialTopMostItemIndex={messages.length - 1}
              overscan={200}
              startReached={async () => {
                if (!hasMore || loading || !roomId || !lastMessageId || !lastTimestamp) return;

                setLoading(true);
                const result = await fetchChatHistory(
                  roomId as string, 
                  10, 
                  lastMessageId, 
                  lastTimestamp
                );

                if (result.messages.length === 0) {
                  setHasMore(false);
                } else {
                  setMessages((prev) => [...result.messages, ...prev]);
                  setFirstItemIndex((prevIndex) => prevIndex - result.messages.length);
                  setLastMessageId(result.lastMessageId);
                  setLastTimestamp(result.lastTimestamp);
                  setHasMore(result.hasMore);
                }

                setLoading(false);
              }}
              itemContent={(index, msg) => {
                const isCurrentUser = msg.user_id === user?.id && msg.username !== 'TherapistBot';
                const isBot = msg.username === 'TherapistBot' || msg.user_id === process.env.BOT_ID;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start px-6 py-2 space-x-4 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white`}>
                     {msg.avatar_url ? (
                        <Image
                          src={msg.avatar_url.trim()}
                          alt={msg.username}
                          width={40}
                          height={40}
                          className="rounded-full self-center"
                        />
                      ) : (
                        <div className="bg-blue-500 h-full w-full flex items-center justify-center rounded-full text-white font-bold">
                          {(msg.username?.[0] || '?').toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className={`flex flex-col max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <span className="text-xs text-gray-500 mb-1">{msg.username}</span>
                      <div className={`rounded-xl px-4 py-3 shadow-md text-sm ${
                        isCurrentUser 
                          ? 'bg-emerald-500 text-white' 
                          : msg.pending
                            ? 'bg-emerald-100 text-emerald-700 italic dark:bg-emerald-900 dark:text-emerald-300'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}>
                         {msg.pending ? (
                            'TherapistBot is thinking...'
                          ) : typeof msg.content === 'string' ? (
                            msg.content
                          ) : (
                            <div className="space-y-2">
                              {msg.content.summary && <p className="font-semibold">{msg.content.summary}</p>}

                              {typeof msg.content === 'object' && Array.isArray(msg.content.bullets) && msg.content.bullets.length > 0 && (
                                <ul className="list-disc list-inside ml-2">
                                  {msg.content.bullets.map((point, i) => (
                                    <li key={i}>{point}</li>
                                  ))}
                                </ul>
                              )}

                              {typeof msg.content === 'object' && Array.isArray(msg.content.steps) && msg.content.steps.length > 0 && (
                                <ol className="list-decimal list-inside ml-2">
                                  {msg.content.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              )}

                              {msg.content.note && (
                                <p className="italic text-gray-600 dark:text-gray-300 mt-2">{msg.content.note}</p>
                              )}
                            </div>
                          )}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(msg.inserted_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              }}
              components={{
                Header: () => {
                  // Show "no more messages" indicator when we've reached the end
                  const noMoreMessages = !hasMore && messages.length > 0 && (
                    <div className="text-center py-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        No more messages to load
                      </span>
                    </div>
                  );

                  // Show AI chat welcome message for AI chats
                  const aiWelcome = isAIChat && (
                    <div className="flex items-start space-x-4 px-6 pt-6 pb-2">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-white">
                        <Image src="/bot-avatar.jpg" alt='Bot' height={45} width={45} className='rounded-full self-center' />
                      </div>
                      <div className="flex-1 max-w-[75%] bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow">
                        <p className="text-gray-800 dark:text-gray-100">
                          Hey! How can I help you today?
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <div>
                      {noMoreMessages}
                      {aiWelcome}
                    </div>
                  );
                }
              }}
              style={{ height: '100%' }}
            />
          </div>

          <motion.form
            initial={{ opacity : 0 }}
            animate={{ opacity : 1 }}
            onSubmit={sendMessage}
            className="p-4 mb-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-lg"
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={user ? 'Type your message...' : 'Log in to send messages'}
                className="flex-1 p-2 border border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/20 text-white"
                disabled={!user}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !input.trim() || !user}
                className="cursor-pointer px-3 py-2 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
