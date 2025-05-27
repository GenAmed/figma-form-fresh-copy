
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTab } from "./dashboard/DashboardTab";
import { AlertsTab } from "./alerts/AlertsTab";
import { ExportTab } from "./export/ExportTab";
import { ReportData } from "@/hooks/useReportsData";
import { Alert } from "@/hooks/useAlertsData";
import { ExportFormat } from "@/services/export/types";

interface SavedReport {
  id: string;
  name: string;
  filters: any;
}

interface ReportsTabsProps {
  data: ReportData;
  loading: boolean;
  alerts: Alert[];
  alertsLoading: boolean;
  showAllAlerts: boolean;
  setShowAllAlerts: (show: boolean) => void;
  alertStatuses: Record<number, string>;
  handleAlertStatusChange: (alertId: number, status: string) => void;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  exportInProgress: boolean;
  handleExport: () => Promise<void>;
  handlePrintReport: () => void;
  customReportName: string;
  setCustomReportName: (name: string) => void;
  savedReports: SavedReport[];
  handleSaveReport: () => void;
  handleDeleteReport: (name: string) => void;
}

export const ReportsTabs: React.FC<ReportsTabsProps> = ({
  data,
  loading,
  alerts,
  alertsLoading,
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
  handleDeleteReport
}) => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="alerts">Alertes</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <DashboardTab data={data} loading={loading} />
      </TabsContent>

      <TabsContent value="alerts" className="space-y-4">
        <AlertsTab 
          alerts={alerts}
          loading={alertsLoading}
          showAllAlerts={showAllAlerts}
          setShowAllAlerts={setShowAllAlerts}
          alertStatuses={alertStatuses}
          handleAlertStatusChange={handleAlertStatusChange}
        />
      </TabsContent>

      <TabsContent value="export" className="space-y-4">
        <ExportTab 
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          exportInProgress={exportInProgress}
          handleExport={handleExport}
          handlePrintReport={handlePrintReport}
        />
      </TabsContent>
    </Tabs>
  );
};
