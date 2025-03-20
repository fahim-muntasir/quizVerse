"use client";
import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, XCircle } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SearchBox from "@/components/common/SearchBox/SearchBox";
import { useAppDispatch} from "@/libs/hooks";
import {
  filterByCategory,
  filterByDifficulty,
  filterByDuration,
} from "@/libs/features/filter/filterSlice";

type FilterKey = "Category" | "Difficulty" | "Duration";

const filterOptions: Record<FilterKey, string[]> = {
  Category: ["Programming", "Design", "Mathematics"],
  Difficulty: ["Easy", "Medium", "Hard"],
  Duration: ["Under 15 mins", "15-30 mins", "Over 30 mins"],
};

const defaultFilters = {
  Category: "All Categories",
  Difficulty: "All Levels",
  Duration: "Any Duration",
};

export function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({
    Category: false,
    Difficulty: false,
    Duration: false,
  });

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(dropdownRefs.current).forEach((category) => {
        if (
          dropdownRefs.current[category] &&
          !dropdownRefs.current[category]?.contains(event.target as Node)
        ) {
          setDropdownOpen((prev) => ({ ...prev, [category]: false }));
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultFilters[key as FilterKey]) {
      params.delete(key.toLowerCase()); // Remove default values from URL
    } else {
      params.set(key.toLowerCase(), value);
    }

    if (pathname === "/") {
      router.push(`search?${params.toString()}`, { scroll: false });
    }else{
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleFilterChange = (category: FilterKey, option: string) => {
    if (category === "Category") dispatch(filterByCategory(option));
    if (category === "Difficulty") dispatch(filterByDifficulty(option));
    if (category === "Duration") dispatch(filterByDuration(option));

    updateQueryParams(category, option);
    setDropdownOpen((prev) => ({ ...prev, [category]: false }));
  };

  const handleResetFilters = () => {
    dispatch(filterByCategory(defaultFilters.Category));
    dispatch(filterByDifficulty(defaultFilters.Difficulty));
    dispatch(filterByDuration(defaultFilters.Duration));

    router.push("?", { scroll: false }); // Reset URL
  };

  return (
    <div className="mb-6">
      {/* Search Box */}
      <SearchBox />

      {/* Filter Section */}
      <div className="mt-4 bg-background border border-[#525252] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 text-white">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-semibold text-lg">Filters</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#262626] border border-[#525252] text-white rounded-lg hover:border-red-500 hover:text-red-400 transition-all duration-200"
          >
            <XCircle className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.keys(filterOptions).map((category) => (
            <div key={category} className="relative" ref={(el) => { dropdownRefs.current[category] = el; }}>
              <button
                className="flex items-center justify-between w-full px-4 py-2 bg-[#1C1C1C] border border-[#525252] rounded-lg text-white hover:border-green-500 transition duration-200"
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    ...prev,
                    [category]: !prev[category],
                  }))
                }
              >
                {searchParams.get(category.toLowerCase()) || defaultFilters[category as FilterKey]}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen[category] ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen[category] && (
                <ul className="absolute left-0 mt-2 w-full bg-[#1C1C1C] border border-[#525252] rounded-lg shadow-lg text-white z-10 overflow-hidden transition-all duration-300">
                  {filterOptions[category as FilterKey].map((option) => (
                    <li
                      key={option}
                      className="p-3 cursor-pointer hover:bg-[#343434] transition-colors duration-200"
                      onClick={() => handleFilterChange(category as FilterKey, option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
