
import React from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { useWorkerCalendar } from "../hooks/useWorkerCalendar";
import { WorkerHeader } from "./WorkerHeader";
import { WorkerMonthView } from "./WorkerMonthView";
import { MonthOverview } from "./MonthOverview";
import { WorkerAssignments } from "./WorkerAssignments";

interface WorkerCalendarProps {
  user: User;
}

export const WorkerCalendar: React.FC<WorkerCalendarProps> = ({ user }) => {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    assignments,
    handlePreviousMonth,
    handleNextMonth,
    selectedDateAssignments,
    getAssignmentDates,
    loading
  } = useWorkerCalendar();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BD1E28] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos assignations...</p>
        </div>
      </div>
    );
  }

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
