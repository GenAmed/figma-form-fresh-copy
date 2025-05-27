
import React from "react";
import { Card } from "@/components/ui/card";
import { HomeStats } from "@/hooks/useHomeStats";

interface QuickStatsProps {
  stats: HomeStats;
  loading: boolean;
  onEmployeesClick: () => void;
  onWorksitesClick: () => void;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  stats,
  loading,
  onEmployeesClick,
  onWorksitesClick
}) => {
  return (
    <section id="quick-stats" className="grid grid-cols-2 gap-4 mb-6">
      <Card 
        className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onEmployeesClick}
      >
        <p className="text-sm text-[#666666]">Employés Actifs</p>
        <p className="text-2xl font-bold text-[#333333]">
          {loading ? "..." : stats.employesActifs}
        </p>
      </Card>
      <Card 
        className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onWorksitesClick}
      >
        <p className="text-sm text-[#666666]">Chantiers Actifs</p>
        <p className="text-2xl font-bold text-[#333333]">
          {loading ? "..." : stats.chantiersActifs}
        </p>
      </Card>
    </section>
  );
};
