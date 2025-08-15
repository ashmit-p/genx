import { DockDemo } from '@/components/Dock'
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='w-full'>
        <div className="container mx-auto relative">
            <DockDemo />
            {children}
        </div>
    </div>
  )
}

export default layout