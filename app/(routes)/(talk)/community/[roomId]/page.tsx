/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// import { useEffect, useState } from 'react';
// import { useSocket } from '@/lib/useSocket';
// import { useParams } from 'next/navigation';
// import { createClient } from '@supabase/supabase-js';
// import useUser from '@/lib/hooks/useUser';
import ChatPage from '@/components/Chat';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

type Message = {
  id: string;
  username: string;
  content: string;
  inserted_at: string;
};

export default function RoomChatPage() {
//   const { roomId } = useParams();
//   const { user } = useUser(); 
//  const socketRef = useSocket(user?.accessToken);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//     if (!socketRef.current || !roomId) return;

//     socketRef.current.emit('join_room', roomId);

//     socketRef.current.on('receive_message', (msg: Message) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socketRef.current?.off('receive_message');
//     };
//   }, [roomId, socketRef.current]);

//   // Fetch message history
//   useEffect(() => {
//     const loadHistory = async () => {
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('id, username, content, inserted_at')
//         .eq('room_id', roomId)
//         .order('inserted_at');

//         if(error) console.log("Error sending message", error);
        
//         console.log("Received messages : ", data);
        
//       if (data) setMessages(data);
//     };

//     loadHistory();
//   }, [roomId]);

//   const sendMessage = () => {
//     if (!input.trim() || !user) return;

//     socketRef.current?.emit('send_message', {
//       room_id: roomId,
//       user_id: user.id,
//       username: user.email || 'Anonymous',
//       message: input
//     });

//     setInput('');
//   };

  return (
    // <div className="p-4 max-w-md mx-auto">
    //   <h1 className="text-xl font-semibold mb-2">Chat Room: {roomId}</h1>

    //   <div className="h-64 overflow-y-scroll bg-gray-100 rounded p-2 mb-2">
    //     {messages.map((msg) => (
    //       <div key={msg.id} className="mb-1">
    //         <strong>{msg.username}:</strong> {msg.content}
    //       </div>
    //     ))}
    //   </div>

    //   <input
    //     className="border rounded px-2 py-1 mr-2 w-2/3"
    //     placeholder="Type your message..."
    //     value={input}
    //     onChange={(e) => setInput(e.target.value)}
    //     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
    //   />
    //   <button
    //     className="bg-blue-500 text-white px-3 py-1 rounded"
    //     onClick={sendMessage}
    //   >
    //     Send
    //   </button>
    // </div>
    <ChatPage />
  );
}
