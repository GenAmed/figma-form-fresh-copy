
import { useState, useEffect } from "react";
import { addMonths, subMonths, isSameDay } from "date-fns";
import { Assignment } from "../types";

export const useWorkerCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Load assignments (example with fake data)
  useEffect(() => {
    // In a real app, this data would come from an API
    const fakeAssignments: Assignment[] = [
      {
        id: "1",
        worker: "Thomas",
        site: "Chantier Bordeaux Centre",
        status: "confirmed",
        date: new Date(2025, 4, 2) // 2 mai 2025
      },
      {
        id: "2",
        worker: "Thomas",
        site: "Chantier Mérignac",
        status: "pending",
        date: new Date(2025, 4, 5) // 5 mai 2025
      },
      {
        id: "3",
        worker: "Thomas",
        site: "Chantier Pessac",
        status: "confirmed",
        date: new Date(2025, 4, 7) // 7 mai 2025
      },
      {
        id: "4", 
        worker: "Thomas",
        site: "Chantier Lormont",
        status: "confirmed",
        date: new Date(2025, 4, 12) // 12 mai 2025
      },
      {
        id: "5",
        worker: "Thomas",
        site: "Chantier Bordeaux Centre",
        status: "confirmed",
        date: new Date(2025, 4, 15) // 15 mai 2025
      }
    ];
    
    setAssignments(fakeAssignments);
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Filter assignments for the selected date
  const selectedDateAssignments = assignments.filter(assignment => 
    isSameDay(assignment.date, selectedDate)
  );

  // Function to get dates that have assignments
  const getAssignmentDates = () => {
    return assignments.map(assignment => assignment.date);
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    assignments,
    handlePreviousMonth,
    handleNextMonth,
    selectedDateAssignments,
    getAssignmentDates
  };
};
