
import React from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";

interface TimeEntry {
  id: string;
  date: string;
  worksiteId: string;
  worksiteName: string;
  clockIn: string;
  clockOut: string;
}

interface WeeklyCalendarViewProps {
  timeEntries: TimeEntry[];
  daysOfWeek: Date[];
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ timeEntries, daysOfWeek }) => {
  // Generate time slots from 7:00 to 20:00
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Create a mapping of entries by day
  const entriesByDay: { [key: string]: TimeEntry[] } = {};
  
  daysOfWeek.forEach(day => {
    const dateString = format(day, "yyyy-MM-dd");
    entriesByDay[dateString] = timeEntries.filter(entry => entry.date === dateString);
  });

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 bg-gray-50 border-b">
            <div className="p-2 border-r text-xs font-medium text-gray-500">Heure</div>
            {daysOfWeek.map(day => (
              <div key={format(day, "yyyy-MM-dd")} className="p-2 text-center">
                <div className="font-medium">{format(day, "EEE", { locale: fr })}</div>
                <div className="text-xs">{format(day, "d MMM", { locale: fr })}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((timeSlot, index) => {
            const isHourMark = index % 2 === 0;
            
            return (
              <div 
                key={timeSlot}
                className={`grid grid-cols-8 ${isHourMark ? 'bg-white' : 'bg-gray-50'} ${index === 0 ? '' : 'border-t border-gray-100'}`}
                style={{ height: isHourMark ? '48px' : '24px' }}
              >
                <div className="flex items-center justify-end pr-2 border-r text-xs text-gray-500">
                  {isHourMark && timeSlot}
                </div>
                
                {daysOfWeek.map(day => {
                  const dateString = format(day, "yyyy-MM-dd");
                  const dayEntries = entriesByDay[dateString] || [];
                  
                  // Check if any entry starts at this time slot
                  const entryAtTimeSlot = dayEntries.find(entry => entry.clockIn === timeSlot);
                  
                  if (entryAtTimeSlot) {
                    // Calculate the duration in half-hour slots
                    const startParts = entryAtTimeSlot.clockIn.split(':').map(Number);
                    const endParts = entryAtTimeSlot.clockOut.split(':').map(Number);
                    const startSlot = (startParts[0] - 7) * 2 + (startParts[1] === 30 ? 1 : 0);
                    const endSlot = (endParts[0] - 7) * 2 + (endParts[1] === 30 ? 1 : 0);
                    const durationSlots = endSlot - startSlot;
                    
                    // Only render at the starting time slot
                    if (timeSlot === entryAtTimeSlot.clockIn) {
                      return (
                        <div 
                          key={dateString}
                          className="relative bg-blue-100 rounded-md border border-blue-300 p-1 m-1 overflow-hidden"
                          style={{ 
                            height: `${Math.max(durationSlots * 24 - 2, 22)}px`,
                            gridRow: `span ${durationSlots}`
                          }}
                        >
                          <div className="text-xs font-medium truncate">
                            {entryAtTimeSlot.worksiteName}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {entryAtTimeSlot.clockIn} - {entryAtTimeSlot.clockOut}
                          </div>
                        </div>
                      );
                    }
                  }
                  
                  return <div key={dateString} className=""></div>;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
