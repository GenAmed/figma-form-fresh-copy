
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  type: string;
  message: string;
  date: string;
  status: string;
  linkedRoute?: string; // Add optional route property
}

interface AlertsTabProps {
  alerts: Alert[];
  showAllAlerts: boolean;
  setShowAllAlerts: (show: boolean) => void;
  alertStatuses: Record<number, string>;
  handleAlertStatusChange: (alertId: number, status: string) => void;
}

export const AlertsTab = ({
  alerts,
  showAllAlerts,
  setShowAllAlerts,
  alertStatuses,
  handleAlertStatusChange
}: AlertsTabProps) => {
  const navigate = useNavigate();
  
  // Filter alerts based on tab selection
  const filteredAlerts = showAllAlerts ? alerts : alerts.filter(alert => alert.status !== "resolved");

  // Handle alert click to navigate
  const handleAlertClick = (alert: Alert) => {
    if (alert.linkedRoute) {
      if (alert.linkedRoute.startsWith('http')) {
        window.location.href = alert.linkedRoute;
      } else {
        navigate(alert.linkedRoute);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Gestion des alertes</CardTitle>
          <div className="flex items-center gap-2">
            <label className="text-sm" htmlFor="showAllAlerts">Afficher résolues</label>
            <input 
              type="checkbox" 
              id="showAllAlerts" 
              className="h-4 w-4"
              checked={showAllAlerts}
              onChange={() => setShowAllAlerts(!showAllAlerts)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAlerts.map(alert => {
            const currentStatus = alertStatuses[alert.id] || alert.status;
            return (
              <div key={alert.id} 
                className={`mb-4 p-4 border-l-4 bg-white rounded shadow-sm ${alert.linkedRoute ? 'cursor-pointer hover:bg-gray-50' : ''}`} 
                style={{
                  borderLeftColor: alert.type === 'warning' ? '#f59e0b' : 
                                  alert.type === 'danger' ? '#ef4444' : 
                                  '#3b82f6'
                }}
                onClick={() => alert.linkedRoute && handleAlertClick(alert)}
                role={alert.linkedRoute ? "button" : undefined}
                tabIndex={alert.linkedRoute ? 0 : undefined}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.type === 'warning' ? 'text-amber-500' : 
                      alert.type === 'danger' ? 'text-red-500' : 
                      'text-blue-500'
                    }`} />
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-gray-500">{alert.date}</div>
                      <div className="mt-1">
                        <Badge variant={
                          currentStatus === 'open' ? 'default' :
                          currentStatus === 'pending' ? 'outline' : 
                          'secondary'
                        }>
                          {currentStatus === 'open' ? 'À traiter' : 
                          currentStatus === 'pending' ? 'En cours' : 
                          'Résolu'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Select 
                    value={currentStatus} 
                    onValueChange={(value) => handleAlertStatusChange(alert.id, value)}
                    // Stop propagation to prevent triggering parent click event
                    onOpenChange={(open) => {
                      if (open) {
                        event?.stopPropagation();
                      }
                    }}
                  >
                    <SelectTrigger className="w-24 h-8 text-xs" onClick={(e) => e.stopPropagation()}>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">À traiter</SelectItem>
                      <SelectItem value="pending">En cours</SelectItem>
                      <SelectItem value="resolved">Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
          {filteredAlerts.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Aucune alerte</AlertTitle>
              <AlertDescription>
                Il n'y a actuellement aucune alerte à afficher.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration des alertes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Seuil heures supplémentaires</Label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="8" className="w-24" />
                <span>heures par jour</span>
              </div>
            </div>
            <div>
              <Label>Alerte absence</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="checkbox" id="absence-alert" className="h-4 w-4" defaultChecked />
                <label htmlFor="absence-alert">Activer notification absences non justifiées</label>
              </div>
            </div>
            <div>
              <Label>Alerte chantiers</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="checkbox" id="chantier-alert" className="h-4 w-4" defaultChecked />
                <label htmlFor="chantier-alert">Activer notification changements de chantiers</label>
              </div>
            </div>
            <Button onClick={() => toast.success("Préférences sauvegardées")}>Sauvegarder préférences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
