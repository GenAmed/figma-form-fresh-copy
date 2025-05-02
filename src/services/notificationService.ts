// Service pour gérer les notifications et rappels
import { toast } from "sonner";
import { 
  notificationIcons, 
  type NotificationType 
} from "@/components/notifications/NotificationIcons";

// Permissions de notification
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Ce navigateur ne supporte pas les notifications de bureau");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  // Check if permission is "default" (not decided yet)
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  // If we get here, permission is "denied"
  return false;
};

// Envoyer une notification
export const sendNotification = (
  title: string, 
  options?: NotificationOptions,
  type: NotificationType = "info"
): void => {
  // Notification de bureau si supportée et autorisée
  if (!("Notification" in window)) {
    showToast(title, options?.body, type);
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    showToast(title, options?.body, type);
  }
};

// Afficher un toast avec le type approprié
export const showToast = (
  title: string, 
  description?: string,
  type: NotificationType = "info"
): void => {
  switch (type) {
    case "success":
      toast.success(title, {
        description,
        icon: notificationIcons.success(),
        duration: 4000,
      });
      break;
    case "error":
      toast.error(title, {
        description,
        icon: notificationIcons.error(),
        duration: 6000,
      });
      break;
    case "warning":
      toast.warning(title, {
        description,
        icon: notificationIcons.warning(),
        duration: 5000,
      });
      break;
    case "info":
    default:
      toast.info(title, {
        description,
        icon: notificationIcons.info(),
        duration: 4000,
      });
      break;
  }
};

// Programmer un rappel de pointage
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
  showToast("Préférences enregistrées", "Vos préférences de rappel ont été mises à jour", "success");
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
    showToast("Erreur", "Impossible de récupérer vos préférences de rappel", "error");
    return {
      morningReminder: true,
      morningReminderTime: "08:00",
      eveningReminder: true,
      eveningReminderTime: "17:00",
    };
  }
};

// Feedback visuel pour les actions de pointage
export const showPointageFeedback = (
  action: "start" | "end" | "sync",
  success: boolean,
  details?: string
): void => {
  if (success) {
    switch (action) {
      case "start":
        showToast("Pointage démarré", details || "Votre journée de travail a bien démarré", "success");
        break;
      case "end":
        showToast("Pointage terminé", details || "Votre journée de travail est terminée", "success");
        break;
      case "sync":
        showToast("Synchronisation réussie", details || "Toutes vos données sont synchronisées", "success");
        break;
    }
  } else {
    switch (action) {
      case "start":
        showToast("Erreur de pointage", details || "Impossible de démarrer le pointage", "error");
        break;
      case "end":
        showToast("Erreur de pointage", details || "Impossible de terminer le pointage", "error");
        break;
      case "sync":
        showToast("Erreur de synchronisation", details || "Impossible de synchroniser vos données", "error");
        break;
    }
  }
};

// Feedback pour les actions de localisation
export const showLocationFeedback = (
  success: boolean,
  accuracy?: number,
  details?: string
): void => {
  if (success) {
    let message = "Localisation récupérée avec succès";
    if (accuracy) {
      message += ` (précision: ${accuracy.toFixed(0)}m)`;
    }
    showToast("Localisation", message, "info");
  } else {
    showToast(
      "Problème de localisation", 
      details || "Impossible de récupérer votre position", 
      "warning"
    );
  }
};

// Feedback pour les actions sur les chantiers
export const showWorksiteFeedback = (
  action: "select" | "add" | "update" | "delete",
  success: boolean,
  name?: string,
  details?: string
): void => {
  const worksiteName = name ? `"${name}"` : "";
  
  if (success) {
    switch (action) {
      case "select":
        showToast("Chantier sélectionné", `Vous travaillez maintenant sur ${worksiteName}`, "success");
        break;
      case "add":
        showToast("Chantier ajouté", `Le chantier ${worksiteName} a été créé`, "success");
        break;
      case "update":
        showToast("Chantier mis à jour", details || `Le chantier ${worksiteName} a été modifié`, "success");
        break;
      case "delete":
        showToast("Chantier supprimé", `Le chantier ${worksiteName} a été supprimé`, "info");
        break;
    }
  } else {
    switch (action) {
      case "select":
        showToast("Erreur de sélection", `Impossible de sélectionner le chantier ${worksiteName}`, "error");
        break;
      case "add":
        showToast("Erreur de création", details || `Impossible de créer le chantier`, "error");
        break;
      case "update":
        showToast("Erreur de mise à jour", details || `Impossible de modifier le chantier ${worksiteName}`, "error");
        break;
      case "delete":
        showToast("Erreur de suppression", details || `Impossible de supprimer le chantier ${worksiteName}`, "error");
        break;
    }
  }
};

// Re-export the type using the correct syntax
export type { NotificationType };
