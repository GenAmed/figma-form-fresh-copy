
import React from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "./dashboard/DashboardTab";
import { AlertsTab } from "./alerts/AlertsTab";
import { DetailedTab } from "./detailed/DetailedTab";
import { ExportTab } from "./export/ExportTab";
import { CustomReportsTab } from "./custom/CustomReportsTab";

interface ReportsTabsProps {
  mockHeuresParChantier: any[];
  mockHeuresParJour: any[];
  mockAlerts: any[];
  showAllAlerts: boolean;
  setShowAllAlerts: (show: boolean) => void;
  alertStatuses: Record<number, string>;
  handleAlertStatusChange: (alertId: number, status: string) => void;
  exportFormat: string;
  setExportFormat: (format: any) => void;
  exportInProgress: boolean;
  handleExport: () => void;
  handlePrintReport: () => void;
  customReportName: string;
  setCustomReportName: (name: string) => void;
  savedReports: {id: string, name: string, filters: any}[];
  handleSaveReport: () => void;
  handleDeleteReport: (id: string) => void;
}

export const ReportsTabs: React.FC<ReportsTabsProps> = ({
  mockHeuresParChantier,
  mockHeuresParJour,
  mockAlerts,
  showAllAlerts,
  setShowAllAlerts,
  alertStatuses,
  handleAlertStatusChange,
  exportFormat,
  setExportFormat,
  exportInProgress,
  handleExport,
  handlePrintReport,
  customReportName,
  setCustomReportName,
  savedReports,
  handleSaveReport,
  handleDeleteReport,
}) => {
  return (
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
  );
};
