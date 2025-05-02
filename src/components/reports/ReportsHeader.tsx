
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BackButton } from "@/components/navigation/BackButton";

interface ReportsHeaderProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  selectedChantiers: string[];
  selectedEmployes: string[];
  setShowFilters: (show: boolean) => void;
  showFilters: boolean;
  handleExport: () => void;
  exportInProgress: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  dateRange,
  selectedChantiers,
  selectedEmployes,
  setShowFilters,
  showFilters,
  handleExport,
  exportInProgress,
}) => {
  return (
    <>
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

      {/* Filter Summary */}
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
    </>
  );
};
