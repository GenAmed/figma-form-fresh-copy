
import { format, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { showToast } from "../notifications/toastService";

// Temporary mock data - to be replaced with actual API calls
interface Employee {
  id: string;
  name: string;
  role: string;
}

interface Assignment {
  id: string;
  employeeId: string;
  worksiteId: string;
  startDate: Date;
  endDate: Date;
}

// Mock data for testing
const mockEmployees: Employee[] = [
  { id: "1", name: "Jean Dupont", role: "worker" },
  { id: "2", name: "Marie Martin", role: "worker" },
  { id: "3", name: "Pierre Durand", role: "worker" },
  { id: "4", name: "Sophie Lefebvre", role: "worker" },
];

const mockAssignments: Assignment[] = [
  { 
    id: "1", 
    employeeId: "1", 
    worksiteId: "1", 
    startDate: new Date(2025, 4, 5), // May 5, 2025
    endDate: new Date(2025, 4, 9)    // May 9, 2025
  },
  { 
    id: "2", 
    employeeId: "2", 
    worksiteId: "2", 
    startDate: new Date(2025, 4, 5), 
    endDate: new Date(2025, 4, 9) 
  },
  // Employee 3 is not assigned for next week
  { 
    id: "3", 
    employeeId: "4", 
    worksiteId: "1", 
    startDate: new Date(2025, 4, 5), 
    endDate: new Date(2025, 4, 9) 
  },
];

/**
 * Checks for unassigned workers for the next week
 * @returns An array of unassigned worker names
 */
export const checkUnassignedWorkers = (): Employee[] => {
  // Get the start and end dates for next week
  const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
  
  // Filter workers with no assignments for next week
  const unassignedWorkers = mockEmployees.filter(employee => {
    // Only check workers (not admins or other roles)
    if (employee.role !== "worker") return false;
    
    // Check if the worker has any assignments for next week
    const hasAssignmentNextWeek = mockAssignments.some(assignment => 
      assignment.employeeId === employee.id && 
      assignment.startDate <= nextWeekEnd &&
      assignment.endDate >= nextWeekStart
    );
    
    // Return workers who don't have assignments
    return !hasAssignmentNextWeek;
  });
  
  return unassignedWorkers;
};

/**
 * Sends notifications if there are unassigned workers for next week
 * @param sendEmail Whether to also send email notifications
 */
export const checkAndNotifyUnassignedWorkers = (sendEmail: boolean = true): void => {
  // Only run this check on Fridays
  const today = new Date();
  const isFriday = today.getDay() === 5; // 0 is Sunday, 5 is Friday
  
  // For testing, you can comment out this condition
  // if (!isFriday) return;
  
  const unassignedWorkers = checkUnassignedWorkers();
  
  if (unassignedWorkers.length > 0) {
    // Format a nice message
    const nextWeekFormatted = format(
      addWeeks(new Date(), 1), 
      "'semaine du' dd MMMM yyyy", 
      { locale: fr }
    );
    
    const workerNames = unassignedWorkers.map(w => w.name).join(", ");
    
    const title = `${unassignedWorkers.length} ouvrier(s) non assigné(s)`;
    const message = `Les ouvriers suivants n'ont pas d'assignation pour la ${nextWeekFormatted} : ${workerNames}`;
    
    // Toast notification with navigation to user management page
    showToast(
      title,
      message,
      "warning", 
      10000, // 10 seconds
      "/gestion/users"
    );
    
    // Email notification (mock for now)
    if (sendEmail) {
      console.log(`[EMAIL] Subject: ${title} - Body: ${message}`);
      sendEmailToAdmins(title, message);
    }
  }
};

/**
 * Mock function for sending emails to administrators
 * In a real implementation, this would use a proper email service
 */
const sendEmailToAdmins = (subject: string, body: string): void => {
  // This would be replaced with actual email sending logic
  console.log(`Email would be sent to admins with subject: "${subject}" and body: "${body}"`);
};

// Schedule the check to run automatically
export const scheduleUnassignedWorkersCheck = (): void => {
  // Check immediately when the app loads
  checkAndNotifyUnassignedWorkers();
  
  // Schedule to run every day at 9:00 AM
  const now = new Date();
  const nextCheck = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + (now.getHours() >= 9 ? 1 : 0), // If it's past 9 AM, schedule for tomorrow
    9, 0, 0 // 9:00:00 AM
  );
  
  const timeUntilNextCheck = nextCheck.getTime() - now.getTime();
  
  setTimeout(() => {
    checkAndNotifyUnassignedWorkers();
    
    // Then run daily at 9:00 AM
    setInterval(checkAndNotifyUnassignedWorkers, 24 * 60 * 60 * 1000);
  }, timeUntilNextCheck);
};
