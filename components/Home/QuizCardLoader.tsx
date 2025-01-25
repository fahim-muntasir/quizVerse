import React from "react";

const QuizCardLoader: React.FC = () => {
  return (
    <div className="bg-background border border-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-16 h-6 bg-gray-700 rounded-full"></span>
            <span className="w-24 h-6 bg-gray-700 rounded-full"></span>
          </div>
          <div className="w-48 h-6 bg-gray-700 rounded mb-1"></div>
          <div className="w-32 h-4 bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      <div className="w-full h-4 bg-gray-700 rounded mb-4"></div>
      <div className="w-3/4 h-4 bg-gray-700 rounded mb-4"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 h-8 bg-gray-700 rounded-md"></div>
          <div className="w-32 h-8 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizCardLoader;
