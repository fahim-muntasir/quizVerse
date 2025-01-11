import React from "react";
import { cn } from "@/libs/utils";
import {
  Plus,
  Trash2,
  GripVertical,
  Award,
} from "lucide-react";
import { Question } from "@/types/quizCreateModal";

type QuestionFormProps = {
  questions: Question[],
  removeQuestion: (id: number) => void,
  setCurrentQuestion: (currentQuestion: Partial<Question>) => void,
  currentQuestion: Partial<Question>,
  handleOptionChange: (index: number, value: string) => void,
  removeOption: (index: number) => void,
  addOption: () => void,
  addQuestion: () => void,
}

export default function QuestionForm({
  questions,
  removeQuestion,
  setCurrentQuestion,
  currentQuestion,
  handleOptionChange,
  removeOption,
  addOption,
  addQuestion,
}: QuestionFormProps) {
  return (
    <div>
      {/* Existing Questions List */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-white mb-4">Questions</h3>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-[#343434] p-4 rounded-lg border border-gray-700 flex items-start gap-4"
            >
              <GripVertical className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium">
                      Question {index + 1}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {question.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-sm flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {question.marks} marks
                    </span>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Question Form */}
      <div className="bg-[#343434] p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">
          Add New Question
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Question Text
            </label>
            <textarea
              value={currentQuestion.text}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  text: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
              rows={2}
              placeholder="Enter your question"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Question Type
              </label>
              <div className="flex space-x-2">
                {["multiple", "single"].map((type) => (
                  <button
                    key={type}
                    className={cn(
                      "px-4 py-2 rounded-md border transition-all duration-300",
                      currentQuestion.type === type
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-[#1C1C1C] border border-gray-700 text-white"
                    )}
                    onClick={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        type: type as "multiple" | "single",
                      })
                    }
                  >
                    {type === "multiple" ? "Multiple" : "Single"}
                  </button>
                ))}
              </div>
            </div>

            {/* Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Marks
              </label>
              <div className="flex space-x-2">
                {[5, 10, 15].map((mark) => (
                  <button
                    key={mark}
                    className={cn(
                      "w-20 px-4 py-2 rounded-md border transition-all duration-300 text-center",
                      currentQuestion.marks === mark
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-[#1C1C1C] border border-gray-700 text-white"
                    )}
                    onClick={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        marks: mark,
                      })
                    }
                  >
                    {mark}
                  </button>
                ))}
                {/* Custom Input */}
                <input
                  type="number"
                  value={
                    ![5, 10, 15].includes(currentQuestion.marks ?? 0)
                      ? currentQuestion.marks
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      marks: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-24 px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary"
                  placeholder="..."
                  min="1"
                />
              </div>
            </div>
          </div>

          {currentQuestion.type !== "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Options
              </label>
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <button
                      type="button"
                      className={cn(
                        "w-10 h-10 rounded-md flex items-center justify-center border transition-all duration-300",
                        (
                          currentQuestion.type === "multiple"
                            ? (
                                currentQuestion.correctAnswer as string[]
                              ).includes(index.toString())
                            : currentQuestion.correctAnswer === index.toString()
                        )
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-[#1C1C1C] border border-gray-700 text-white"
                      )}
                      onClick={() => {
                        if (currentQuestion.type === "multiple") {
                          // Toggle multiple selection
                          const newCorrectAnswer = (
                            currentQuestion.correctAnswer as string[]
                          ).includes(index.toString())
                            ? (
                                currentQuestion.correctAnswer as string[]
                              ).filter((item) => item !== index.toString())
                            : [
                                ...(currentQuestion.correctAnswer as string[]),
                                index.toString(),
                              ];

                          setCurrentQuestion({
                            ...currentQuestion,
                            correctAnswer: newCorrectAnswer,
                          });
                        } else {
                          // Single selection for 'radio' type
                          setCurrentQuestion({
                            ...currentQuestion,
                            correctAnswer: index.toString(),
                          });
                        }
                      }}
                    >
                      {String.fromCharCode(65 + index)} {/* A, B, C, ... */}
                    </button>

                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`} // A, B, C, ...
                    />

                    {index > 1 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-400 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {currentQuestion.options &&
                currentQuestion.options.length < 6 && (
                  <button
                    onClick={addOption}
                    className="mt-2 text-green-500 hover:text-green-400 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </button>
                )}
            </div>
          )}

          <button
            onClick={addQuestion}
            className="w-full flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
