"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { BookOpenCheck, LogIn, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import { openCreateQuizModal, openCreateRoomModal } from "@/libs/features/modal/modalSlice";
import Link from "next/link";
import CreateQuizModal from "../CreateQuizModal";
import CreateRoomModal from "../CreateRoomModal";

export function Navbar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.createQuizModal.isOpen);
  const roomIsOpen = useAppSelector((state) => state.modal.createRoomModal.isOpen);
  const user = useAppSelector((state) => state.auth.user);

  const pathname = usePathname();
  console.log(pathname);
  const modalHandler = () => {
    if (pathname === "/practicezoon") {
      dispatch(openCreateRoomModal());
    }else{
      dispatch(openCreateQuizModal());
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("auth");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-green-500/10 p-2 rounded-full">
                <BookOpenCheck className="w-7 h-7 text-green-500" />
              </div>
              {/* <span className="text-white font-semibold text-lg">QuizVerse</span> */}
            </Link>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              {user !== undefined ? (
                user ? (
                  <>
                    <button
                      onClick={modalHandler}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#525252] text-white hover:border-white transition duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <CreateQuizModal isOpen={isOpen} />
      <CreateRoomModal isOpen={roomIsOpen} />
    </>
  );
}
