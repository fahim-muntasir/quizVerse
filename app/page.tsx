import { Navbar } from "@/components/common/Navbar";
import { QuizCard } from "@/components/Home/QuizCard";
import { RecentQuizzes } from "@/components/Home/RecentQuizzes";
import { SearchAndFilter } from "@/components/Home/SearchAndFilter";
import Hero from "@/components/Home/Hero";
import CreateQuizModal from "../components/common/CreateQuizModal";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";

// Mock data (replace with real data later)
const quizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
    category: "Programming",
    participants: 1234,
    duration: "30 mins",
    difficulty: "Easy" as const,
    totalMarks: 100,
    admin: "john@example.com",
    activeStatus: true,
  },
  {
    id: "2",
    title: "Python Essentials",
    description:
      "A beginner-friendly quiz to assess your understanding of Python syntax, data types, and functions.",
    category: "Programming",
    participants: 856,
    duration: "25 mins",
    difficulty: "Medium" as const,
    totalMarks: 80,
    admin: "alice@example.com",
    activeStatus: true,
  },
  {
    id: "3",
    title: "Web Development Basics",
    description:
      "Explore the fundamentals of HTML, CSS, and basic web development concepts in this quiz.",
    category: "Web Development",
    participants: 452,
    duration: "20 mins",
    difficulty: "Hard" as const,
    totalMarks: 50,
    admin: "jane@example.com",
    activeStatus: false,
  },
];


const recentQuizzes = [
  {
    id: "quiz-1",
    title: "JavaScript Basics",
    subject: "Programming",
    participants: 120,
    date: "2024-04-15",
  },
  {
    id: "quiz-2",
    title: "World History 101",
    subject: "History",
    participants: 85,
    date: "2024-04-10",
  },
  {
    id: "quiz-3",
    title: "Advanced CSS Techniques",
    subject: "Design",
    participants: 60,
    date: "2024-04-08",
  },
  {
    id: "quiz-4",
    title: "English Grammar",
    subject: "Language Arts",
    participants: 95,
    date: "2024-04-05",
  },
  {
    id: "quiz-5",
    title: "Basic Algebra",
    subject: "Mathematics",
    participants: 150,
    date: "2024-04-02",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen  relative bg-[#1C1C1C]">
      <BackgroundPattern />
      <div className="relative">
        <Navbar />

        {/* Hero Section with Custom Illustration */}
        <Hero />

        {/* Rest of the content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <SearchAndFilter />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Available Quizzes
              </h2>
              <div className="grid gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.id} {...quiz} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <RecentQuizzes quizzes={recentQuizzes} />
            </div>
          </div>
        </div>
      </div>

      <CreateQuizModal isOpen={true} />
    </div>
  );
}
