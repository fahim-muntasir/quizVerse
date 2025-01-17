import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { InitialValues } from "@/types/quizCreateModal";
import { useFormikContext } from "formik";
import SortableItem from "./SortableItem";

export default function QuestionList() {
  const { values, setFieldValue } = useFormikContext<InitialValues>();
  const { questions } = values;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0, // Activate drag after moving 5px
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      const updatedQuestions = arrayMove(questions, oldIndex, newIndex);
      setFieldValue("questions", updatedQuestions);
    }
  };

  return (
    <div className={`${questions.length > 0 && "mb-6"}`}>
      {questions.length > 0 && (
        <h3 className="text-md font-medium text-white mb-4">
          Questions ({questions.length})
        </h3>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={questions.map((_, index) => index)} strategy={rectSortingStrategy}>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <SortableItem key={index} question={question} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
