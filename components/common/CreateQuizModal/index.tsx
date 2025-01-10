"use client";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Award,
} from "lucide-react";
import { cn } from "@/libs/utils";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import Footer from "./Footer";
import { Question, CreateQuizModalProps, QuizDetails } from "@/types/quizCreateModal";

export default function CreateQuizModal({ isOpen }: CreateQuizModalProps) {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState<QuizDetails>({
    title: "",
    description: "",
    category: "",
    duration: 30,
    difficulty: "Easy",
    totalMarks: 0,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: "",
    type: "multiple",
    options: ["", ""],
    correctAnswer: [],
    marks: 1,
  });

  const addQuestion = () => {
    if (currentQuestion.text && (currentQuestion.options?.length ?? 0) >= 2) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: currentQuestion.text || "",
        type: currentQuestion.type || "multiple",
        options: currentQuestion.options || [],
        correctAnswer: currentQuestion.correctAnswer || [],
        marks: currentQuestion.marks || 1,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        text: "",
        type: "multiple",
        options: ["", ""],
        correctAnswer: [],
        marks: 1,
      });
      updateTotalMarks([...questions, newQuestion]);
    }
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    updateTotalMarks(updatedQuestions);
  };

  const updateTotalMarks = (updatedQuestions: Question[]) => {
    const total = updatedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
    setQuizDetails((prev) => ({ ...prev, totalMarks: total }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    if (currentQuestion.options && currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options && currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1C1C1C] w-full max-w-4xl rounded-lg shadow-xl">
        {/* Heaser  */}
        <Header />

        {/* Progress Steps */}
        <ProgressBar step={step} />

        {/* Content */}
        <div className="p-6 max-h-[600px] overflow-auto">
          {step === 1 ? (
            /* Quiz Details Form */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizDetails.title}
                  onChange={(e) =>
                    setQuizDetails({ ...quizDetails, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={quizDetails.description}
                  onChange={(e) =>
                    setQuizDetails({
                      ...quizDetails,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  rows={3}
                  placeholder="Describe your quiz"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={quizDetails.category}
                    onChange={(e) =>
                      setQuizDetails({
                        ...quizDetails,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select category</option>
                    <option value="programming">Programming</option>
                    <option value="language">Language</option>
                    <option value="science">Science</option>
                    <option value="math">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quizDetails.duration}
                      onChange={(e) =>
                        setQuizDetails({
                          ...quizDetails,
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500 pl-9"
                      min="1"
                    />
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <div className="flex space-x-2">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <button
                        key={level}
                        className={cn(
                          "px-4 py-2 rounded-md border transition-all duration-300",
                          quizDetails.difficulty === level
                            ? {
                                Easy: "bg-green-500/10 text-green-500 border-green-500/20",
                                Medium:
                                  "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                Hard: "bg-red-500/10 text-red-500 border-red-500/20",
                              }[level]
                            : "bg-[#343434] border border-gray-700 text-white"
                        )}
                        onClick={() =>
                          setQuizDetails({
                            ...quizDetails,
                            difficulty: level as "Easy" | "Medium" | "Hard",
                          })
                        }
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Questions Form */
            <div>
              {/* Existing Questions List */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-white mb-4">
                  Questions
                </h3>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
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
                              onClick={() => removeQuestion(question.id)}
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
                                    : currentQuestion.correctAnswer ===
                                      index.toString()
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
                                      ).filter(
                                        (item) => item !== index.toString()
                                      )
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
                              {String.fromCharCode(65 + index)}{" "}
                              {/* A, B, C, ... */}
                            </button>

                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                              className="flex-1 px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                              placeholder={`Option ${String.fromCharCode(
                                65 + index
                              )}`} // A, B, C, ...
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
          )}
        </div>

        {/* Footer */}
        <Footer
          step={step}
          setStep={setStep}
          quizDetails={quizDetails}
          questions={questions}
        />
      </div>
    </div>
  );
}
