
// Service pour gérer les notifications et rappels
import { toast } from "sonner";

// Permissions de notification
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Ce navigateur ne supporte pas les notifications de bureau");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  // Correction: Compare with "default" instead of checking inequality with "denied"
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return Notification.permission === "granted";
};

// Envoyer une notification
export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (!("Notification" in window)) {
    toast(title, {
      description: options?.body,
    });
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    toast(title, {
      description: options?.body,
    });
  }
};

// Programmer un rappel de pointage
export const schedulePointageReminder = (
  timeInMinutes: number, 
  title: string, 
  body: string
): number => {
  const timerId = window.setTimeout(() => {
    sendNotification(title, { body });
  }, timeInMinutes * 60 * 1000);
  
  return timerId;
};

// Annuler un rappel
export const cancelReminder = (timerId: number): void => {
  window.clearTimeout(timerId);
};

// Sauvegarder les préférences de rappel
export const saveReminderPreferences = (preferences: {
  morningReminder: boolean;
  morningReminderTime: string;
  eveningReminder: boolean;
  eveningReminderTime: string;
}): void => {
  localStorage.setItem("avem_reminder_preferences", JSON.stringify(preferences));
};

// Récupérer les préférences de rappel
export const getReminderPreferences = (): {
  morningReminder: boolean;
  morningReminderTime: string;
  eveningReminder: boolean;
  eveningReminderTime: string;
} => {
  const prefsJson = localStorage.getItem("avem_reminder_preferences");
  if (!prefsJson) {
    return {
      morningReminder: true,
      morningReminderTime: "08:00",
      eveningReminder: true,
      eveningReminderTime: "17:00",
    };
  }
  
  try {
    return JSON.parse(prefsJson);
  } catch (e) {
    console.error("Erreur lors de la récupération des préférences de rappel", e);
    return {
      morningReminder: true,
      morningReminderTime: "08:00",
      eveningReminder: true,
      eveningReminderTime: "17:00",
    };
  }
};
