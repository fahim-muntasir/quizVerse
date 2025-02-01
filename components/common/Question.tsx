import React from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

type QuestionProps = {
  currentQuestionIndex: number;
  marks: number;
  type: string;
  text: string;
  isCorrectAnswer?: boolean;
  isLabel?: boolean;
};

export default function Question({
  currentQuestionIndex,
  marks,
  type,
  text,
  isCorrectAnswer,
  isLabel,
}: QuestionProps) {
  return (
    <>
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-400">
            Question {currentQuestionIndex + 1}
          </span>

          {isLabel && (
            <div
              className={`inline-flex items-center gap-1 px-3 py-[1px] rounded-md text-sm 
                ${isCorrectAnswer ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
            >
              {isCorrectAnswer ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="font-medium">
                {isCorrectAnswer ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          )}
        </div>
        
        {/* Points */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Points:</span>
          <span className="text-sm font-medium text-green-500">{marks}</span>
        </div>
      </div>

      {/* Question Text */}
      <h3 className="text-xl text-white font-medium mb-4">{text}</h3>

      {/* Question Type Label */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#343434] text-sm mb-6">
        <span className="text-gray-400 font-medium">
          {type === 'single' ? 'Single Choice' : 'Multiple Choice'}
        </span>
      </div>
    </>
  );
}
