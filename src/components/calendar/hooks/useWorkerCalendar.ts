
import { useState, useEffect } from "react";
import { addMonths, subMonths, isSameDay } from "date-fns";
import { Assignment } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";

export const useWorkerCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Load assignments for the current user
  const loadUserAssignments = async () => {
    const user = getCurrentUser();
    if (!user) return;

    setLoading(true);
    try {
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          id,
          start_date,
          end_date,
          worksites!inner(name)
        `)
        .eq('user_id', user.id);

      if (assignmentsError) {
        console.error('Erreur lors du chargement des assignations:', assignmentsError);
        return;
      }

      // Transform assignments data to match the expected format
      const transformedAssignments: Assignment[] = (assignmentsData || []).map(assignment => ({
        id: assignment.id,
        worker: user.name,
        site: assignment.worksites.name,
        status: "confirmed" as const,
        date: new Date(assignment.start_date)
      }));

      setAssignments(transformedAssignments);
      
    } catch (error) {
      console.error('Erreur lors du chargement des assignations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAssignments();
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
    getAssignmentDates,
    loading
  };
};
