import 'dotenv/config'
import { getGeminiResponse } from './lib/ai/gemini';
import { db } from './firebase';
import { getAuth } from 'firebase-admin/auth';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface ChatMessage {
  room_id: string;
  user_id: string;
  username: string;
  message: string;
}

async function saveMessageToContext(roomId: string, message: string) {
  const key = `context:${roomId}`;
  await redis.lpush(key, message);
  await redis.ltrim(key, 0, 19); 
}

async function getContextMessages(roomId: string): Promise<string[]> {
  const key = `context:${roomId}`;
  const messages = await redis.lrange(key, 0, 19);
  return messages.reverse(); 
}

export default function socketHandler(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Unauthorized: No token provided'));
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      socket.data.user = decodedToken;
      next();
    } catch (error) {
      return next(new Error('Unauthorized: Invalid token'));
    }
  });


  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.user.uid);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`${socket.data.user.uid} (${socket.id}) joined room ${roomId}`);
    });
    
    socket.on('reset_chat', async (roomId: string) => {
      const user = socket.data.user;
      if (!user) return socket.emit('error', 'Unauthorized');

      try {
        await redis.del(`context:${roomId}`);

        const aiMessagesRef = db.collection('ai_messages');
        const messagesQuery = aiMessagesRef.where('room_id', '==', roomId);
        const snapshot = await messagesQuery.get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        socket.emit('chat_reset_success');
      } catch (err) {
        console.error('Reset error:', err);
        socket.emit('error', 'Failed to reset chat');
      }
    });



    socket.on('send_message', async (data: ChatMessage) => {
      const user = socket.data.user;
      if (!user) return socket.emit('error', 'Unauthorized');

      const { room_id, message } = data;
      const isAIChat = room_id.startsWith('ai-');

      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        const username = userData?.username || 'Anonymous';
        const avatar_url = userData?.avatar_url || '';

        if (isAIChat) {
          const aiMessagesRef = db.collection('ai_messages');
          const countQuery = aiMessagesRef.where('room_id', '==', room_id);
          const countSnapshot = await countQuery.get();
          
          if (countSnapshot.size >= 200) {
            return socket.emit('error', 'Chat limit reached. Please reset the chat to continue.');
          }

          const userMessage = {
            room_id,
            user_id: user.uid,
            role: 'user',
            content: message,
            avatar_url,
            inserted_at: new Date(),
          };
          
          const userDoc = await aiMessagesRef.add(userMessage);
          await saveMessageToContext(room_id, `User: ${message}`);
          const contextMessages = await getContextMessages(room_id);

          io.to(room_id).emit('receive_message', {
            id: userDoc.id,
            room_id,
            user_id: user.uid,
            username: 'You',
            avatar_url,
            content: message,
            inserted_at: new Date().toISOString(),
          });

          const botReply = await getGeminiResponse(message, contextMessages);

          const botMessage = {
            room_id,
            user_id: user.uid,
            role: 'assistant',
            content: botReply,
            avatar_url: '/bot-avatar.jpg',
            inserted_at: new Date(),
          };

          const botDoc = await aiMessagesRef.add(botMessage);

          io.to(room_id).emit('receive_message', {
            id: botDoc.id,
            room_id,
            user_id: user.uid,
            username: 'TherapistBot',
            content: botReply,
            avatar_url: '/bot-avatar.jpg',
            inserted_at: new Date().toISOString(),
          });

          await saveMessageToContext(room_id, `AI: ${botReply}`);

        } else {
          const chatMessage = {
            room_id,
            user_id: user.uid,
            username,
            content: message,
            avatar_url,
            inserted_at: new Date(),
          };

          const chatDoc = await db.collection('chat_messages').add(chatMessage);

          io.to(room_id).emit('receive_message', {
            id: chatDoc.id,
            ...chatMessage,
            inserted_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', 'Failed to save message');
      }
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
