/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

 const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (type === 'signup') {
      if (!username.trim()) {
        setError('Username is required')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    let data, error

    if (type === 'login') {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }))
    } else {
      ({ data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      }))
      alert('We have sent you a confirmation email')
      router.push("/login")
    }

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      alert('Check your email for the password reset link')
    }
  }

   return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-90'>
      <form onSubmit={handleAuth} className="space-y-4 max-w-md mx-auto pt-52">
        <h2 className="text-2xl font-bold">{type === 'login' ? 'Login' : 'Sign Up'}</h2>
        {type === 'signup' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {type === 'signup' && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        )}
        <div className="flex flex-col gap-2">
          <button 
            type="submit" 
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>
          {type === 'login' && (
            <button 
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          )}
          <p className="text-center text-sm text-gray-600">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Link 
              href={type === 'login' ? '/sign-up' : '/login'} 
              className="text-blue-600 hover:underline"
            >
              {type === 'login' ? 'Sign up' : 'Login'}
            </Link>
          </p>
        </div>
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  )
}