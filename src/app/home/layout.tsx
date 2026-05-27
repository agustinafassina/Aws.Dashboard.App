import React from 'react'
import SideBar from '@/components/organism/Sidebar'

const DirectoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4.75rem)]">
      <div className="flex flex-grow w-full">
        <SideBar />
        <main className="flex-grow bg-green_50 dark:bg-gray_800 w-[83%] overflow-x-auto transition-colors">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DirectoryLayout
