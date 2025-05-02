
import React, { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, parseISO, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { WorksiteSummary } from "./WorksiteSummary";
import { DailyTimeEntries } from "./DailyTimeEntries";
import { WeeklyCalendarView } from "./WeeklyCalendarView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface WeeklySummaryWorkerProps {
  user: User;
}

// Mock data for demonstration
const mockTimeEntries = [
  {
    id: "1",
    date: "2025-05-01",
    worksiteId: "site1",
    worksiteName: "Chantier Bordeaux Centre",
    clockIn: "08:15",
    clockOut: "16:45",
  },
  {
    id: "2",
    date: "2025-05-01",
    worksiteId: "site2",
    worksiteName: "Chantier Mérignac",
    clockIn: "17:30",
    clockOut: "19:15",
  },
  {
    id: "3",
    date: "2025-05-02",
    worksiteId: "site1",
    worksiteName: "Chantier Bordeaux Centre",
    clockIn: "08:00",
    clockOut: "12:30",
  },
  {
    id: "4",
    date: "2025-05-02",
    worksiteId: "site2",
    worksiteName: "Chantier Mérignac",
    clockIn: "13:30",
    clockOut: "17:00",
  },
  {
    id: "5",
    date: "2025-05-03",
    worksiteId: "site1",
    worksiteName: "Chantier Bordeaux Centre",
    clockIn: "09:00",
    clockOut: "18:00",
  }
];

export const WeeklySummaryWorker: React.FC<WeeklySummaryWorkerProps> = ({ user }) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  
  // Calculate start and end of the current week (Monday to Sunday)
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  // Create an array of dates for the current week
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter time entries for the current week
  const currentWeekTimeEntries = mockTimeEntries.filter(entry => {
    const entryDate = parseISO(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Group time entries by worksite to calculate total hours
  const worksiteSummaries = currentWeekTimeEntries.reduce((acc, entry) => {
    const existingWorksite = acc.find(ws => ws.worksiteId === entry.worksiteId);
    
    // Calculate hours for this entry
    const clockIn = entry.clockIn.split(':').map(Number);
    const clockOut = entry.clockOut.split(':').map(Number);
    const startTime = new Date().setHours(clockIn[0], clockIn[1], 0, 0);
    const endTime = new Date().setHours(clockOut[0], clockOut[1], 0, 0);
    const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
    
    if (existingWorksite) {
      existingWorksite.totalHours += hoursWorked;
    } else {
      acc.push({
        worksiteId: entry.worksiteId,
        worksiteName: entry.worksiteName,
        totalHours: hoursWorked
      });
    }
    return acc;
  }, [] as { worksiteId: string; worksiteName: string; totalHours: number }[]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header with title */}
      <header className="bg-white shadow-sm px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Suivi hebdomadaire</h1>
          <div className="text-sm">
            {format(weekStart, "d MMM", { locale: fr })} - {format(weekEnd, "d MMM yyyy", { locale: fr })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-16 pb-20 mt-2">
        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
          <button 
            onClick={handlePreviousWeek} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h2 className="text-sm font-medium">Semaine du</h2>
            <p className="text-lg font-bold">
              {format(weekStart, "d MMM", { locale: fr })} - {format(weekEnd, "d MMM", { locale: fr })}
            </p>
          </div>
          <button 
            onClick={handleNextWeek} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="resume">Résumé</TabsTrigger>
            <TabsTrigger value="daily">Quotidien</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>
          
          {/* Resume Tab - Shows worksite summaries */}
          <TabsContent value="resume" className="space-y-4">
            <WorksiteSummary worksiteSummaries={worksiteSummaries} />
          </TabsContent>
          
          {/* Daily Tab - Shows daily time entries */}
          <TabsContent value="daily" className="space-y-4">
            <DailyTimeEntries
              timeEntries={currentWeekTimeEntries}
              daysOfWeek={daysOfWeek}
            />
          </TabsContent>
          
          {/* Calendar Tab - Shows weekly calendar view */}
          <TabsContent value="calendar" className="space-y-4">
            <WeeklyCalendarView
              timeEntries={currentWeekTimeEntries}
              daysOfWeek={daysOfWeek}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="pointage" />
    </div>
  );
};
