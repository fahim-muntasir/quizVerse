import { Clock } from 'lucide-react';

interface RecentQuiz {
  id: string;
  title: string;
  subject: string;
  participants: number;
  date: string;
}

interface RecentQuizzesProps {
  quizzes: RecentQuiz[];
}

export function RecentQuizzes({ quizzes }: RecentQuizzesProps) {
  return (
    <div className="bg-[#1C1C1C] border border-[#525252] rounded-md p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Quizzes</h2>
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-[#343434] rounded-md hover:border-green-500 border border-transparent transition-colors"
          >
            <div>
              <h3 className="text-white font-medium">{quiz.title}</h3>
              <p className="text-sm text-gray-400">{quiz.subject}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <Clock className="w-4 h-4 mr-1" />
                {quiz.date}
              </div>
              <p className="text-sm text-green-500">{quiz.participants} participants</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}