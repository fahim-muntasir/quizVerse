import React from 'react'

export default function ControlButton({
  icon: Icon,
  active = false,
  onClick,
  label,
  danger = false
}: {
  icon: React.ComponentType<{ size: number }>;
  active?: boolean;
  onClick?: () => void;
  label?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 group focus:outline-none"
    >
      <div className={`p-3 rounded-full transition-all
        ${danger
          ? 'bg-red-500 text-white hover:bg-red-600'
          : active
            ? 'bg-green-500 text-white'
            : 'bg-gray-800/50 text-gray-200 hover:bg-[#343434]'}
      `}>
        <Icon size={20} />
      </div>

      {/* Tooltip */}
      {label && (
        <div className="absolute bottom-14 px-2 py-1 rounded bg-[#343434] text-white text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-10">
          {label}
        </div>
      )}
    </button>
  )
}
