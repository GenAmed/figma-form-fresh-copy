
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type FeedbackType = "success" | "error" | "warning" | "info";

interface FeedbackAlertProps {
  type: FeedbackType;
  title: string;
  description?: string;
  className?: string;
  onDismiss?: () => void;
  autoClose?: boolean;
  duration?: number;
  navigateTo?: string;
  buttonText?: string;
}

export const FeedbackAlert: React.FC<FeedbackAlertProps> = ({
  type,
  title,
  description,
  className,
  onDismiss,
  autoClose = true,
  duration = 5000,
  navigateTo,
  buttonText = "Voir détails",
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (navigateTo) {
      if (navigateTo.startsWith('http')) {
        window.location.href = navigateTo;
      } else {
        navigate(navigateTo);
      }
    }
  };

  // Déterminer l'icône et les couleurs en fonction du type
  const getIconAndClass = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          alertClass: "border-green-200 bg-green-50",
          titleClass: "text-green-800",
          descriptionClass: "text-green-700",
          buttonClass: "bg-green-100 hover:bg-green-200 text-green-800",
        };
      case "error":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          alertClass: "border-red-200 bg-red-50",
          titleClass: "text-red-800",
          descriptionClass: "text-red-700",
          buttonClass: "bg-red-100 hover:bg-red-200 text-red-800",
        };
      case "warning":
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          alertClass: "border-amber-200 bg-amber-50",
          titleClass: "text-amber-800",
          descriptionClass: "text-amber-700",
          buttonClass: "bg-amber-100 hover:bg-amber-200 text-amber-800",
        };
      case "info":
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          alertClass: "border-blue-200 bg-blue-50",
          titleClass: "text-blue-800",
          descriptionClass: "text-blue-700",
          buttonClass: "bg-blue-100 hover:bg-blue-200 text-blue-800",
        };
    }
  };

  const { icon, alertClass, titleClass, descriptionClass, buttonClass } = getIconAndClass();

  return (
    <Alert className={cn("relative", alertClass, className)}>
      {icon}
      <AlertTitle className={cn("ml-2", titleClass)}>{title}</AlertTitle>
      {description && (
        <AlertDescription className={cn("ml-2", descriptionClass)}>
          {description}
        </AlertDescription>
      )}
      
      {navigateTo && (
        <div className="mt-2 ml-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClick}
            className={cn("text-xs py-1 px-2 h-auto", buttonClass)}
          >
            {buttonText}
          </Button>
        </div>
      )}
      
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
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
