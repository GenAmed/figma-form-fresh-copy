
import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import type { NotificationType } from "../../services/notifications/types";

// Component to render notification icons
export const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    case "error":
      return <XCircle className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
  }
};

// Icon functions for Sonner toast usage
export const notificationIcons = {
  success: () => <CheckCircle className="h-4 w-4" />,
  error: () => <XCircle className="h-4 w-4" />,
  info: () => <Info className="h-4 w-4" />,
  warning: () => <AlertCircle className="h-4 w-4" />
};
