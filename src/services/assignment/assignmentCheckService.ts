
import { format, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { showToast } from "../notifications/toastService";
import { supabase } from "@/integrations/supabase/client";

// Variable globale pour éviter les checks multiples
let hasScheduledCheck = false;
let lastCheckTime = 0;
const CHECK_COOLDOWN = 60000; // 1 minute de cooldown

/**
 * Checks for unassigned workers for the next week using real Supabase data
 * @returns An array of unassigned worker profiles
 */
export const checkUnassignedWorkers = async () => {
  try {
    // Get the start and end dates for next week
    const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
    
    // Get all active workers
    const { data: workers, error: workersError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('role', 'ouvrier')
      .eq('active', true);

    if (workersError) {
      console.error('Erreur lors de la récupération des ouvriers:', workersError);
      return [];
    }

    // Get all assignments for next week
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('user_id')
      .gte('start_date', format(nextWeekStart, 'yyyy-MM-dd'))
      .lte('start_date', format(nextWeekEnd, 'yyyy-MM-dd'));

    if (assignmentsError) {
      console.error('Erreur lors de la récupération des assignations:', assignmentsError);
      return [];
    }

    // Create a set of assigned worker IDs
    const assignedWorkerIds = new Set(assignments?.map(a => a.user_id) || []);
    
    // Filter workers who don't have assignments for next week
    const unassignedWorkers = (workers || []).filter(worker => 
      !assignedWorkerIds.has(worker.id)
    );
    
    return unassignedWorkers;
  } catch (error) {
    console.error('Erreur lors de la vérification des ouvriers non assignés:', error);
    return [];
  }
};

/**
 * Sends notifications if there are unassigned workers for next week
 * @param sendEmail Whether to also send email notifications
 */
export const checkAndNotifyUnassignedWorkers = async (sendEmail: boolean = true): Promise<void> => {
  const now = Date.now();
  
  // Éviter les notifications trop fréquentes
  if (now - lastCheckTime < CHECK_COOLDOWN) {
    console.log('🔕 [Assignment Check] Cooldown actif, notification ignorée');
    return;
  }

  try {
    console.log('🔍 [Assignment Check] Vérification des ouvriers non assignés...');
    const unassignedWorkers = await checkUnassignedWorkers();
    
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
      
      lastCheckTime = now; // Mettre à jour le timestamp
    } else {
      console.log('✅ [Assignment Check] Tous les ouvriers sont assignés');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des ouvriers non assignés:', error);
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
  // Éviter de programmer plusieurs fois
  if (hasScheduledCheck) {
    console.log('⚠️ [Assignment Check] Check déjà programmé');
    return;
  }

  console.log('📅 [Assignment Check] Programmation des vérifications automatiques');
  hasScheduledCheck = true;
  
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
