'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <form onSubmit={handleReset} className="space-y-4 max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Update Password
      </button>
      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}
    </form>
  )
}