import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
// import socketHandler from './socket';
import socketHandler from './socket';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const PORT = 4000;
const app = express();
const httpServer = createServer(app);

app.use(cors());
console.log('[ws-server] Starting WebSocket server...');


const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST']
  }
});

app.get('/', (req, res) => {
  res.send('🧠 WebSocket server is running!');
});


async function main() {
  const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  socketHandler(io);

  httpServer.listen(PORT, () => {
    console.log(`WebSocket server listening at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Server failed to start:', err);
});
