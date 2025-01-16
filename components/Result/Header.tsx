import React from 'react'
import Link from 'next/link'
import { BookOpenCheck } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex justify-center mb-8">
      <Link href='/'>
        <div className="flex items-center gap-2 bg-[#2a2a2a]/50 backdrop-blur-lg px-4 py-2 rounded-full border border-gray-800">
          <BookOpenCheck className="w-6 h-6 text-green-500" />
          <span className="text-white font-bold text-xl">QuizLingo</span>
        </div>
      </Link>
    </div>
  )
}
