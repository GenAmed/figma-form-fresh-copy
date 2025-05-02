
// Service for handling desktop notifications
import { showToast } from "./toastService";
import type { NotificationType, CustomNotificationOptions } from "./types";

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
  options?: CustomNotificationOptions & NotificationOptions,
  type: NotificationType = "info"
): void => {
  // Notification de bureau si supportée et autorisée
  if (!supportsNotifications()) {
    showToast(title, options?.body, type);
    return;
  }
  
  if (Notification.permission === "granted") {
    // Extract properties that are compatible with browser's NotificationOptions
    const browserOptions: NotificationOptions = {
      body: options?.body,
      tag: options?.tag,
      data: options?.data,
      requireInteraction: options?.requireInteraction,
      silent: options?.silent,
      // Cannot include icon if it's a ReactNode, Notification API needs string
    };
    
    new Notification(title, browserOptions);
  } else {
    showToast(title, options?.body, type);
  }
};
