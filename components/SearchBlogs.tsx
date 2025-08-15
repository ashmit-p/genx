"use client"
import React, { useState, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { ListFilter, OctagonX, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

const SearchBlogs = ({ initialSearch = '' }: { initialSearch?: string }) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [query, setQuery] = useState(initialSearch)
    const router = useRouter()
    const params = useSearchParams()

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        const current = new URLSearchParams(Array.from(params.entries()))
        if (query) {
            current.set('search', query)
        } else {
            current.delete('search')
        }
        router.push(`?${current.toString()}`)
        }, 400)

        return () => clearTimeout(delayDebounce)
    }, [query])

    function handleClose(){
        setInputVisible(!inputVisible)
        setQuery("")
    }

    return (
    <div className="flex-1 flex gap-3 justify-end items-center">
        <AnimatePresence>
            {inputVisible && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "200px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <input 
                        type='text' 
                        name='search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 
                        border border-gray-300 dark:border-gray-700 focus:outline-none 
                        focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
                        placeholder="Search blogs..."
                    />
                </motion.div>
            )}
        </AnimatePresence>
        <div className="size-fit p-1 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            <button 
                className='grid place-items-center' 
                onClick={() => handleClose()}
            >
                {!inputVisible ? <Search className='cursor-pointer' /> : <OctagonX className='cursor-pointer' />}
            </button>
        </div>
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ListFilter className='cursor-pointer' />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by:</p>
              </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  )
}

export default SearchBlogs