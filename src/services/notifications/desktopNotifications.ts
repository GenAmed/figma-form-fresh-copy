
// Service for handling desktop notifications
import { showToast } from "./toastService";
import type { NotificationType } from "./types";

// Check if browser supports notifications
export const supportsNotifications = (): boolean => {
  return "Notification" in window;
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!supportsNotifications()) {
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

// Send notification using either desktop notification or toast
export const sendNotification = (
  title: string, 
  options?: NotificationOptions,
  type: NotificationType = "info"
): void => {
  // Notification de bureau si supportée et autorisée
  if (!supportsNotifications()) {
    showToast(title, options?.body, type);
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    showToast(title, options?.body, type);
  }
};
