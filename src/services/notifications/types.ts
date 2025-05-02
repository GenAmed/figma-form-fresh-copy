
// Types for notification services
import type { ReactNode } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface ReminderPreferences {
  morningReminder: boolean;
  morningReminderTime: string;
  eveningReminder: boolean;
  eveningReminderTime: string;
}

export interface NotificationOptions extends Omit<NotificationOptions, "icon"> {
  icon?: ReactNode;
}
