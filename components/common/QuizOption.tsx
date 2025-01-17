import React from 'react'
import { cn } from '@/libs/utils'
import { Radio, Square } from 'lucide-react'

type QuizOptionProps = {
  onClickHandler: () => void;
  selectedAnswers: string[];
  questionType: string;
  option: string;
  index: string;
}

export default function QuizOption({ onClickHandler, selectedAnswers, questionType, option, index }: QuizOptionProps) {
  return (
    <button
      onClick={onClickHandler}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        selectedAnswers?.includes(index)
          ? "bg-green-500/10 border-green-500 text-white"
          : "bg-[#343434] border-gray-700 text-gray-300 hover:border-green-500/50"
      )}
    >
      <div className="flex items-center space-x-3">
        {questionType === 'single' ? (
          <Radio className={cn(
            "w-5 h-5",
            selectedAnswers?.includes(index)
              ? "text-green-500"
              : "text-gray-600"
          )} />
        ) : (
          <Square className={cn(
            "w-5 h-5",
            selectedAnswers?.includes(index)
              ? "text-green-500"
              : "text-gray-600"
          )} />
        )}
        <span>{option}</span>
      </div>
    </button>
  )
}
