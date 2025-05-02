
// Types for notification services
export type NotificationType = "success" | "error" | "warning" | "info";

export interface ReminderPreferences {
  morningReminder: boolean;
  morningReminderTime: string;
  eveningReminder: boolean;
  eveningReminderTime: string;
}

export interface CustomNotificationOptions {
  body?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  icon?: any; // Can be a URL string or a React component
}
