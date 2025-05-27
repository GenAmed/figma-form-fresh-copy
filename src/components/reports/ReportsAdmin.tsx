
import React from "react";
import { User } from "@/lib/auth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { useReports } from "@/hooks/useReports";
import { useReportsData } from "@/hooks/useReportsData";
import { useAlertsData } from "@/hooks/useAlertsData";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsTabs } from "./ReportsTabs";
import { FiltersPanel } from "./filters/FiltersPanel";

interface ReportsAdminProps {
  user: User;
}

export const ReportsAdmin: React.FC<ReportsAdminProps> = ({ user }) => {
  const {
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
  } = useReports();

  // Utiliser les hooks pour récupérer les données réelles
  const { data: reportsData, loading: reportsLoading } = useReportsData(dateRange);
  const { alerts, setAlerts, loading: alertsLoading } = useAlertsData();

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-20">
      <ReportsHeader 
        dateRange={dateRange}
        selectedChantiers={selectedChantiers}
        selectedEmployes={selectedEmployes}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
        handleExport={handleExport}
        exportInProgress={exportInProgress}
      />

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
        <ReportsTabs 
          data={reportsData}
          loading={reportsLoading}
          alerts={alerts}
          alertsLoading={alertsLoading}
          showAllAlerts={showAllAlerts}
          setShowAllAlerts={setShowAllAlerts}
          alertStatuses={alertStatuses}
          handleAlertStatusChange={handleAlertStatusChange}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          exportInProgress={exportInProgress}
          handleExport={handleExport}
          handlePrintReport={handlePrintReport}
          customReportName={customReportName}
          setCustomReportName={setCustomReportName}
          savedReports={savedReports}
          handleSaveReport={handleSaveReport}
          handleDeleteReport={handleDeleteReport}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
