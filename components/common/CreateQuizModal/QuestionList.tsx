import React from "react";
import { GripVertical, Award, Trash2 } from "lucide-react";
import { useFormikContext } from "formik";
import { InitialValues } from "@/types/quizCreateModal";

export default function QuestionList() {
  const { values, setFieldValue } = useFormikContext<InitialValues>();
  const isQuestionsAvailable = values.questions.length;

  const removeQuestion = (index: number) => {
    const updatedQuestions = values.questions.filter((_, i) => i !== index);
    setFieldValue("questions", updatedQuestions);
  };

  return (
    <div className={`${isQuestionsAvailable > 0 && "mb-6"}`}>
      {isQuestionsAvailable > 0 && (
        <h3 className="text-md font-medium text-white mb-4">Questions</h3>
      )}

      <div className="space-y-4">
        {values.questions.map((question, index) => (
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
                  <p className="text-gray-400 text-sm mt-1">{question.text}</p>
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
  );
}
