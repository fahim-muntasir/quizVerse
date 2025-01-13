import React from "react";
import { cn } from "@/libs/utils";
import { Clock } from "lucide-react";
import { Field, ErrorMessage } from "formik";
import FieldContainer from "@/components/ui/FieldContainer";

export default function QuizDetailsForm() {
  return (
    <div className="space-y-4">
      <FieldContainer label="Quiz Title" name="quizTitle">
        <Field
          type="text"
          name="title"
          className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
          placeholder="Enter quiz title"
        />
        <ErrorMessage
          name="title"
          component="div"
          className="text-sm text-danger-light"
        />
      </FieldContainer>

      <FieldContainer label="Description" name="description">
        <Field
          name="description"
          as="textarea"
          className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
          rows={3}
          placeholder="Describe your quiz"
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-sm text-danger-light"
        />
      </FieldContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FieldContainer label="Category" name="category">
          <Field
            name="category"
            as="select"
            className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
          >
            <option value="">Select category</option>
            <option value="programming">Programming</option>
            <option value="language">Language</option>
            <option value="science">Science</option>
            <option value="math">Mathematics</option>
          </Field>
          <ErrorMessage
            name="category"
            component="div"
            className="text-sm text-danger-light"
          />
        </FieldContainer>

        <FieldContainer label="Duration (minutes)" name="duration">
          <div className="relative">
            <Field
              type="number"
              name="duration"
              className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500 pl-9"
              min="1"
            />
            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <ErrorMessage
            name="duration"
            component="div"
            className="text-sm text-danger-light"
          />
        </FieldContainer>

        <FieldContainer label="Difficulty" name="difficulty">
          <Field name="difficulty">
            {({ field }: { field: { value: string } }) => (
              <div className="flex space-x-2">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <label
                    key={level}
                    className={cn(
                      "px-4 py-2 rounded-md border transition-all duration-300 cursor-pointer",
                      field.value === level
                        ? {
                            Easy: "bg-green-500/10 text-green-500 border-green-500/20",
                            Medium:
                              "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                            Hard: "bg-red-500/10 text-red-500 border-red-500/20",
                          }[level]
                        : "bg-[#343434] border border-gray-700 text-white"
                    )}
                  >
                    <input
                      type="radio"
                      {...field}
                      value={level}
                      className="hidden"
                    />
                    {level}
                  </label>
                ))}
              </div>
            )}
          </Field>
          <ErrorMessage
            name="difficulty"
            component="div"
            className="text-sm text-danger-light"
          />
        </FieldContainer>
      </div>
    </div>
  );
}
