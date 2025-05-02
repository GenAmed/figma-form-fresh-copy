
import { toast } from "sonner";
import { notificationIcons } from "@/components/notifications/NotificationIcons";
import type { NotificationType } from "./types";
import { sendEmailToAdmins } from "./emailService";

// Display a toast notification with optional navigation link
export const showToast = (
  title: string, 
  description?: string, 
  type: NotificationType = "info", 
  duration = 5000,
  navigateTo?: string
): void => {
  toast[type](title, {
    description,
    duration,
    icon: notificationIcons[type](),
    action: navigateTo ? {
      label: "Voir",
      onClick: () => window.location.href = navigateTo
    } : undefined
  });
};

// Display a toast notification with a link to navigate back
export const showToastWithBackLink = (title: string, description?: string, type: NotificationType = "info"): void => {
  toast[type](title, {
    description,
    duration: 8000,
    icon: notificationIcons[type](),
    action: {
      label: "Retour",
      onClick: () => window.history.back()
    }
  });
};

// Send an admin notification with optional email
export const notifyAdmins = async (
  title: string, 
  description: string, 
  type: NotificationType = "info",
  sendEmail: boolean = false,
  navigateTo?: string
): Promise<void> => {
  // Show toast notification
  showToast(title, description, type, 8000, navigateTo); // Longer duration for admin alerts
  
  // Send email if requested
  if (sendEmail) {
    await sendEmailToAdmins(title, description, type);
  }
};
