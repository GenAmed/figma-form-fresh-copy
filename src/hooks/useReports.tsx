
import { useFilters } from "./reports/useFilters";
import { useExports } from "./reports/useExports";
import { useAlerts } from "./reports/useAlerts";
import { useCustomReports } from "./reports/useCustomReports";

// Hook principal pour gérer les rapports et exports
export const useReports = () => {
  const {
    dateRange,
    setDateRange,
    selectedChantiers,
    selectedEmployes,
    toggleChantierSelection,
    toggleEmployeSelection,
    showFilters,
    setShowFilters
  } = useFilters();

  const {
    exportFormat,
    setExportFormat,
    exportInProgress,
    handleExport: exportHandler,
    handlePrintReport: printHandler
  } = useExports();

  const {
    alertStatuses,
    showAllAlerts,
    setShowAllAlerts,
    handleAlertStatusChange
  } = useAlerts();

  const {
    customReportName,
    setCustomReportName,
    savedReports,
    handleSaveReport: saveReportHandler,
    handleDeleteReport
  } = useCustomReports();

  // Handler for export that passes the required filters
  const handleExport = async () => {
    return exportHandler(dateRange, selectedChantiers, selectedEmployes);
  };

  // Handler for print that passes the required filters
  const handlePrintReport = () => {
    return printHandler(dateRange, selectedChantiers, selectedEmployes);
  };

  // Handler for saving reports that passes the required filters
  const handleSaveReport = () => {
    return saveReportHandler(dateRange, selectedChantiers, selectedEmployes);
  };

  return {
    // Filter state and handlers
    dateRange,
    setDateRange,
    selectedChantiers,
    selectedEmployes,
    toggleChantierSelection,
    toggleEmployeSelection,
    showFilters,
    setShowFilters,
    
    // Export state and handlers
    exportFormat,
    setExportFormat,
    exportInProgress,
    handleExport,
    handlePrintReport,
    
    // Alert state and handlers
    alertStatuses,
    showAllAlerts,
    setShowAllAlerts,
    handleAlertStatusChange,
    
    // Custom report state and handlers
    customReportName,
    setCustomReportName,
    savedReports,
    handleSaveReport,
    handleDeleteReport
  };
};
