import React from 'react'
import Question from '../common/Question';
// import Explanation from './Explanation';
import ResultOption from '../common/ResultOption';
import { useParams } from 'next/navigation';
import { useGetResultByQuizIdQuery } from '@/libs/features/result/resultApiSlice';
import { isQuizResultResponse } from '@/utils/typeGuardsForResult';
import Error from '../common/Error';
import LoadingSpinner from '../LoadingSpinner';

export default function QuestionsReview() {
  const { id } = useParams();
  const quizId = typeof id === "string" ? id : "";

  const { data, isLoading, isError } = useGetResultByQuizIdQuery(quizId);

  if (isError) {
    return <Error msg='Failed to fetch quiz result.' />;
  }

  // Type guard check
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isValidResponse = data && isQuizResultResponse(data);

  if (!isValidResponse) {
    return <Error msg='Invalid respnse!' />
  }

  const response = isValidResponse && data.data;

  return (
    <div className="space-y-6">
      {response.results.map((result, index) => (
        <div
          key={result.question._id}
          className="bg-background backdrop-blur-lg rounded-lg p-6 border border-gray-800"
        >
          <Question
            currentQuestionIndex={index}
            marks={result.question.marks}
            type={result.question.type}
            text={result.question.text}
            isCorrectAnswer={result.isCorrectAnswer}
            isLabel={true}
          />

          <div className="space-y-3">
            {result.question.options.map((option, optionIndex) => (
              <ResultOption
                key={optionIndex}
                index={optionIndex.toString()}
                selectedAnswers={response.selectedAnswers[result.question._id]}
                questionType={result.question.type}
                option={option}
                correctAnswer={result.question.correctAnswer}
              />
            ))}
          </div>

          {/* Uncomment if explanation feature is needed */}
          {/* {result.question.explanation && (
        <Explanation text={result.question.explanation} />
      )} */}
        </div>
      ))}
    </div>
  )
}
