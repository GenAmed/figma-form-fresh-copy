
import { useState, useEffect } from "react";
import { addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { showToast } from "@/services/notifications/toastService";
import { Assignment, Worker } from "../types";
import { checkUnassignedWorkers } from "@/services/assignment/assignmentCheckService";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [unassignedWorkers, setUnassignedWorkers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workerStats, setWorkerStats] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);

  // Load assignments from database
  const loadAssignments = async () => {
    setLoading(true);
    try {
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          id,
          start_date,
          end_date,
          user_id,
          worksite_id,
          profiles!inner(name),
          worksites!inner(name)
        `);

      if (assignmentsError) {
        console.error('Erreur lors du chargement des assignations:', assignmentsError);
        showToast("Erreur", "Impossible de charger les assignations", "error");
        return;
      }

      // Transform assignments data to match the expected format
      const transformedAssignments: Assignment[] = (assignmentsData || []).map(assignment => ({
        id: assignment.id,
        worker: assignment.profiles.name,
        site: assignment.worksites.name,
        status: "confirmed" as const,
        date: new Date(assignment.start_date)
      }));

      setAssignments(transformedAssignments);

      // Generate worker stats from assignments
      const workerStatsMap = new Map<string, { name: string; assignedDays: number }>();
      
      transformedAssignments.forEach(assignment => {
        const existing = workerStatsMap.get(assignment.worker);
        if (existing) {
          existing.assignedDays += 1;
        } else {
          workerStatsMap.set(assignment.worker, {
            name: assignment.worker,
            assignedDays: 1
          });
        }
      });

      const stats: Worker[] = Array.from(workerStatsMap.entries()).map(([name, data], index) => ({
        id: (index + 1).toString(),
        name: data.name,
        assignedDays: data.assignedDays
      }));

      setWorkerStats(stats);
      
    } catch (error) {
      console.error('Erreur lors du chargement des assignations:', error);
      showToast("Erreur", "Impossible de charger les assignations", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load unassigned workers
  const loadUnassignedWorkers = async () => {
    try {
      const unassignedList = await checkUnassignedWorkers();
      setUnassignedWorkers(unassignedList);
      
      if (unassignedList.length > 0) {
        const workerNames = unassignedList.map(w => w.name).join(", ");
        showToast(
          `${unassignedList.length} ouvrier(s) non assigné(s)`, 
          `Ouvriers sans assignation: ${workerNames}`,
          "warning",
          5000,
          "#/gestion/users"
        );
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ouvriers non assignés:', error);
    }
  };

  // Load data on startup
  useEffect(() => {
    loadAssignments();
    loadUnassignedWorkers();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle "Add Assignment" button click
  const handleAddAssignment = () => {
    showToast(
      "Ajouter une assignation", 
      "Cette fonctionnalité sera bientôt disponible",
      "info",
      5000,
      "#/gestion"
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
    weekDays,
    loading
  };
};
