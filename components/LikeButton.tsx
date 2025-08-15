'use client'

import { useEffect, useState } from 'react'
import useUser from '@/lib/hooks/useUser'
import { Heart } from 'lucide-react'

export default function LikeButton({ blogId, initialLiked }: { blogId: string, initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  useEffect(() => {
    setLiked(initialLiked)
  }, [initialLiked])


  const handleLike = async () => {
    setLoading(true)

    if (!user?.accessToken) {
    alert('You must be logged in to like a blog.')
    return
    }

    const res = await fetch('/api/like-blog', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`, 
    },
    body: JSON.stringify({ blogId }),
    })


    if (res.ok) {
      const { liked } = await res.json()
      setLiked(liked)
    } else {
      const { error } = await res.json()
      alert(error || 'Failed to like blog')
    }

    setLoading(false)
  }

  return (
    <button 
      onClick={handleLike}
      disabled={loading}
      className="text-sm text-white px-3 py-1 rounded cursor-pointer"
    >
      {loading ? '...' : <Heart fill={liked ? 'pink' : 'none'} />}
    </button>
  )
}
