"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { useAppDispatch } from "@/libs/hooks";
import { search } from "@/libs/features/filter/filterSlice";
import { isQuizResponse } from "@/utils/typeGuards";
import { Quiz } from "@/types/quiz";
import SearchSkeleton from "./SearchSkeleton";
import { useSearchHandlerQuery } from "@/libs/features/filter/filterApiSlice";

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Quiz[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useAppDispatch();
  const debouncedQuery = useDebounce<string>(query, 500);

  // Fetch quizzes using RTK Query
  const { data: quizzes, isLoading, isError, isSuccess } = useSearchHandlerQuery(
    { limit: 10, searchQuery: debouncedQuery }, { refetchOnMountOrArgChange: true }
  );

  const isValidResponse = quizzes && isQuizResponse(quizzes);

  useEffect(() => {
    if (isSuccess && isValidResponse) {
      setResults(quizzes.data);
    }
  }, [isSuccess, isValidResponse, quizzes]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!query) {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (selectedQuery: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("q", selectedQuery); // Update only the search query
  
    setQuery(selectedQuery);
    dispatch(search(selectedQuery));
    router.push(`/search?${currentParams.toString()}`);
    setShowDropdown(false);
  };

  const onBlurHandler = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setResults([]);
      setQuery("");
    }
      , 200);
  }

  return (
    <div className="lg:col-span-2 w-full md:w-2/4 m-auto relative">
      <form onSubmit={(e) => { e.preventDefault(); handleSelect(query); }} className="relative">
        <input
          type="text"
          placeholder="Search rooms by language, title, user, or ID..."
          value={query}
          onFocus={() => setShowDropdown(true)}
          onBlur={onBlurHandler}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-background border border-[#525252] rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

        {/* Search Suggestions Dropdown */}
        {showDropdown && (
          <ul className="absolute left-0 right-0 mt-2 bg-[#1C1C1C] border border-[#525252] rounded-md shadow-lg text-white z-10">
            {isLoading && (
              <li className="p-2">
                <SearchSkeleton />
              </li>
            )}
            {isError && <li className="p-2 text-red-500">Error fetching data</li>}
            {!isLoading && results.length === 0 && (
              <li className="p-2 text-gray-400">No results found</li>
            )}
            {!isLoading &&
              results.map((item, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-[#343434]"
                  onMouseDown={() => handleSelect(item?.title)}
                >
                  {item?.title}
                </li>
              ))}
          </ul>
        )}
      </form>
    </div>
  );
}