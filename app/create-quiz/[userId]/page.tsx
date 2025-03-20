import { Navbar } from "@/components/common/Navbar";
import { SearchAndFilter } from "@/components/Home/SearchAndFilter/SearchAndFilter";
import Hero from "@/components/common/Hero";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import TopParticipants from "@/components/Home/TopParticipants";
import SideMenu from "@/components/Home/SideMenu";
import CreatedQuizList from "@/components/CreatedQuizzes/CreatedQuizList";

// Mock data for top participants by category
const topParticipantsByCategory = {
  programming: [
    { name: "John Doe", score: 98, rank: 1, badge: "Elite Coder" },
    { name: "Jane Smith", score: 95, rank: 2, badge: "Code Master" },
    { name: "Mike Johnson", score: 92, rank: 3, badge: "Tech Guru" },
  ],
  language: [
    { name: "Sarah Wilson", score: 97, rank: 1, badge: "Language Expert" },
    { name: "Tom Brown", score: 94, rank: 2, badge: "Word Master" },
    { name: "Lisa Davis", score: 91, rank: 3, badge: "Grammar Pro" },
  ],
  science: [
    { name: "Alex Turner", score: 96, rank: 1, badge: "Science Wizard" },
    { name: "Emma White", score: 93, rank: 2, badge: "Lab Master" },
    { name: "Chris Black", score: 90, rank: 3, badge: "Research Pro" },
  ],
};

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
            <CreatedQuizList />

            <div className="lg:col-span-1">
              <SideMenu />
              <TopParticipants categories={topParticipantsByCategory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
