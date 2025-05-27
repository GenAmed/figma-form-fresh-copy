
import React from "react";
import { Building, ChevronRight, Clock, Users, FileText } from "lucide-react";

interface AdminActionsProps {
  onUsersClick: () => void;
  onWorksitesClick: () => void;
  onReportsClick: () => void;
  onCalendarClick: () => void;
}

export const AdminActions: React.FC<AdminActionsProps> = ({
  onUsersClick,
  onWorksitesClick,
  onReportsClick,
  onCalendarClick
}) => {
  return (
    <section id="admin-actions" className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-bold text-[#333333] mb-4">Administration</h2>
      <div className="space-y-3">
        <button 
          onClick={onUsersClick}
          className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-3" />
            Gérer les utilisateurs
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
        <button 
          onClick={onWorksitesClick}
          className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center">
            <Building className="w-5 h-5 mr-3" />
            Gérer les chantiers
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
        <button 
          onClick={onReportsClick}
          className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center">
            <FileText className="w-5 h-5 mr-3" />
            Rapports & Analyses
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
        <button 
          onClick={onCalendarClick}
          className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center">
            <Clock className="w-5 h-5 mr-3" />
            Calendrier & Assignations
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
