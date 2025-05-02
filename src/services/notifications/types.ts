
// Types for notification services
import type { ReactNode } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface ReminderPreferences {
  morningReminder: boolean;
  morningReminderTime: string;
  eveningReminder: boolean;
  eveningReminderTime: string;
}

// Using the browser's native NotificationOptions as base type
export interface CustomNotificationOptions {
  icon?: ReactNode;
  body?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
}
