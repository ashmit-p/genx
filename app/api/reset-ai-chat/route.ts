// import { supabaseAdmin } from '@/lib/supabase/server';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { room_id } = body;

//     if (!room_id) {
//       console.error('Missing room_id');
//       return NextResponse.json({ error: 'Missing room_id' }, { status: 400 });
//     }

//     console.log('Attempting to delete messages in room:', room_id);

//     const { error } = await supabaseAdmin
//       .from('ai_messages')
//       .delete()
//       .eq('room_id', room_id);

//     if (error) {
//       console.error('Supabase delete error:', error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     console.log('Successfully deleted AI messages for', room_id);
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error('Unexpected server error:', err);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// route.ts (frontend API route)
import { io } from 'socket.io-client';

export async function POST(req: Request) {
  const { roomId } = await req.json();

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: { token }
  });

  return new Promise((resolve) => {
    socket.emit('reset_chat', roomId);

    socket.on('chat_reset_success', () => {
      resolve(new Response('Chat reset', { status: 200 }));
    });

    socket.on('error', (err) => {
      resolve(new Response(err, { status: 500 }));
    });
  });
}
