
import { useState } from "react";
import { toast } from "sonner";
import { mockChantiers, mockEmployes } from "@/components/reports/mock/mockData";
import { ExportFormat } from "@/services/export/types";

export const useReports = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const [selectedChantiers, setSelectedChantiers] = useState<string[]>([]);
  const [selectedEmployes, setSelectedEmployes] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [showFilters, setShowFilters] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);
  const [alertStatuses, setAlertStatuses] = useState<Record<number, string>>({});
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [customReportName, setCustomReportName] = useState("");
  const [savedReports, setSavedReports] = useState<string[]>([]);

  const toggleChantierSelection = (chantierId: string) => {
    setSelectedChantiers(prev => 
      prev.includes(chantierId) 
        ? prev.filter(id => id !== chantierId)
        : [...prev, chantierId]
    );
  };

  const toggleEmployeSelection = (employeId: string) => {
    setSelectedEmployes(prev => 
      prev.includes(employeId) 
        ? prev.filter(id => id !== employeId)
        : [...prev, employeId]
    );
  };

  const handleExport = async (): Promise<void> => {
    setExportInProgress(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Rapport exporté en ${exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error("Erreur lors de l'export");
    } finally {
      setExportInProgress(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
    toast.success("Impression du rapport lancée");
  };

  const handleAlertStatusChange = (alertId: number, status: string) => {
    setAlertStatuses(prev => ({
      ...prev,
      [alertId]: status
    }));
    toast.success(`Alerte marquée comme ${status === "resolved" ? "résolue" : "en cours"}`);
  };

  const handleSaveReport = () => {
    if (customReportName.trim()) {
      setSavedReports(prev => [...prev, customReportName.trim()]);
      setCustomReportName("");
      toast.success("Rapport sauvegardé");
    }
  };

  const handleDeleteReport = (name: string) => {
    setSavedReports(prev => prev.filter(report => report !== name));
    toast.success("Rapport supprimé");
  };

  return {
    dateRange,
    setDateRange,
    selectedChantiers,
    selectedEmployes,
    toggleChantierSelection,
    toggleEmployeSelection,
    exportFormat,
    setExportFormat,
    showFilters,
    setShowFilters,
    exportInProgress,
    alertStatuses,
    showAllAlerts,
    setShowAllAlerts,
    customReportName,
    setCustomReportName,
    savedReports,
    handleExport,
    handlePrintReport,
    handleAlertStatusChange,
    handleSaveReport,
    handleDeleteReport,
    mockChantiers,
    mockEmployes
  };
};
