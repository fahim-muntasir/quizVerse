import { Navbar } from "@/components/common/Navbar";
import { SearchAndFilter } from "@/components/Home/SearchAndFilter/SearchAndFilter";
import Hero from "@/components/common/Hero";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import TopParticipants from "@/components/Home/TopParticipants";
import SideMenu from "@/components/Home/SideMenu";
import CreatedQuizList from "@/components/CreatedQuizzes/CreatedQuizList";

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
              <TopParticipants />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
