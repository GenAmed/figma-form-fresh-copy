
// Main notification service that re-exports all notification-related functions
export * from "./notifications/toastService";
export * from "./notifications/reminderService";
export * from "./notifications/desktopNotifications";
export * from "./notifications/feedbackService";
export type { NotificationType, ReminderPreferences } from "./notifications/types";
