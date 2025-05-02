
import { toast } from "sonner";
import { notificationIcons } from "@/components/notifications/NotificationIcons";
import type { NotificationType } from "./types";
import { sendEmailToAdmins } from "./emailService";
import { useNavigate } from "react-router-dom";

// Display a toast notification
export const showToast = (title: string, description?: string, type: NotificationType = "info", duration = 5000): void => {
  toast[type](title, {
    description,
    duration,
    icon: notificationIcons[type]()
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
  sendEmail: boolean = false
): Promise<void> => {
  // Show toast notification
  showToast(title, description, type, 8000); // Longer duration for admin alerts
  
  // Send email if requested
  if (sendEmail) {
    await sendEmailToAdmins(title, description, type);
  }
};
