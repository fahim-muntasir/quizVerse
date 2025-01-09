import React from "react";
import { BookOpenCheck, GraduationCap, Brain } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white mb-4">
              Test Your Knowledge & Master Languages
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Challenge yourself with our curated collection of quizzes and
              improve your language skills through interactive practice.
            </p>
            <div className="flex gap-4">
              <button className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                Take a Quiz
              </button>
              <button className="px-5 py-2 bg-[#343434] text-white rounded-md hover:bg-[#424242] transition-colors">
                Practice Language
              </button>
            </div>
          </div>

          {/* Custom Illustration */}
          <div className="relative hidden lg:block">
            <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className=" p-6 rounded-lg transform translate-y-8">
                  <BookOpenCheck className="w-8 h-8 text-green-500 mb-2" />
                  <h3 className="text-white font-semibold">
                    Interactive Learning
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Engage with dynamic quizzes
                  </p>
                </div>
                <div className=" p-6 rounded-lg">
                  <Brain className="w-8 h-8 text-purple-500 mb-2" />
                  <h3 className="text-white font-semibold">Language Mastery</h3>
                  <p className="text-gray-400 text-sm">
                    Practice and improve skills
                  </p>
                </div>
              </div>
              <div className="space-y-4 transform translate-y-12">
                <div className=" p-6 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="text-white font-semibold">Track Progress</h3>
                  <p className="text-gray-400 text-sm">
                    Monitor your improvement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
