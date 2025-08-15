'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket(token?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
      });
    } else {
      socketRef.current.auth = { token };
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const socket = socketRef.current;

    socket?.on('connect_error', (err) => {
      console.error('Socket error:', err.message);
    });

    return () => {
      socket?.off('connect_error');
    };
  }, []);

  return socketRef;
}
