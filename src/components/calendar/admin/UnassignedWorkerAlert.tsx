
import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  };

  return (
    <div 
      className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-amber-100 transition-colors"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Voir les ouvriers non-assignés"
    >
      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
      <div>
        <p className="text-sm font-medium">Attention</p>
        <p className="text-xs text-amber-800">
          {unassignedWorkers.length} ouvrier(s) n'ont pas d'assignation pour la semaine prochaine.
        </p>
      </div>
    </div>
  );
};
