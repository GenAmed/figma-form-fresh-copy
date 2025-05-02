
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DayContentProps } from "react-day-picker";
import { Assignment } from "../types";

interface CalendarMonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  assignments: Assignment[];
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  handlePreviousMonth,
  handleNextMonth,
  assignments
}) => {
  return (
    <section className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePreviousMonth} className="text-[#666666]">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-[#333333] font-bold">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h2>
          <button onClick={handleNextMonth} className="text-[#666666]">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
          month={currentDate}
          showOutsideDays={true}
          components={{
            DayContent: (props: DayContentProps) => {
              const date = props.date;
              const dayAssignments = assignments.filter(assignment => 
                format(assignment.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              );
              
              return (
                <div className="relative h-full w-full flex items-center justify-center">
                  {props.date.getDate()}
                  {dayAssignments.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                      <div className="w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                      {dayAssignments.length > 1 && (
                        <div className="w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                      )}
                      {dayAssignments.length > 2 && (
                        <div className="w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
        
        {/* Légende */}
        <div className="mt-2 flex items-center justify-start text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-[#BD1E28] mr-1"></div>
          <span>Assignations</span>
        </div>
      </div>
    </section>
  );
};
