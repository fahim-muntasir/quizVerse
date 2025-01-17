import React from 'react';
import { cn } from '@/libs/utils';
import { CheckCircle, XCircle, Radio, Square } from 'lucide-react';

type QuestionOptionProps = {
  selectedAnswers: string[];
  correctAnswer: string[];
  questionType: string;
  option: string;
  index: string;
};

export default function ResultOption({
  selectedAnswers,
  correctAnswer,
  questionType,
  option,
  index,
}: QuestionOptionProps) {
  const isSelected = selectedAnswers?.includes(index);
  const isCorrect = correctAnswer?.includes(index);
  const isIncorrectSelection = isSelected && !isCorrect;
  const isMissedCorrect = !isSelected && isCorrect;
  const isWrong = isIncorrectSelection || isMissedCorrect;

  const baseClasses = "w-full text-left p-4 rounded-lg border transition-all";
  const selectedClass = isSelected
    ? isWrong
      ? "bg-red-500/10 border-red-500 text-white"
      : "bg-green-500/10 border-green-500 text-white"
    : "bg-[#343434] border-gray-700 text-gray-300";
  const missedCorrectClass = !isSelected && isCorrect ? "border-green-500/50 text-white" : "";

  const element = isCorrect ? (
    <CheckCircle className="w-5 h-5 text-green-500" />
  ) : isIncorrectSelection ? (
    <XCircle className="w-5 h-5 text-red-500" />
  ) : questionType === 'single' ? (
    <Radio className="w-5 h-5 text-gray-600" />
  ) : (
    <Square className="w-5 h-5 text-gray-600" />
  );

  return (
    <div className={cn(baseClasses, selectedClass, missedCorrectClass)}>
      <div className="flex items-center space-x-3">
        {element}
        <span>{option}</span>
      </div>
    </div>
  );
}
