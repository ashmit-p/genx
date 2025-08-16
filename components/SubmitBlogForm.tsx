'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { getAuth } from 'firebase/auth'
import { ChevronDown, ChevronUp } from 'lucide-react'; 
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast';
import useUser from '@/lib/hooks/useUser'

export default function SubmitBlogForm() {
  const [title, setTitle] = useState('')
  const [showGuide, setShowGuide] = useState(false);
  const [desc, setDesc] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!user?.accessToken) {
      toast.error('Please log in to submit a blog');
      setLoading(false)
      return;
    }

    const res = await fetch('/api/blogs/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ title, content, desc }),
    });
    setLoading(false)

    if (res.ok) {
      toast.success('Your blog has been submitted and will be published after review by moderators.');
      router.push('/blogs') 
    } else {
      const err = await res.json()
      toast.error(err.error || '❌ Submission failed.');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mb-12">
        <Input
          placeholder="Blog title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <Textarea 
          placeholder='Write you description here...'
          rows={1}
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <Textarea
          placeholder="Write your blog content here..."
          rows={10}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className={`bg-gray-600 hover:bg-gray-700 cursor-pointer text-white`} >
          {loading ? 'Submitting...' : 'Submit Blog'}
        </Button>
      </form>
       <div className="max-w-2xl mb-6">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm transition cursor-pointer"
        >
          {showGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showGuide ? 'Hide Markdown Guide' : 'Show Markdown Guide'}
        </button>

          <AnimatePresence>
          {showGuide && (
            <motion.div
              key="markdown-guide"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-gray-800 text-white rounded-md shadow-md text-sm">
                <h2 className="text-lg font-semibold mb-2">📝 Markdown Formatting Guide</h2>
                <ul className="space-y-1 list-disc pl-5">
                  <li>
                    <code className="bg-gray-700 px-1 rounded"># Heading 1</code>, <code>## Heading 2</code>, etc.
                  </li>
                  <li>
                    <code className="bg-gray-700 px-1 rounded">**bold text**</code>, <code>*italic text*</code>
                  </li>
                  <li>
                    <code className="bg-gray-700 px-1 rounded">- List item</code> or <code>* List item</code>
                  </li>
                  <li>
                    <code className="bg-gray-700 px-1 rounded">[Link text](https://example.com)</code>
                  </li>
                  <li>
                    <code className="bg-gray-700 px-1 rounded">&gt; Blockquote</code> for quotes
                  </li>
                  <li>
                    <code className="bg-gray-700 px-1 rounded">---</code> or <code>***</code> for horizontal line
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
