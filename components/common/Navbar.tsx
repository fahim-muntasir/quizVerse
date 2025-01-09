import { BookOpenCheck, LogIn } from "lucide-react";
import Link from "next/link";

export function Navbar() {

  return (
    <nav className="bg-[#1C1C1C] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-green-500/10 p-2 rounded-full">
              <BookOpenCheck className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-white font-bold text-xl">QuizVerse</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="flex items-center px-3 py-1 rounded-md border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}