
import React from "react";

interface WorkerHeaderProps {
  title: string;
}

export const WorkerHeader: React.FC<WorkerHeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between fixed top-0 w-full z-50">
      <div className="flex items-center">
        <h1 className="text-[#333333] text-lg font-bold">{title}</h1>
      </div>
    </header>
  );
};
