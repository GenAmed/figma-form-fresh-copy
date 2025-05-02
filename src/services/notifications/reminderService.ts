
// Service for managing reminders
import { sendNotification } from "./desktopNotifications";
import { showToast } from "./toastService";
import type { NotificationType, ReminderPreferences } from "./types";

// Schedule a reminder for pointage
export const schedulePointageReminder = (
  timeInMinutes: number, 
  title: string, 
  body: string,
  type: NotificationType = "info"
): number => {
  const timerId = window.setTimeout(() => {
    sendNotification(title, { body }, type);
  }, timeInMinutes * 60 * 1000);
  
  return timerId;
};

// Cancel a scheduled reminder
export const cancelReminder = (timerId: number): void => {
  window.clearTimeout(timerId);
};

// Save reminder preferences
export const saveReminderPreferences = (preferences: ReminderPreferences): void => {
  localStorage.setItem("avem_reminder_preferences", JSON.stringify(preferences));
  showToast("Préférences enregistrées", "Vos préférences de rappel ont été mises à jour", "success");
};

// Get reminder preferences from localStorage
export const getReminderPreferences = (): ReminderPreferences => {
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
    showToast("Erreur", "Impossible de récupérer vos préférences de rappel", "error");
    return {
      morningReminder: true,
      morningReminderTime: "08:00",
      eveningReminder: true,
      eveningReminderTime: "17:00",
    };
  }
};
