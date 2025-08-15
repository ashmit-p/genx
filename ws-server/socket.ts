import 'dotenv/config'
import { getGeminiResponse } from './lib/ai/gemini';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabaseAdmin';
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

    const supabaseWithToken = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );


    const { data, error } = await supabaseWithToken.auth.getUser();
    
    if (error || !data?.user) {
      return next(new Error('Unauthorized: Invalid token'));
    }
    
    socket.data.user = data.user;
    socket.data.supabase = supabaseWithToken;
    next();
  });


  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.user.id);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });
    
    socket.on('reset_chat', async (roomId: string) => {
      const user = socket.data.user;
      if (!user) return socket.emit('error', 'Unauthorized');

      try {
        await redis.del(`context:${roomId}`);

        await supabaseAdmin
          .from('ai_messages')
          .delete()
          .eq('room_id', roomId)

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
      const supabase = socket.data.supabase;

      const isAIChat = room_id.startsWith('ai-');

      const { data: userRow, error: userError } = await supabase
        .from('users')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      const username = userRow?.username || 'Anonymous';
      const avatar_url = userRow?.avatar_url || ''; 

      if (isAIChat) {

        const { count, error: countError } = await supabase
          .from('ai_messages')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room_id);

        if (countError || count === null) {
          console.error('Failed to get message count:', countError);
          return socket.emit('error', 'Failed to check message limit');
        }

        if (count >= 200) {
          return socket.emit('error', 'Chat limit reached. Please reset the chat to continue.');
        }


        const { error: insertUserError } = await supabase.from('ai_messages').insert([
          {
            room_id,
            user_id: user.id,
            role: 'user',
            content: message,
            avatar_url,
            inserted_at: new Date().toISOString(),
          },
        ]);

        await saveMessageToContext(room_id, `User: ${message}`);
        const contextMessages = await getContextMessages(room_id);

        if (insertUserError) {
          console.error('Failed to insert user AI message:', insertUserError);
          return socket.emit('error', 'Failed to save message');
        }

        io.to(room_id).emit('receive_message', {
          id: Date.now(), 
          room_id,
          user_id: user.id,
          username: 'You',
          avatar_url,
          content: message,
          inserted_at: new Date().toISOString(),
        });

        const botReply = await getGeminiResponse(message, contextMessages);

        const { data: botInserted, error: botInsertError } = await supabase
          .from('ai_messages')
          .insert([
            {
              room_id,
              user_id: user.id, 
              role: 'assistant',
              content: botReply,
              avatar_url: '/bot-avatar.jpg',
              inserted_at: new Date().toISOString(),
            },
          ])
          .select();


        if (botInsertError || !botInserted) {
          console.error('Failed to insert AI reply:', botInsertError);
          return socket.emit('error', 'AI response failed');
        }

        // THIS IS THE BOT REPLY

        io.to(room_id).emit('receive_message', {                                
          id: botInserted[0].id,
          room_id,
          user_id: user.id,
          username: 'TherapistBot',
          content: botInserted[0].content,
          avatar_url,
          inserted_at: botInserted[0].inserted_at,
        });

        await saveMessageToContext(room_id, `AI: ${botReply}`);

      } else {

        // COMMUNITY MESSAGE 

        const { data: inserted, error } = await supabase
          .from('chat_messages')
          .insert([
            {
              room_id,
              user_id: user.id,
              username,
              content: message,
              avatar_url,
              inserted_at: new Date().toISOString(),
            },
          ])
          .select();

          const messageToEmit = {
            ...inserted[0],
            avatar_url, 
          };

        if (error || !inserted) {
          console.error('Insert error:', error);
          socket.emit('error', 'Failed to save message');
          return;
        }

        io.to(room_id).emit('receive_message', messageToEmit);
      }
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
