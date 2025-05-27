
import React from "react";
import { AlertTriangle } from "lucide-react";
import { RecentAlert } from "@/hooks/useRecentAlerts";

interface RecentAlertsProps {
  alerts: RecentAlert[];
  loading: boolean;
  onViewAllClick: () => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({
  alerts,
  loading,
  onViewAllClick
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "danger":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  return (
    <section id="recent-alerts" className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#333333]">Alertes Récentes</h2>
        <button 
          onClick={onViewAllClick} 
          className="text-xs text-[#BD1E28] hover:underline"
        >
          Voir tout
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-md"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-[#666666]">Aucune alerte récente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`flex items-start space-x-3 p-3 ${getAlertBgColor(alert.type)} rounded-md`}>
              <AlertTriangle className={`w-5 h-5 ${getAlertIcon(alert.type)} mt-0.5`} />
              <div>
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-[#666666]">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
