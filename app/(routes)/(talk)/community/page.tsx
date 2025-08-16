'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useUser from '@/lib/hooks/useUser';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Users } from 'lucide-react';

type Room = {
  id: string;
  name: string;
  created_at: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function RoomListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';

  const { user } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState('');
  const [inputValue, setInputValue] = useState(search);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const headers: HeadersInit = {}
        
        if (user?.accessToken) {
          headers['Authorization'] = `Bearer ${user.accessToken}`
        }
        
        const response = await fetch('/api/chat/rooms', {
          headers,
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat rooms')
        }
        
        const data = await response.json()
        setRooms(data.rooms || [])
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    };

    if (user) {
      fetchRooms();
    }
  }, [user]);

  const handleCreateRoom = async () => {
    if (!newRoom.trim() || !user) return;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (user?.accessToken) {
        headers['Authorization'] = `Bearer ${user.accessToken}`
      }
      
      const response = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newRoom.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create chat room')
      }

      const newRoomData = await response.json()
      
      setRooms(prevRooms => [...prevRooms, newRoomData]);
      router.push(`/community/${newRoomData.id}`);
      
      setNewRoom('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }

    router.push(`/community?${params.toString()}`);
  };

  const filteredRooms = search
    ? rooms.filter((room) => room.name.toLowerCase().includes(search))
    : rooms;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6"
    >
      <div className="max-w-2xl mx-auto pt-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-sky-500" />
            <h1 className="text-3xl font-light text-slate-700 dark:text-slate-200">
              Community Spaces
            </h1>
          </div>
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Space
            </motion.button>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search spaces..."
            value={inputValue}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl border-0 shadow-md focus:ring-2 focus:ring-sky-400 text-slate-700 dark:text-slate-200 placeholder-slate-400 transition-all"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          <AnimatePresence>
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                variants={itemVariants}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Link href={`/community/${room.id}`}>
                  <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-lg text-slate-700 dark:text-slate-200 group-hover:text-sky-500 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Created {new Date(room.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Create Room Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsCreating(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg w-full max-w-md"
              >
                <h2 className="text-2xl font-light text-slate-700 dark:text-slate-200 mb-4">
                  Create New Space
                </h2>
                <input
                  type="text"
                  placeholder="Enter space name..."
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 mb-4 text-slate-700 dark:text-slate-200"
                  autoFocus
                />
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateRoom}
                    className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-purple-500 text-white rounded-xl"
                  >
                    Create Space
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}