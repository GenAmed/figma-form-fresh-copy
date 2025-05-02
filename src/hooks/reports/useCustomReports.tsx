
import { useState } from "react";
import { toast } from "sonner";

export const useCustomReports = () => {
  const [customReportName, setCustomReportName] = useState<string>("");
  const [savedReports, setSavedReports] = useState<{id: string, name: string, filters: any}[]>([
    {id: "1", name: "Rapport mensuel standard", filters: {period: "month"}},
    {id: "2", name: "Heures par chantier", filters: {groupBy: "chantier"}}
  ]);

  // Enregistrer un rapport personnalisé
  const handleSaveReport = (dateRange: { from: Date; to: Date }, 
                           selectedChantiers: string[], 
                           selectedEmployes: string[]) => {
    if (!customReportName) {
      toast.error("Veuillez donner un nom à votre rapport");
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      name: customReportName,
      filters: {
        dateRange,
        selectedChantiers,
        selectedEmployes
      }
    };

    setSavedReports([...savedReports, newReport]);
    setCustomReportName("");
    toast.success("Rapport personnalisé enregistré avec succès");
  };

  // Supprimer un rapport enregistré
  const handleDeleteReport = (reportId: string) => {
    setSavedReports(savedReports.filter(report => report.id !== reportId));
    toast.info("Rapport supprimé");
  };

  return {
    customReportName,
    setCustomReportName,
    savedReports,
    handleSaveReport,
    handleDeleteReport
  };
};
