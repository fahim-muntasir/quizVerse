"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";

export default function Hero() {
  const pathname = usePathname();

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-goldman text-white mb-4">
              Test Your Knowledge & <br /> <span className="text-purple-500">Master Languages</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Challenge yourself with our curated collection of quizzes <br /> and
              improve your language skills through interactive practice.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={"/"} className={cn("px-5 py-2 bg-[#343434] text-white rounded-md hover:bg-[#424242]transition-colors", pathname === "/" && "bg-green-500")}>
                Take a Quiz
              </Link>
              <Link href={"/practicezoon"} className={cn("px-5 py-2 bg-[#343434] text-white rounded-md hover:bg-[#424242]transition-colors", pathname === "/practicezoon" && "bg-green-500")}>
                Practice Language
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
