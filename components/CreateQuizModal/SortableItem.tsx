import React from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { InitialValues, Question } from "@/types/quizCreateModal";
import { GripVertical, Award, Trash2, Edit2, List, Tag } from "lucide-react";
import { useFormikContext } from "formik";

const SortableItem = ({ question, index }: { question: Question; index: number }) => {
  const { values, setFieldValue } = useFormikContext<InitialValues>();
  const { questions } = values;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none",
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
    // background: isDragging ? "red" : "green"
  };

  // remove question handler for question list
  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setFieldValue("questions", updatedQuestions);
  };

  // edit question handler for question list
  const editQuestion = (index: number) => {
    const selectedQuestionToUpdate = questions.filter((_, i) => i === index);
    const updatedQuestions = questions.filter((_, i) => i !== index);

    setFieldValue("questions", updatedQuestions);

    setFieldValue("currentQuestion", {
      ...selectedQuestionToUpdate?.[0],
      isUpdate: true,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-[#343434] p-4 rounded-lg border border-gray-700 ${isDragging ? "shadow-lg scale-105" : "hover:border-green-500/50"
        } transition-all group`}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-grab"
          {...listeners} // Attach drag listeners to this button
        >
          <GripVertical className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
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
                onClick={() => editQuestion(index)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit Question"
              >
                <Edit2 className="w-4 h-4 text-blue-500" />
              </button>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;