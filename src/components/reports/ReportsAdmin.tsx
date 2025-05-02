
import React, { useState } from "react";
import { User } from "@/lib/auth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Filter, Download } from "lucide-react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { ExportFormat } from "@/services/export";
import { BackButton } from "@/components/navigation/BackButton";

// Import our mock data
import { 
  mockChantiers, 
  mockEmployes, 
  mockHeuresParChantier, 
  mockHeuresParJour, 
  mockAlerts 
} from "./mock/mockData";

// Import our new components
import { DashboardTab } from "./dashboard/DashboardTab";
import { AlertsTab } from "./alerts/AlertsTab";
import { DetailedTab } from "./detailed/DetailedTab";
import { ExportTab } from "./export/ExportTab";
import { CustomReportsTab } from "./custom/CustomReportsTab";
import { FiltersPanel } from "./filters/FiltersPanel";

interface ReportsAdminProps {
  user: User;
}

export const ReportsAdmin: React.FC<ReportsAdminProps> = ({ user }) => {
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
      
      // Format filename with date range
      const formattedDateRange = `${format(dateRange.from, "yyyyMMdd")}_${format(dateRange.to, "yyyyMMdd")}`;
      const fileName = `pointage_${formattedDateRange}`;
      
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

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-lg font-bold">Rapports & Exports</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtres
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleExport}
              disabled={exportInProgress}
            >
              <FileText className="h-4 w-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <FiltersPanel 
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedChantiers={selectedChantiers}
          toggleChantierSelection={toggleChantierSelection}
          selectedEmployes={selectedEmployes}
          toggleEmployeSelection={toggleEmployeSelection}
          setShowFilters={setShowFilters}
          mockChantiers={mockChantiers}
          mockEmployes={mockEmployes}
        />
      )}

      {/* Main Content */}
      <main className="pt-20 px-4 pb-2">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Période: {format(dateRange.from, "dd MMM yyyy", { locale: fr })} - {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
          </p>
          {selectedChantiers.length > 0 && (
            <p className="text-sm text-gray-600">
              Chantiers filtrés: {selectedChantiers.length}
            </p>
          )}
          {selectedEmployes.length > 0 && (
            <p className="text-sm text-gray-600">
              Employés filtrés: {selectedEmployes.length}
            </p>
          )}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
            <TabsTrigger value="detailed">Détaillé</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="custom">Personnalisé</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <DashboardTab 
              mockHeuresParChantier={mockHeuresParChantier}
              mockHeuresParJour={mockHeuresParJour}
            />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <AlertsTab
              alerts={mockAlerts}
              showAllAlerts={showAllAlerts}
              setShowAllAlerts={setShowAllAlerts}
              alertStatuses={alertStatuses}
              handleAlertStatusChange={handleAlertStatusChange}
            />
          </TabsContent>

          {/* Detailed Tab */}
          <TabsContent value="detailed">
            <DetailedTab />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <ExportTab
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              exportInProgress={exportInProgress}
              handleExport={handleExport}
              handlePrintReport={handlePrintReport}
            />
          </TabsContent>

          {/* Custom Reports Tab */}
          <TabsContent value="custom">
            <CustomReportsTab
              customReportName={customReportName}
              setCustomReportName={setCustomReportName}
              savedReports={savedReports}
              handleSaveReport={handleSaveReport}
              handleDeleteReport={handleDeleteReport}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
