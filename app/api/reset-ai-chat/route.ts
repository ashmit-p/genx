// route.ts (frontend API route)
import { io } from 'socket.io-client';

export async function POST(req: Request) {
  const { roomId } = await req.json();

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: { token: req.headers.get('authorization')?.replace('Bearer ', '') }
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
