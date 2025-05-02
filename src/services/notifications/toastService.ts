
// Service for managing toast notifications
import { toast } from "sonner";
import { notificationIcons } from "@/components/notifications/NotificationIcons";
import type { NotificationType } from "./types";

// Show toast with appropriate type
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
