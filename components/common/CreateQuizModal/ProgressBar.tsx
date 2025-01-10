import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/libs/utils";

type ProgressBarProps = {
  step: number;
};

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="px-6 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full relative">
          {/* Step 1 */}
          <div
            className={cn(
              "z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 bg-green-500 text-white border-2 border-green-700 shadow-lg"
            )}
          >
            {step === 1 ? "1" : <Check className="w-5 h-5" />}
          </div>

          {/* Progress Line */}
          <div className="flex-1 h-1 mx-3 bg-gray-600 rounded-full relative">
            {/* Partial Line for Step 1 */}
            <div
              className={cn(
                "absolute h-full rounded-full bg-green-500 transition-all duration-300",
                step > 1 && "w-full"
              )}
            ></div>

            {/* Dot in the Center */}
            {/* <div
                  className={cn(
                    "absolute w-4 h-4 rounded-full bg-gray-600 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-300",
                    step >= 1 ? "bg-green-500" : ""
                  )}
                ></div> */}
          </div>

          {/* Step 2 */}
          <div
            className={cn(
              "z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
              step === 2
                ? "bg-green-500 text-white border-2 border-green-700 shadow-lg"
                : "bg-gray-700 text-gray-300 border-2 border-gray-600"
            )}
          >
            2
          </div>
        </div>
      </div>
    </div>
  );
}
