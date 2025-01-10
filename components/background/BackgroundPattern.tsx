import React from 'react';

export const BackgroundPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E0E0E] via-[#1A1A1A] to-[#0E0E0E]">
        {/* Subtle hexagonal grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 23.09v46.18L40 80 0 69.27V23.09L40 0zm0 7.69L8.24 24.5v41L40 72.31l31.76-6.81v-41L40 7.69z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Simple glowing orbs */}
      {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" /> */}
    </div>
  );
};
