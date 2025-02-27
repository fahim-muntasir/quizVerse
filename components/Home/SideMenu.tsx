"use client";
import { Menu, Puzzle, ClipboardList } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/libs/hooks';

export default function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6 mb-5">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Menu className="w-5 h-5 text-yellow-500" />
        Menus
      </h2>

      <div className="space-y-6">
        <div className="space-y-3">

          <button 
            className={`w-full py-3 px-4 rounded-lg border transition-all ${pathname === `/create-quiz/${user.id}` 
              ? 'bg-[#343434] border-gray-700 hover:border-green-500/50' 
              : 'bg-background hover:bg-[#343434] border-gray-700 hover:border-green-500/50 group'}`} 
            onClick={() => router.push(`/create-quiz/${user.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${pathname === `/create-quiz/${user.id}` ? 'bg-[#1C1C1C]' : 'bg-gray-800 group-hover:bg-background'}`}>
                <Puzzle className={`w-5 h-5 ${pathname === `/create-quiz/${user.id}` ? 'text-green-500' : 'text-gray-500 group-hover:text-green-500'}`} />
              </div>
              <div>
                <p className="text-white font-medium">Created Quizzes</p>
              </div>
            </div>
          </button>

          <button 
            className={`w-full py-3 px-4 rounded-lg border transition-all ${pathname === `/participated-quizzes/${user.id}` 
              ? 'bg-[#343434] border-gray-700 hover:border-green-500/50' 
              : 'bg-background hover:bg-[#343434] border-gray-700 hover:border-green-500/50 group'}`} 
            onClick={() => router.push(`/participated-quizzes/${user.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${pathname === `/participated-quizzes/${user.id}` ? 'bg-[#1C1C1C]' : 'bg-gray-800 group-hover:bg-background'}`}>
                <ClipboardList className={`w-5 h-5 ${pathname === `/participated-quizzes/${user.id}` ? 'text-green-500' : 'text-gray-500 group-hover:text-green-500'}`} />
              </div>
              <div>
                <p className="text-white font-medium">Participated Quizzes</p>
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
