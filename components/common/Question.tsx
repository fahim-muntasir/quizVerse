import React from 'react'
import { HelpCircle } from 'lucide-react';

type QuestionProps = {
  currentQuestionIndex: number;
  marks: number;
  type: string;
  text: string;
}

export default function Question({ currentQuestionIndex, marks, type, text }: QuestionProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-400">Question {currentQuestionIndex + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Points:</span>
          <span className="text-sm font-medium text-green-500">{marks}</span>
        </div>
      </div>

      <h3 className="text-xl text-white font-medium mb-4">{text}</h3>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#343434] text-sm mb-6">
        <span className="text-gray-400">Type:</span>
        <span className="text-white font-medium">
          {type === 'single' ? 'Single Choice' : 'Multiple Choice'}
        </span>
      </div>
    </>
  )
}
