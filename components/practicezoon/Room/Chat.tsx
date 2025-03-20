import React from 'react'
import { MessageCircle } from 'lucide-react';

export default function Chat() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        {/* Chat messages would go here */}
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-3 py-2 bg-background border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#343434] rounded-full transition-colors">
            <MessageCircle size={18} className="text-green-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
