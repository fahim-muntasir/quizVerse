import React from "react";
import { GripVertical, Award, Trash2, Edit2, List, Tag } from "lucide-react";
import { Question } from "@/types/quizCreateModal";

type QuestionListProps = {
  questions: Question[];
  onEditQuestion: (index: number) => void;
  onRemoveQuestion: (index: number) => void;
};

export default function QuestionList({
  questions,
  onEditQuestion,
  onRemoveQuestion,
}: QuestionListProps) {
  return (
    <div className={`${questions.length > 0 && "mb-6"}`}>
      {questions.length > 0 && (
        <h3 className="text-md font-medium text-white mb-4">
          Questions ({questions.length})
        </h3>
      )}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-[#343434] p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <button type="button" className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-grab">
                <GripVertical className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-gray-400 font-medium">
                        Question #{index + 1}
                      </h4>
                    </div>
                    <p className="text-white text-sm">{question.text}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditQuestion(index)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit Question"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveQuestion(index)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1 text-green-500">
                    <Award className="w-4 h-4" />
                    <span>{question.marks} marks</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-500">
                    <List className="w-4 h-4" />
                    <span>{question.options.length} options</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-500">
                    <Tag className="w-4 h-4" />
                    <span>{question.type}</span>
                  </div>
                  {/* {question.timeLimit && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Clock className="w-4 h-4" />
                    <span>{question.timeLimit}s</span>
                  </div>
                )} */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
