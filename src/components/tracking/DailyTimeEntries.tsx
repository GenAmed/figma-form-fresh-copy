
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TimeEntry {
  id: string;
  date: string;
  worksiteId: string;
  worksiteName: string;
  clockIn: string;
  clockOut: string;
}

interface DailyTimeEntriesProps {
  timeEntries: TimeEntry[];
  daysOfWeek: Date[];
}

export const DailyTimeEntries: React.FC<DailyTimeEntriesProps> = ({ timeEntries, daysOfWeek }) => {
  const [openDays, setOpenDays] = React.useState<{ [key: string]: boolean }>({});

  const toggleDay = (dateString: string) => {
    setOpenDays((prev) => ({
      ...prev,
      [dateString]: !prev[dateString],
    }));
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => {
        const dateString = format(day, "yyyy-MM-dd");
        const dayEntries = timeEntries.filter((entry) => entry.date === dateString);
        const isOpen = openDays[dateString] || false;

        // Calculate daily total hours
        const dailyTotalHours = dayEntries.reduce((acc, entry) => {
          const clockIn = entry.clockIn.split(':').map(Number);
          const clockOut = entry.clockOut.split(':').map(Number);
          const startTime = new Date().setHours(clockIn[0], clockIn[1], 0, 0);
          const endTime = new Date().setHours(clockOut[0], clockOut[1], 0, 0);
          return acc + (endTime - startTime) / (1000 * 60 * 60);
        }, 0);

        const formattedDate = format(day, "EEEE d MMMM", { locale: fr });

        return (
          <Collapsible key={dateString} open={isOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger 
                className="w-full px-4 py-3 flex items-center justify-between bg-white text-left" 
                onClick={() => toggleDay(dateString)}
              >
                <div>
                  <h3 className="font-medium capitalize">{formattedDate}</h3>
                  {dailyTotalHours > 0 && (
                    <p className="text-sm text-gray-500">
                      {dayEntries.length} pointage{dayEntries.length > 1 ? "s" : ""} · {dailyTotalHours.toFixed(2)}h
                    </p>
                  )}
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-4 pb-4">
                {dayEntries.length > 0 ? (
                  dayEntries.map((entry) => (
                    <div key={entry.id} className="border-t border-gray-100 pt-2 mt-2 first:border-0 first:mt-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{entry.worksiteName}</h4>
                          <p className="text-sm text-gray-500">
                            {entry.clockIn} - {entry.clockOut}
                          </p>
                        </div>
                        <div className="text-right">
                          {(() => {
                            const clockIn = entry.clockIn.split(':').map(Number);
                            const clockOut = entry.clockOut.split(':').map(Number);
                            const startTime = new Date().setHours(clockIn[0], clockIn[1], 0, 0);
                            const endTime = new Date().setHours(clockOut[0], clockOut[1], 0, 0);
                            const hours = (endTime - startTime) / (1000 * 60 * 60);
                            return <span className="font-medium">{hours.toFixed(2)}h</span>;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">Aucun pointage ce jour</p>
                )}
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
};
