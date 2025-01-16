import React from 'react'

type ProgressBarProps = {
  currentQuestionIndex: number;
  questionLength: number;
}

export default function ProgressBar({ currentQuestionIndex, questionLength }: ProgressBarProps) {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <span>Progress</span>
        <span>{currentQuestionIndex + 1}/{questionLength}</span>
      </div>
      <div className="h-1.5 bg-[#343434] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questionLength) * 100}%` }}
        />
      </div>
    </div>
  )
}
