
import { toast } from "sonner";

/**
 * Display a toast notification
 * @param title Title of the notification
 * @param message Message content
 * @param type Type of toast (success, error, warning, info)
 * @param duration Duration in milliseconds
 * @param action Optional URL to navigate to on click
 */
export const showToast = (
  title: string, 
  message: string, 
  type: "success" | "error" | "warning" | "info" = "info",
  duration: number = 5000,
  action?: string
) => {
  return toast[type](title, {
    description: message,
    duration: duration,
    action: action ? {
      label: "Voir",
      onClick: () => window.location.href = action
    } : undefined
  });
};

/**
 * Display a success toast notification
 */
export const showSuccessToast = (title: string, message: string, duration: number = 5000, action?: string) => {
  return showToast(title, message, "success", duration, action);
};

/**
 * Display an error toast notification
 */
export const showErrorToast = (title: string, message: string, duration: number = 5000, action?: string) => {
  return showToast(title, message, "error", duration, action);
};

/**
 * Display a warning toast notification
 */
export const showWarningToast = (title: string, message: string, duration: number = 5000, action?: string) => {
  return showToast(title, message, "warning", duration, action);
};

/**
 * Display an info toast notification
 */
export const showInfoToast = (title: string, message: string, duration: number = 5000, action?: string) => {
  return showToast(title, message, "info", duration, action);
};
