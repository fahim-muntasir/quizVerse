'use client';
import React, { useState } from 'react'
import { Image, Sticker, Film, Send, Book, Smile } from 'lucide-react'

export default function ChatInputs() {
  const [msg, setMsg] = useState('');

  return (
    <div className="h-24 mt-3 px-4 flex items-center border-t border-gray-800">
      <div className="relative w-full">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500 pr-24"
        />

        {/* Icons on the right */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {!msg &&
            <>
              <button className="p-1 hover:bg-[#343434] rounded-full transition-colors">
                <Smile size={18} className="text-gray-300" />
              </button>
              <button className="p-1 hover:bg-[#343434] rounded-full transition-colors">
                <Sticker size={18} className="text-gray-300" />
              </button>
              <button className="p-1 hover:bg-[#343434] rounded-full transition-colors">
                <Film size={18} className="text-gray-300" />
              </button>
              <button className="p-1 hover:bg-[#343434] rounded-full transition-colors">
                <Image size={18} className="text-gray-300" />
              </button>
              {/* Quiz Button */}
              <button className="p-1 hover:bg-[#343434] rounded-full transition-colors">
                <Book size={18} className="text-gray-300" />
              </button>
            </>}

          {msg &&
            <button className="p-1 hover:bg-green-600 bg-green-500 rounded-full transition-colors">
              <Send size={16} className="text-white" />
            </button>}
        </div>
      </div>
    </div>
  )
}
