"use client";
import React from 'react';
import { BackgroundPattern } from '@/components/background/BackgroundPattern';
import Header from '@/components/Result/Header';
import Banner from '@/components/Result/Banner';
import Stats from '@/components/Result/Stats';
import QuestionsReview from '@/components/Result/QuestionsReview';
import Button from '@/components/ui/Button';
import { useGetResultByQuizIdQuery } from '@/libs/features/result/resultApiSlice';
import { useParams } from 'next/navigation';
import { isQuizResultResponse } from '@/utils/typeGuardsForResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import Error from '@/components/common/Error';

export default function QuizResult() {
  const { id } = useParams();
  const quizId = typeof id === "string" ? id : "";

  const { data: response, isLoading, isError } = useGetResultByQuizIdQuery(quizId);

  if (isError) {
    return <Error msg='Failed to fetch quiz result.' />;
  }

  // Type guard check
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isValidResponse = response && isQuizResultResponse(response);

  if (!isValidResponse) {
    return <Error msg='Invalid respnse!' />
  }

  const result = isValidResponse && response.data;

  const generateScore = (totalQuestion: number, correctAnswer: number) => {
    return (correctAnswer * 100) / totalQuestion
  }

  return (
    <div className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
      <BackgroundPattern />
      <div className="max-w-4xl mx-auto">
        {/* Branding Header */}
        <Header />

        {/* Achievement Banner */}
        <Banner score={generateScore(result.totalQuestion, result.correctAnswer)} quizTitle="test" />

        {/* Stats Grid */}
        <Stats timeTaken={"" + result.takenTime} correctAnswers={result.correctAnswer} totalQuestions={result.totalQuestion} />

        {/* Questions Review */}
        <QuestionsReview />

        {/* Call-to-Action Footer */}
        <div className="mt-12 bg-background backdrop-blur-lg rounded-lg p-6 text-center border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-2">Ready for Another Challenge?</h3>
          <p className="text-gray-400 mb-4">Test your knowledge with more quizzes on QuizVerse</p>

          <div className='flex justify-center'>
            <Button isDisabled={false}>
              Explore More Quizzes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}