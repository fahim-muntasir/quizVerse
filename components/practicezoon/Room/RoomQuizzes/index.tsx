import React from 'react';
import SingleQuiz from './SingleQuiz';


export default function RoomQuizzes() {

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#1e1e1e]">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">

        {/* Quiz Card */}
        <SingleQuiz />
        {/* More quizzes can go here */}
      </div>
    </div>
  );
}
