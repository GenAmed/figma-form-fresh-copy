
import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/services/notifications/toastService";
import { Button } from "@/components/ui/button";

interface UnassignedWorkerAlertProps {
  unassignedWorkers: any[];
}

export const UnassignedWorkerAlert: React.FC<UnassignedWorkerAlertProps> = ({ unassignedWorkers }) => {
  const navigate = useNavigate();
  
  if (unassignedWorkers.length === 0) {
    return null;
  }

  const handleClick = () => {
    // Navigate to the user management page
    navigate("/gestion/users");
    
    // Show a toast with details about unassigned workers
    showToast(
      `${unassignedWorkers.length} ouvrier(s) non-assignés`, 
      `Visualisez les détails de chaque ouvrier non assigné`,
      "warning",
      5000,
      "/gestion/users"
    );
  };

  return (
    <div 
      className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 hover:bg-amber-100 transition-colors"
      role="region"
      aria-label="Alerte ouvriers non-assignés"
    >
      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">Attention</p>
        <p className="text-xs text-amber-800">
          {unassignedWorkers.length} ouvrier(s) n'ont pas d'assignation pour la semaine prochaine.
        </p>
        <div className="mt-2">
          <Button
            onClick={handleClick}
            size="sm"
            variant="outline"
            className="bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-800 text-xs h-7 px-3"
          >
            Voir détails
          </Button>
        </div>
      </div>
    </div>
  );
};
