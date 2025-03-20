import React from 'react'

export default function ControlButton({
  icon: Icon,
  active = false,
  onClick,
  label,
  danger = false
}: { icon: React.ComponentType<{ size: number }>; active?: boolean; onClick?: () => void; label?: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
    >
      <div className={`p-3 rounded-full ${danger ? 'bg-red-500 text-white hover:bg-red-600' :
        active ? 'bg-green-500 text-white' : 'bg-gray-800/50 text-gray-200 hover:bg-[#343434]'
        } transition-all`}>
        <Icon size={20} />
      </div>
      {label && (
        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
          {label}
        </span>
      )}
    </button>
  )
};
