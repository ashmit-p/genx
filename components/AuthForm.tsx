/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

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

    try {
      if (type === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        toast.success('Logged in successfully!')
        router.push('/')
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        const response = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            username: username,
            email: email,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create user profile')
        }
        
        toast.success('Account created successfully! You can now login.')
        router.push("/login")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('user-not-found') || error.message.includes('(auth/invalid-credential)')) {
          toast.error('Account not found. Please sign up first.', {
            duration: 4000,
            icon: '⚠️',
          })
          setError('Account not found. Please sign up first.')
        } else if (error.message.includes('wrong-password') || error.message.includes('auth/wrong-password')) {
          toast.error('Incorrect password. Please try again.', {
            duration: 4000,
            icon: '🔒',
          })
          setError('Incorrect password. Please try again.')
        } else if (error.message.includes('invalid-email') || error.message.includes('auth/invalid-email')) {
          toast.error('Invalid email address.', {
            duration: 4000,
            icon: '📧',
          })
          setError('Invalid email address.')
        } else if (error.message.includes('weak-password') || error.message.includes('auth/weak-password')) {
          toast.error('Password should be at least 6 characters.', {
            duration: 4000,
            icon: '🔐',
          })
          setError('Password should be at least 6 characters.')
        } else if (error.message.includes('email-already-in-use') || error.message.includes('auth/email-already-in-use')) {
          toast.error('Email already in use. Please login instead.', {
            duration: 4000,
            icon: '👤',
          })
          setError('Email already in use. Please login instead.')
        } else {
          toast.error(error.message, {
            duration: 4000,
          })
          setError(error.message)
        }
      } else {
        const genericMessage = 'An unexpected error occurred'
        toast.error(genericMessage, {
          duration: 4000,
        })
        setError(genericMessage)
      }
    }
  }

const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Check your email for the password reset link', {
        duration: 5000,
        icon: '📧',
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('user-not-found') || error.message.includes('(auth/invalid-credential)')) {
          toast.error('No account found with this email. Please sign up first.', {
            duration: 4000,
            icon: '⚠️',
          })
          setError('No account found with this email. Please sign up first.')
        } else {
          toast.error(error.message, {
            duration: 4000,
          })
          setError(error.message)
        }
      } else {
        const genericMessage = 'An error occurred while sending reset email'
        toast.error(genericMessage, {
          duration: 4000,
        })
        setError(genericMessage)
      }
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
        {/* {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )} */}
      </form>
    </div>
  )
}