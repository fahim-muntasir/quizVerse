"use client"
import React, { useState } from 'react'
import { Award, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';

type BannerProps = {
  score: number;
  quizTitle: string;
}

export default function Banner({ score, quizTitle }: BannerProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareMessage = () => {
    const level = score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner';
    return `I just scored ${score}% on the ${quizTitle} quiz and achieved ${level} level! Challenge yourself on QuizLingo! 🎯`;
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'copy') => {
    const shareUrl = window.location.href;
    const message = getShareMessage();

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`,
          '_blank'
        );
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${message}\n\n${shareUrl}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }
    setShowShareMenu(false);
  };
  return (
    <div className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 p-1 rounded-lg mb-8">
      <div className="bg-[#2a2a2a] rounded-lg p-8 text-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />

        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Congratulations! 🎉</h1>
        <p className="text-gray-400 mb-4">You&apos;ve completed {quizTitle}</p>
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-4">
          {score}%
        </div>

        {/* Share Button */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share Achievement
          </button>

          {showShareMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#343434] rounded-lg shadow-xl border border-gray-700 p-2">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Share on Facebook
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 w-full p-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-gray-400" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
