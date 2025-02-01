import React from "react";
import { CheckCircle } from "lucide-react";

export default function SubmissionSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold text-white">Great Job!</h2>
      <p className="text-gray-400 mt-2">
        Every step you take brings you closer to mastery. Keep pushing forward and keep learning!
      </p>
      <button
        onClick={onClose}
        className="mt-5 px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Continue Learning
      </button>
    </div>
  );
}
