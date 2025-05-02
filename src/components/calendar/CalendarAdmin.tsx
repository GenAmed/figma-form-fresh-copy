
import React from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminCalendar } from "./hooks/useAdminCalendar";
import { CalendarHeader } from "./admin/CalendarHeader";
import { UnassignedWorkerAlert } from "./admin/UnassignedWorkerAlert";
import { CalendarMonthView } from "./admin/CalendarMonthView";
import { WorkerStats } from "./admin/WorkerStats";
import { DailyAssignments } from "./admin/DailyAssignments";
import { WeeklyView } from "./admin/WeeklyView";
import { FloatingActionButton } from "./admin/FloatingActionButton";

interface CalendarAdminProps {
  user: User;
}

export const CalendarAdmin: React.FC<CalendarAdminProps> = ({ user }) => {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    unassignedWorkers,
    activeTab,
    setActiveTab,
    assignments,
    workerStats,
    handlePreviousMonth,
    handleNextMonth,
    handleAddAssignment,
    selectedDateAssignments,
    weekDays
  } = useAdminCalendar();

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <CalendarHeader title="Calendrier des assignations" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {/* Tabs for different views */}
        <Tabs defaultValue="daily" className="w-full mb-4" onValueChange={(value) => setActiveTab(value as "daily" | "weekly")}>
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="daily">Vue Journalière</TabsTrigger>
            <TabsTrigger value="weekly">Vue Hebdomadaire</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Unassigned Workers Alert (if any) */}
        <UnassignedWorkerAlert unassignedWorkers={unassignedWorkers} />

        {/* Calendar Widget with Visual Indicators */}
        <CalendarMonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
          assignments={assignments}
        />

        {/* Worker Stats and Quick View */}
        <WorkerStats 
          workerStats={workerStats} 
          assignments={assignments}
          handleAddAssignment={handleAddAssignment}
        />

        {/* Daily View */}
        {activeTab === "daily" && (
          <DailyAssignments 
            selectedDate={selectedDate}
            selectedDateAssignments={selectedDateAssignments}
            handleAddAssignment={handleAddAssignment}
          />
        )}

        {/* Weekly View */}
        {activeTab === "weekly" && (
          <WeeklyView 
            weekDays={weekDays}
            workerStats={workerStats}
            assignments={assignments}
            handleAddAssignment={handleAddAssignment}
          />
        )}

        {/* Floating Action Button */}
        <FloatingActionButton onClick={handleAddAssignment} />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendrier" />
    </div>
  );
};
