import React from "react";

export default function Hero() {
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-goldman text-white mb-4">
              Test Your Knowledge & <br /> <span className="text-purple-500">Master Languages</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Challenge yourself with our curated collection of quizzes <br /> and
              improve your language skills through interactive practice.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                Take a Quiz
              </button>
              <button className="px-5 py-2 bg-[#343434] text-white rounded-md hover:bg-[#424242] transition-colors">
                Practice Language
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
