import React from "react";
import { X } from "lucide-react";

export default function Header() {
  return (
    <div className="border-b border-gray-800 p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-white">Create New Quiz</h2>
      <button
        // onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
