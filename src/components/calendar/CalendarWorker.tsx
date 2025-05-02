
import React from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { useWorkerCalendar } from "./hooks/useWorkerCalendar";
import { WorkerHeader } from "./worker/WorkerHeader";
import { WorkerMonthView } from "./worker/WorkerMonthView";
import { MonthOverview } from "./worker/MonthOverview";
import { WorkerAssignments } from "./worker/WorkerAssignments";

interface CalendarWorkerProps {
  user: User;
}

export const CalendarWorker: React.FC<CalendarWorkerProps> = ({ user }) => {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    assignments,
    handlePreviousMonth,
    handleNextMonth,
    selectedDateAssignments,
    getAssignmentDates
  } = useWorkerCalendar();

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header with title */}
      <WorkerHeader title="Calendrier" />

      {/* Main Content */}
      <main className="flex-1 mt-16 mb-16 px-4 pb-4">
        {/* Calendar Widget with Visual Indicators */}
        <WorkerMonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
          assignments={assignments}
        />

        {/* Vue d'ensemble des rendez-vous du mois */}
        <MonthOverview assignments={assignments} />

        {/* Assignments Section */}
        <WorkerAssignments
          selectedDate={selectedDate}
          selectedDateAssignments={selectedDateAssignments}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendrier" />
    </div>
  );
};
