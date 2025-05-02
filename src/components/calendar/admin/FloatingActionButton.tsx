
import React from "react";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="fixed right-4 bottom-20 w-14 h-14 bg-[#BD1E28] rounded-full shadow-lg flex items-center justify-center text-white"
      onClick={onClick}
    >
      <Plus size={24} />
    </button>
  );
};
