
import React from "react";
import { Filter } from "lucide-react";

interface CalendarHeaderProps {
  title: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ title }) => {
  return (
    <header className="bg-[#BD1E28] text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <button id="filter-btn" className="p-2">
          <Filter size={20} />
        </button>
      </div>
    </header>
  );
};
