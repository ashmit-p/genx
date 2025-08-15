// import { DockDemo } from '@/components/Dock'
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='w-full min-h-screen text-[#8cabaa] bg-gradient-to-b from-[#1e2e28] to-[#2f4f4f]'>
        <div className="container mx-auto">
            {/* <DockDemo /> */}
            {children}
        </div>
    </div>
  )
}

export default layout