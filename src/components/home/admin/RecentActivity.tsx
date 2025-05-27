
import React from "react";
import { Clock } from "lucide-react";
import { RecentActivity as RecentActivityType } from "@/hooks/useRecentActivity";

interface RecentActivityProps {
  activities: RecentActivityType[];
  loading: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading
}) => {
  const getActivityIcon = (action: string) => {
    return action === "entry" ? "text-green-600" : "text-red-600";
  };

  const getActivityBgColor = (action: string) => {
    return action === "entry" ? "bg-green-100" : "bg-red-100";
  };

  return (
    <section id="recent-activity" className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-bold text-[#333333] mb-4">Activité Récente</h2>
      {loading ? (
        <div className="space-y-4">
          <div className="animate-pulse flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="animate-pulse flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-[#666666]">Aucune activité récente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full ${getActivityBgColor(activity.action)} flex items-center justify-center`}>
                <Clock className={`w-4 h-4 ${getActivityIcon(activity.action)}`} />
              </div>
              <div>
                <p className="text-sm text-[#333333]">
                  {activity.user_name} - Pointage {activity.action === "entry" ? "entrée" : "sortie"}
                </p>
                <p className="text-xs text-[#666666]">Chantier: {activity.worksite_name}</p>
                <p className="text-xs text-[#666666]">{activity.time_ago}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
