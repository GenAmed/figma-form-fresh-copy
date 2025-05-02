
import { useState } from "react";
import { toast } from "sonner";
import { subDays } from "date-fns";
import { ExportFormat } from "@/services/export";

export const useReports = (mockChantiers: any[], mockEmployes: any[]) => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [selectedChantiers, setSelectedChantiers] = useState<string[]>([]);
  const [selectedEmployes, setSelectedEmployes] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [exportInProgress, setExportInProgress] = useState<boolean>(false);
  const [alertStatuses, setAlertStatuses] = useState<Record<number, string>>({});
  const [showAllAlerts, setShowAllAlerts] = useState<boolean>(false);
  const [customReportName, setCustomReportName] = useState<string>("");
  const [savedReports, setSavedReports] = useState<{id: string, name: string, filters: any}[]>([
    {id: "1", name: "Rapport mensuel standard", filters: {period: "month"}},
    {id: "2", name: "Heures par chantier", filters: {groupBy: "chantier"}}
  ]);

  const toggleChantierSelection = (chantierId: string) => {
    if (chantierId === "") {
      // Reset all selections
      setSelectedChantiers([]);
      return;
    }
    
    if (selectedChantiers.includes(chantierId)) {
      setSelectedChantiers(selectedChantiers.filter(id => id !== chantierId));
    } else {
      setSelectedChantiers([...selectedChantiers, chantierId]);
    }
  };

  const toggleEmployeSelection = (employeId: string) => {
    if (employeId === "") {
      // Reset all selections
      setSelectedEmployes([]);
      return;
    }
    
    if (selectedEmployes.includes(employeId)) {
      setSelectedEmployes(selectedEmployes.filter(id => id !== employeId));
    } else {
      setSelectedEmployes([...selectedEmployes, employeId]);
    }
  };

  // Generate export data based on current filters
  const generateExportData = () => {
    // Simulation of data for export
    const detailedData = [
      { employé: "Jean Dupont", chantier: "Bordeaux Centre", date: "02/05/2025", entrée: "08:00", sortie: "17:00", total: "9h" },
      { employé: "Marie Martin", chantier: "Mérignac", date: "02/05/2025", entrée: "07:30", sortie: "16:30", total: "9h" },
      { employé: "Pierre Durand", chantier: "Paris", date: "02/05/2025", entrée: "08:30", sortie: "18:00", total: "9.5h" },
      { employé: "Jean Dupont", chantier: "Bordeaux Centre", date: "01/05/2025", entrée: "08:15", sortie: "16:45", total: "8.5h" },
      { employé: "Sophie Lefebvre", chantier: "Lyon", date: "01/05/2025", entrée: "07:45", sortie: "17:15", total: "9.5h" },
    ];

    // Filter by chantier if necessary
    let filteredData = detailedData;
    if (selectedChantiers.length > 0) {
      const chantierNames = mockChantiers
        .filter(c => selectedChantiers.includes(c.id))
        .map(c => c.nom);
      
      filteredData = filteredData.filter(item => chantierNames.includes(item.chantier));
    }

    // Filter by employe if necessary
    if (selectedEmployes.length > 0) {
      const employeNames = mockEmployes
        .filter(e => selectedEmployes.includes(e.id))
        .map(e => e.nom);
      
      filteredData = filteredData.filter(item => employeNames.includes(item.employé));
    }

    return filteredData;
  };

  const handleExport = async () => {
    try {
      setExportInProgress(true);
      toast.info(`Préparation de l'export en ${exportFormat.toUpperCase()}...`);
      
      // Generate export data
      const dataToExport = generateExportData();
      
      // Simulate export success after delay
      setTimeout(() => {
        toast.success(`Exportation en ${exportFormat.toUpperCase()} réussie`);
        setExportInProgress(false);
      }, 1500);
      
    } catch (error) {
      console.error("Erreur d'export:", error);
      toast.error("Une erreur est survenue lors de l'export");
      setExportInProgress(false);
    }
  };

  const handlePrintReport = () => {
    // Print simulation
    toast.success("Préparation de l'impression...");
    setTimeout(() => {
      toast.success("Document prêt à imprimer!");
      window.print();
    }, 1500);
  };

  const handleAlertStatusChange = (alertId: number, status: string) => {
    setAlertStatuses(prev => ({
      ...prev,
      [alertId]: status
    }));
    
    toast.success(`Statut de l'alerte mis à jour : ${status}`);
  };

  const handleSaveReport = () => {
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

  const handleDeleteReport = (reportId: string) => {
    setSavedReports(savedReports.filter(report => report.id !== reportId));
    toast.info("Rapport supprimé");
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
    handleDeleteReport
  };
};
