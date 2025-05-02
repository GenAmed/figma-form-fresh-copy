
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackType = "success" | "error" | "warning" | "info";

interface FeedbackAlertProps {
  type: FeedbackType;
  title: string;
  description?: string;
  className?: string;
  onDismiss?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const FeedbackAlert: React.FC<FeedbackAlertProps> = ({
  type,
  title,
  description,
  className,
  onDismiss,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoClose) {
      timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onDismiss]);

  if (!isVisible) return null;

  // Déterminer l'icône et les couleurs en fonction du type
  const getIconAndClass = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          alertClass: "border-green-200 bg-green-50",
          titleClass: "text-green-800",
          descriptionClass: "text-green-700",
        };
      case "error":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          alertClass: "border-red-200 bg-red-50",
          titleClass: "text-red-800",
          descriptionClass: "text-red-700",
        };
      case "warning":
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          alertClass: "border-amber-200 bg-amber-50",
          titleClass: "text-amber-800",
          descriptionClass: "text-amber-700",
        };
      case "info":
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          alertClass: "border-blue-200 bg-blue-50",
          titleClass: "text-blue-800",
          descriptionClass: "text-blue-700",
        };
    }
  };

  const { icon, alertClass, titleClass, descriptionClass } = getIconAndClass();

  return (
    <Alert className={cn("relative", alertClass, className)}>
      {icon}
      <AlertTitle className={cn("ml-2", titleClass)}>{title}</AlertTitle>
      {description && (
        <AlertDescription className={cn("ml-2", descriptionClass)}>
          {description}
        </AlertDescription>
      )}
      {onDismiss && (
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss();
          }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Fermer"
        >
          <XCircle className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </Alert>
  );
};
