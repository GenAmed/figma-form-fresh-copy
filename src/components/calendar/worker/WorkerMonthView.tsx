
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { DayContentProps } from "react-day-picker";
import { Assignment } from "../types";

interface WorkerMonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  assignments: Assignment[];
}

export const WorkerMonthView: React.FC<WorkerMonthViewProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  handlePreviousMonth,
  handleNextMonth,
  assignments
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePreviousMonth} className="p-2">
          <ChevronLeft className="text-[#666666]" />
        </button>
        <h2 className="text-[#333333] font-bold">
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </h2>
        <button onClick={handleNextMonth} className="p-2">
          <ChevronRight className="text-[#666666]" />
        </button>
      </div>

      {/* Calendar with visual indicators */}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border"
        month={currentDate}
        showOutsideDays={true}
        modifiers={{
          booked: assignments.map(a => a.date),
        }}
        modifiersStyles={{
          booked: {
            fontWeight: "bold",
            backgroundColor: "#F0F9FF",
            color: "#0369A1",
            position: "relative",
          }
        }}
        components={{
          DayContent: (props: DayContentProps) => {
            const date = props.date;
            const hasAssignment = assignments.some(assignment => 
              isSameDay(assignment.date, date)
            );
            
            return (
              <div className="relative h-full w-full flex items-center justify-center">
                {props.date.getDate()}
                {hasAssignment && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                )}
              </div>
            );
          }
        }}
      />
      
      {/* Legend */}
      <div className="mt-2 flex items-center justify-start text-xs text-gray-500">
        <div className="w-2 h-2 rounded-full bg-[#BD1E28] mr-1"></div>
        <span>Chantier prévu</span>
      </div>
    </div>
  );
};
