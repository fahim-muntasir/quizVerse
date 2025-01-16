import React from 'react'

export default function Explanation({ text }: { text: string }) {
  return (
    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <p className="text-sm text-blue-400">{text}</p>
    </div>
  )
}
