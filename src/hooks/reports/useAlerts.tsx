
import { useState } from "react";
import { toast } from "sonner";

export const useAlerts = () => {
  const [alertStatuses, setAlertStatuses] = useState<Record<number, string>>({});
  const [showAllAlerts, setShowAllAlerts] = useState<boolean>(false);

  // Gérer le changement de statut des alertes
  const handleAlertStatusChange = (alertId: number, status: string) => {
    setAlertStatuses(prev => ({
      ...prev,
      [alertId]: status
    }));
    
    toast.success(`Statut de l'alerte mis à jour : ${status}`);
  };

  return {
    alertStatuses,
    showAllAlerts,
    setShowAllAlerts,
    handleAlertStatusChange
  };
};
