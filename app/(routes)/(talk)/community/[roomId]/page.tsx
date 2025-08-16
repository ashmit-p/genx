'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useUser from '@/lib/hooks/useUser';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatPage from '@/components/Chat';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
}

export default function RoomChatPage() {
  const { roomId } = useParams();
  const { user } = useUser();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId || typeof roomId !== 'string' || !user?.accessToken) return;

    const fetchRoom = async () => {
      try {
        const headers: HeadersInit = {}
        
        if (user?.accessToken) {
          headers['Authorization'] = `Bearer ${user.accessToken}`
        }
        
        const response = await fetch(`/api/chat/rooms/${roomId}`, {
          headers,
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            console.error('Room not found')
            setRoom(null)
            return
          }
          throw new Error('Failed to fetch room details')
        }
        
        const data = await response.json()
        setRoom(data.room)
      } catch (error) {
        console.error('Error fetching room:', error);
        setRoom(null)
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, user?.accessToken]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!room) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chat room not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The chat room you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-full">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {room.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {room.description}
          </p>
        </div>
        <ChatPage />
      </div>
    </ProtectedRoute>
  );
}
