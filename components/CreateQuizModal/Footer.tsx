import React from "react";
import { StepForward, StepBack } from "lucide-react";
import { useFormikContext } from "formik";
import { InitialValues } from "@/types/quizCreateModal";
import Button from "@/components/ui/Button";

type FooterProps = {
  step: number;
  setStep: (set: number) => void;
  isSubmitting: boolean;
};

export default function Footer({
  step,
  setStep,
  isSubmitting,
}: FooterProps) {
  const { values, errors, touched } = useFormikContext<InitialValues>();

  const requiredFieldsToGoToNext = ["title", "category", "description", "duration"];

  // Check if all required fields are valid
  const areFieldsValid = () =>
    requiredFieldsToGoToNext.every((field) => 
      !errors[field as keyof InitialValues] && (touched[field as keyof InitialValues] || values[field as keyof InitialValues])
    );

  return (
    <div className="border-t border-gray-800 p-4 flex justify-between">
      {step === 1 ? (
        <div className="flex justify-end w-full">
          <Button
            onHandler={() => setStep(2)}
            isDisabled={!areFieldsValid()}
          >
            Next
            <StepForward className="w-5 h-5 ml-1" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 flex items-center py-2 text-white hover:text-green-400 transition-colors"
          >
            <StepBack className="w-5 h-5 mr-1" /> Back
          </button>
          <Button
            type="submit"
            isDisabled={values.questions.length === 0 || isSubmitting}
          >
            Create Quiz ({values.questions.length})
          </Button>
        </div>
      )}
    </div>
  );
}
