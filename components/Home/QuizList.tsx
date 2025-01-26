"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { QuizCard } from "./QuizCard";
import ParticipantsQuizModal from "@/components/ParticipantsQuizModal";
import { useGetQuizzesQuery } from "@/libs/features/quiz/quizApiSlice";
import QuizCardLoader from "./QuizCardLoader";
import { isQuizResponse } from "@/utils/typeGuards";
import { Quiz } from "@/types/quiz";
import Error from "../common/Error";

export default function QuizList() {
  const [hasData, setHasData] = useState(false);
  const [page, setPage] = useState(1);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);

  // Fetch data using RTK Query
  const { data: quizzes, isLoading, isError, isSuccess } = useGetQuizzesQuery({
    page,
    limit: 10,
  });

  // Validate the type of quizzes using the type guard
  const isValidResponse = quizzes && isQuizResponse(quizzes);

  useEffect(() => {
    if (hasData) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasData]);

  useEffect(() => {
    if (isSuccess && isValidResponse) {
      setAllQuizzes((prevQuizzes) => [...prevQuizzes, ...quizzes.data]);
    }
  }, [isSuccess, isValidResponse, quizzes]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastQuizElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isValidResponse && page < quizzes.pagination.totalPage) {
          setHasData(true);
        } else {
          setHasData(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [page, quizzes]  // Add `page` and `quizzes` as dependencies
  );

  // Helper function to render quiz cards
  const renderQuizCards = () => {
    if (allQuizzes.length === 0) {
      return <div>No quizzes available</div>;
    }

    return allQuizzes.map((quiz, index) => {
      const isLastQuiz = index === allQuizzes.length - 1;
      return (
        <QuizCard
          key={index}
          quiz={quiz}
          ref={isLastQuiz ? lastQuizElementRef : undefined}
        />
      );
    });
  };

  // Determine element based on loading, error, or data state
  const getElement = () => {
    if (isLoading) {
      return (
        <>
          <QuizCardLoader /> <QuizCardLoader /> <QuizCardLoader />
        </>
      );
    }

    if (isError) {
      return <Error msg="Error fetching quizzes" />;
    }

    return renderQuizCards();
  };

  // Usage
  const element = getElement();

  return (
    <>
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Available Quizzes
        </h2>
        <div className="grid gap-6">
          {element}
          {hasData && <><QuizCardLoader /> <QuizCardLoader /></>}
        </div>
      </div>
      <ParticipantsQuizModal />
    </>
  );
}
