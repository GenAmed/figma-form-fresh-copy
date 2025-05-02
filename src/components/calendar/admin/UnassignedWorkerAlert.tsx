
import React from "react";
import { AlertTriangle } from "lucide-react";

interface UnassignedWorkerAlertProps {
  unassignedWorkers: any[];
}

export const UnassignedWorkerAlert: React.FC<UnassignedWorkerAlertProps> = ({ unassignedWorkers }) => {
  if (unassignedWorkers.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
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
