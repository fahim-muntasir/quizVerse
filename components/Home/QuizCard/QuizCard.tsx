"use client";

import React, { forwardRef } from "react";
import { cn } from "@/libs/utils";
import { Quiz } from "@/types/quiz";
import { QuizCardFooter } from "./QuizCardFooter";
import QuizCardAction from "./QuizCardAction";

type QuizCardProps = { quiz: Quiz };

export const QuizCard = forwardRef<HTMLDivElement, QuizCardProps>(
  ({ quiz }, ref) => {
    const {
      _id,
      title,
      description,
      category,
      difficulty,
      status,
      user
    } = quiz;

    const difficultyColor = {
      Easy: "bg-green-500/10 text-green-500 border-green-500/20",
      Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      Hard: "bg-red-500/10 text-red-500 border-red-500/20",
    }[difficulty];

    return (
      <div
        ref={ref}
        className="bg-background border border-gray-800 rounded-lg p-6 hover:border-green-500/50 transition-all"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={cn(
                  "text-sm px-3 py-1 rounded-full border",
                  difficultyColor
                )}
              >
                {difficulty}
              </span>
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          </div>
          <QuizCardAction id={_id} status={status} title={title} owner={user} />
        </div>

        <p className="text-gray-400 mb-4">{description}</p>

        <QuizCardFooter quiz={quiz} />
      </div>
    );
  }
);

QuizCard.displayName = "QuizCard";

