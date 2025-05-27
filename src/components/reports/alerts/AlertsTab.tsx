
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertCircle, Loader2 } from "lucide-react";
import { Alert } from "@/hooks/useAlertsData";

interface AlertsTabProps {
  alerts: Alert[];
  loading: boolean;
  showAllAlerts: boolean;
  setShowAllAlerts: (show: boolean) => void;
  alertStatuses: Record<number, string>;
  handleAlertStatusChange: (alertId: number, status: string) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  loading,
  showAllAlerts,
  setShowAllAlerts,
  alertStatuses,
  handleAlertStatusChange
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "danger":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "danger":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const filteredAlerts = showAllAlerts ? alerts : alerts.filter(alert => alert.status === "open");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-[#BD1E28] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Alertes système</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllAlerts(!showAllAlerts)}
        >
          {showAllAlerts ? "Afficher nouvelles seulement" : "Afficher toutes"}
        </Button>
      </div>

      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {showAllAlerts ? "Aucune alerte disponible" : "Aucune nouvelle alerte"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getAlertBadgeColor(alert.type)}>
                      {alert.type === "warning" ? "Attention" :
                       alert.type === "danger" ? "Urgent" : "Info"}
                    </Badge>
                    <Badge className={getStatusBadgeColor(alertStatuses[alert.id] || alert.status)}>
                      {alertStatuses[alert.id] === "resolved" || alert.status === "resolved" ? "Résolu" :
                       alertStatuses[alert.id] === "pending" || alert.status === "pending" ? "En cours" : "Nouveau"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAlertStatusChange(alert.id, "pending")}
                    disabled={alertStatuses[alert.id] === "resolved"}
                  >
                    Marquer en cours
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAlertStatusChange(alert.id, "resolved")}
                  >
                    Marquer résolu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
