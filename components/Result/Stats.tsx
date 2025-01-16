import React from 'react'
import { Clock, BarChart3, Brain } from "lucide-react"

type StatsProps = {
  timeTaken: string;
  correctAnswers: number;
  totalQuestions: number;
}

export default function Stats({ timeTaken, correctAnswers, totalQuestions }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-background backdrop-blur-lg rounded-lg p-6 text-center border border-gray-800">
        <Clock className="w-12 h-12 text-blue-500 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{timeTaken}</div>
        <p className="text-gray-400">Time Taken</p>
      </div>
      <div className="bg-background backdrop-blur-lg rounded-lg p-6 text-center border border-gray-800">
        <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{correctAnswers}/{totalQuestions}</div>
        <p className="text-gray-400">Correct Answers</p>
      </div>
      <div className="bg-background backdrop-blur-lg rounded-lg p-6 text-center border border-gray-800">
        <Brain className="w-12 h-12 text-purple-500 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{Math.round((correctAnswers / totalQuestions) * 100)}%</div>
        <p className="text-gray-400">Accuracy</p>
      </div>
    </div>
  )
}
