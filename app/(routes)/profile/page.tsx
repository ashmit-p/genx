'use client'

import { supabase } from '@/lib/supabase/client'
import useUser from '@/lib/hooks/useUser'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogOut, KeyRound, FileText } from 'lucide-react'
import AvatarUploader from '@/components/AvatarUploader'

export default function ProfilePage() {
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) router.push('/login')
  }

  const handleResetPassword = async () => {
    if (!user) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error('Error resetting password:', error.message)
    } else {
      alert('Check your email for the password reset link')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-[#1e2e28] to-[#2f4f4f] flex items-center justify-center px-4">
        <motion.div
          className="w-full grid max-w-md bg-emerald-50 dark:bg-emerald-950 rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full flex justify-center items-center mb-6">
            <AvatarUploader />
          </div>

          <motion.h1
            className="text-3xl font-bold mb-6 text-emerald-800 dark:text-emerald-200 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Profile
          </motion.h1>

          <div className="space-y-4 text-gray-800 dark:text-white">
            <div>
              <label className="text-sm text-emerald-600 dark:text-emerald-400">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            {user?.username && (
              <div>
                <label className="text-sm text-emerald-600 dark:text-emerald-400">Username</label>
                <p className="text-lg">{user.username}</p>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4">
            <motion.button
              onClick={handleResetPassword}
              className="cursor-pointer flex items-center gap-2 justify-center w-full px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              whileTap={{ scale: 0.97 }}
            >
              <KeyRound size={18} /> Reset Password
            </motion.button>

            {user && (
              <Link href={`blogs/my-blogs/${user.username}`} passHref>
                <motion.button
                  className="cursor-pointer flex items-center gap-2 justify-center w-full px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
                  whileTap={{ scale: 0.97 }}
                >
                  <FileText size={18} /> Your Blogs
                </motion.button>
              </Link>
            )}

            <motion.button
              onClick={handleSignOut}
              className="cursor-pointer flex items-center gap-2 justify-center w-full px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition"
              whileTap={{ scale: 0.97 }}
            >
              <LogOut size={18} /> Sign Out
            </motion.button>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
