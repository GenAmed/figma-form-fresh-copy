
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SavedReport {
  id: string;
  name: string;
  filters: any;
}

interface CustomReportsTabProps {
  customReportName: string;
  setCustomReportName: (name: string) => void;
  savedReports: SavedReport[];
  handleSaveReport: () => void;
  handleDeleteReport: (reportId: string) => void;
}

export const CustomReportsTab = ({
  customReportName,
  setCustomReportName,
  savedReports,
  handleSaveReport,
  handleDeleteReport
}: CustomReportsTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Rapports personnalisés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Créer un nouveau rapport personnalisé</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="Nom du rapport" 
                  value={customReportName}
                  onChange={(e) => setCustomReportName(e.target.value)}
                  className="flex-1" 
                />
                <Button onClick={handleSaveReport}>
                  Sauvegarder
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Le rapport sera créé avec les filtres actuellement appliqués.
              </p>
            </div>
            
            <div>
              <Label>Rapports sauvegardés</Label>
              <div className="space-y-2 mt-2">
                {savedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-white border rounded-md">
                    <span className="font-medium">{report.name}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast.success(`Rapport "${report.name}" chargé`);
                        }}
                      >
                        Charger
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
                
                {savedReports.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>Aucun rapport personnalisé sauvegardé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Modèles de rapports prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Rapport hebdomadaire</h3>
              <p className="text-sm text-gray-500 mt-1">
                Résumé des heures par employé sur 7 jours
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                toast.success("Modèle de rapport hebdomadaire appliqué");
              }}>
                Appliquer
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Rapport mensuel</h3>
              <p className="text-sm text-gray-500 mt-1">
                Résumé des heures par chantier sur 30 jours
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                toast.success("Modèle de rapport mensuel appliqué");
              }}>
                Appliquer
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Synthèse par chantier</h3>
              <p className="text-sm text-gray-500 mt-1">
                Détail des heures par employé, groupées par chantier
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                toast.success("Modèle de synthèse par chantier appliqué");
              }}>
                Appliquer
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Suivi des anomalies</h3>
              <p className="text-sm text-gray-500 mt-1">
                Liste des alertes et anomalies de pointage
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                toast.success("Modèle de suivi des anomalies appliqué");
              }}>
                Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
