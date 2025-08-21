import React from "react";
import { PlusCircle } from "lucide-react"; // you can use any icon set, or remove it

const EmptyRoomCard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed border-gray-600 bg-[#1C1C1C] text-gray-300 mt-20">
      <PlusCircle className="w-12 h-12 mb-4 text-gray-500" />
      <h2 className="text-lg font-semibold">No Rooms Available</h2>
      <p className="text-sm text-gray-500 mt-1">Create a room to get started</p>
    </div>
  );
};

export default EmptyRoomCard;
