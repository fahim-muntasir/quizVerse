"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export function SearchAndFilter() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            placeholder="Search quizzes..."
            className="w-full bg-[#343434] border border-[#525252] rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#343434] border border-[#525252] rounded-md text-white hover:border-green-500 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-[#343434] border border-[#525252] rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subject
              </label>
              <select className="w-full bg-[#1C1C1C] border border-[#525252] rounded-md py-2 px-3 text-white">
                <option value="">All Subjects</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Difficulty
              </label>
              <select className="w-full bg-[#1C1C1C] border border-[#525252] rounded-md py-2 px-3 text-white">
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duration
              </label>
              <select className="w-full bg-[#1C1C1C] border border-[#525252] rounded-md py-2 px-3 text-white">
                <option value="">Any Duration</option>
                <option value="short">Under 15 mins</option>
                <option value="medium">15-30 mins</option>
                <option value="long">Over 30 mins</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
