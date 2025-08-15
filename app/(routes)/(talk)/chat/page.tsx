'use client'

import Chat from "@/components/Chat"

// import { useState, useEffect } from 'react'
// import useUser from '@/lib/hooks/useUser'

export default function ChatPage() {
  // const [message, setMessage] = useState('')
  // const [loading, setLoading] = useState(false)

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (!message.trim()) return
    
  //   setLoading(true)
  //   // Add your chat logic here
  //   setLoading(false)
  //   setMessage('')
  // }

  return (
    <Chat />
    // <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
    //   <div className="flex-1 flex flex-col max-w-6xl mx-auto">
    //     {/* Chat Header */}
    //     <div className="px-6 py-4 border-b dark:border-gray-700">
    //       <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
    //         AI Therapist
    //       </h1>
    //     </div>

    //     {/* Messages Container */}
    //     <div className="flex-1 overflow-y-auto p-6 space-y-6">
    //       <div className="flex items-start space-x-4">
    //         <div className="flex-shrink-0">
    //           <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
    //             AI
    //           </div>
    //         </div>
    //         <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
    //           <p className="text-gray-800 dark:text-gray-200">
    //             Hello! How can I help you today?
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Message Input */}
    //     <form 
    //       onSubmit={handleSubmit}
    //       className="p-6 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
    //     >
    //       <div className="flex space-x-4">
    //         <input
    //           type="text"
    //           value={message}
    //           onChange={(e) => setMessage(e.target.value)}
    //           placeholder="Type your message..."
    //           className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
    //             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    //         />
    //         <button
    //           type="submit"
    //           disabled={loading || !message.trim()}
    //           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
    //             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    //         >
    //           {loading ? (
    //             <Loader2 className="w-5 h-5 animate-spin" />
    //           ) : (
    //             <Send className="w-5 h-5" />
    //           )}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  )
}