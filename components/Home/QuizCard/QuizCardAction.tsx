import React, { useState } from 'react'
import {
  Share2,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAppSelector } from '@/libs/hooks';

export default function QuizCardAction({ id, status, title, owner }: { id: string, status: string, title: string, owner: string }) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const { user } = useAppSelector(state => state.auth);

  const handleShare = (platform: "copy" | "twitter" | "facebook") => {
    const quizUrl = `${window.location.origin}/quiz/${id}`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(quizUrl);
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            quizUrl
          )}&text=Check out this quiz: ${title}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            quizUrl
          )}`
        );
        break;
    }
    setShowShareMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      console.log("Delete quiz:", id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <Share2 className="w-5 h-5 text-gray-400" />
        </button>

        {showShareMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-[#343434] border border-gray-700 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => handleShare("copy")}
                className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
              >
                Copy Link
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
              >
                Share on Facebook
              </button>
            </div>
          </div>
        )}
      </div>

      {user?.id === owner && (
        <>
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>

          {/* Toggle Button */}
          <button
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            {status.toLocaleLowerCase() === "active" ? (
              <ToggleRight className="w-5 h-5 text-green-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </>
      )}
    </div>
  )
}
