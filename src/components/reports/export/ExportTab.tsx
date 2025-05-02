
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FileText, File, Download, Printer } from "lucide-react";
import { ExportFormat } from "@/services/export/types";

interface ExportTabProps {
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  exportInProgress: boolean;
  handleExport: () => Promise<void>;
  handlePrintReport: () => void;
}

export const ExportTab = ({
  exportFormat,
  setExportFormat,
  exportInProgress,
  handleExport,
  handlePrintReport
}: ExportTabProps) => {
  const [exportOptions, setExportOptions] = useState({
    pointages: true,
    resumeChantiers: true,
    resumeEmployes: true,
    alertes: false,
    geoloc: false,
    grouperSemaine: true
  });
  
  const handleOptionChange = (option: string) => {
    setExportOptions({
      ...exportOptions,
      [option]: !exportOptions[option as keyof typeof exportOptions]
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Exporter les données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Format d'export</label>
              <Select
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as ExportFormat)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span>Excel (.xlsx)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span>CSV</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>PDF</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contenu à exporter</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="pointages" 
                    className="h-4 w-4" 
                    checked={exportOptions.pointages}
                    onChange={() => handleOptionChange('pointages')}
                  />
                  <label htmlFor="pointages">Pointages détaillés</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="resume-chantiers" 
                    className="h-4 w-4" 
                    checked={exportOptions.resumeChantiers}
                    onChange={() => handleOptionChange('resumeChantiers')}
                  />
                  <label htmlFor="resume-chantiers">Résumé par chantier</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="resume-employes" 
                    className="h-4 w-4" 
                    checked={exportOptions.resumeEmployes}
                    onChange={() => handleOptionChange('resumeEmployes')}
                  />
                  <label htmlFor="resume-employes">Résumé par employé</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="alertes" 
                    className="h-4 w-4"
                    checked={exportOptions.alertes}
                    onChange={() => handleOptionChange('alertes')}
                  />
                  <label htmlFor="alertes">Alertes et anomalies</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Options avancées</label>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="inclure-geoloc" 
                    className="h-4 w-4"
                    checked={exportOptions.geoloc}
                    onChange={() => handleOptionChange('geoloc')}
                  />
                  <label htmlFor="inclure-geoloc">Inclure données de géolocalisation</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="grouper-semaine" 
                    className="h-4 w-4"
                    checked={exportOptions.grouperSemaine}
                    onChange={() => handleOptionChange('grouperSemaine')}
                  />
                  <label htmlFor="grouper-semaine">Grouper par semaine</label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrintReport}
            disabled={exportInProgress}
          >
            <Printer className="h-4 w-4 mr-1" />
            Imprimer
          </Button>
          <Button 
            onClick={handleExport}
            disabled={exportInProgress}
          >
            <Download className="h-4 w-4 mr-1" />
            {exportInProgress ? 'Exportation...' : 'Exporter les données'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rapports automatiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Rapport hebdomadaire</h3>
                  <p className="text-sm text-gray-500">Lundi à 07:00</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Rapport mensuel</h3>
                  <p className="text-sm text-gray-500">1er du mois à 07:00</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => {
              toast.success("Nouveau rapport automatique créé");
            }}>
              + Ajouter un rapport automatique
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
