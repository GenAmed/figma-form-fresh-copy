import { useState, useEffect } from "react";
import { addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { showToast } from "@/services/notificationService";
import { Assignment, Worker } from "../types";
import { checkUnassignedWorkers } from "@/services/assignment/assignmentCheckService";

export const useAdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [unassignedWorkers, setUnassignedWorkers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workerStats, setWorkerStats] = useState<Worker[]>([]);

  // Load data on startup
  useEffect(() => {
    // In a real implementation, this data would come from an API
    const fakeAssignments: Assignment[] = [
      {
        id: "1",
        worker: "Jean Dupont",
        site: "Chantier Tour Eiffel",
        status: "confirmed",
        date: new Date(2025, 4, 2) // 2 mai 2025
      },
      {
        id: "2",
        worker: "Marie Martin",
        site: "Chantier Arc de Triomphe",
        status: "pending",
        date: new Date(2025, 4, 5) // 5 mai 2025
      },
      {
        id: "3",
        worker: "Philippe Legrand",
        site: "Chantier Louvre",
        status: "confirmed",
        date: new Date(2025, 4, 5) // 5 mai 2025
      },
      {
        id: "4",
        worker: "Sophie Petit",
        site: "Chantier Notre Dame",
        status: "confirmed",
        date: new Date(2025, 4, 8) // 8 mai 2025
      },
      {
        id: "5",
        worker: "Jean Dupont",
        site: "Chantier Tour Eiffel",
        status: "confirmed",
        date: new Date(2025, 4, 12) // 12 mai 2025
      },
      {
        id: "6",
        worker: "Marie Martin",
        site: "Chantier Montmartre",
        status: "pending",
        date: new Date(2025, 4, 15) // 15 mai 2025
      },
      {
        id: "7",
        worker: "Philippe Legrand",
        site: "Chantier Bastille",
        status: "confirmed",
        date: new Date(2025, 4, 18) // 18 mai 2025
      }
    ];
    
    setAssignments(fakeAssignments);

    // Create statistics for workers
    const fakeWorkerStats: Worker[] = [
      { id: "1", name: "Jean Dupont", assignedDays: 15 },
      { id: "2", name: "Marie Martin", assignedDays: 12 },
      { id: "3", name: "Philippe Legrand", assignedDays: 18 },
      { id: "4", name: "Sophie Petit", assignedDays: 9 }
    ];
    
    setWorkerStats(fakeWorkerStats);

    const unassignedList = checkUnassignedWorkers();
    setUnassignedWorkers(unassignedList);
    
    if (unassignedList.length > 0) {
      const workerNames = unassignedList.map(w => w.name).join(", ");
      showToast(
        `${unassignedList.length} ouvrier(s) non assigné(s)`, 
        `Ouvriers sans assignation: ${workerNames}`,
        "warning",
        5000,
        "/gestion/users"
      );
    }
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle "Add Assignment" button click
  const handleAddAssignment = () => {
    // In a real app, this would open a modal or navigate to an assignment form
    showToast(
      "Ajouter une assignation", 
      "Cette fonctionnalité sera bientôt disponible",
      "info",
      5000,
      "/gestion"
    );
  };

  // Filter assignments for the selected date
  const selectedDateAssignments = assignments.filter(assignment => 
    isSameDay(assignment.date, selectedDate)
  );

  // Get days of the current week
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

  return {
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
  };
};
