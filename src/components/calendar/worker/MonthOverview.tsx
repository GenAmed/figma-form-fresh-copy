
import React from "react";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Assignment } from "../types";

interface MonthOverviewProps {
  assignments: Assignment[];
}

export const MonthOverview: React.FC<MonthOverviewProps> = ({ assignments }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-[#333333] font-semibold mb-3 flex items-center">
        <CalendarClock className="mr-2 h-5 w-5 text-[#BD1E28]" />
        Aperçu du mois
      </h3>
      
      <div className="space-y-3">
        {assignments.slice(0, 3).map(assignment => (
          <div 
            key={assignment.id}
            className="flex items-center p-2 border-l-4 border-[#BD1E28] bg-gray-50 rounded-r-md"
          >
            <div className="mr-3 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {format(assignment.date, "dd")}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{assignment.site}</p>
              <p className="text-xs text-gray-500">{format(assignment.date, "EEEE d MMMM", { locale: fr })}</p>
            </div>
          </div>
        ))}
        
        {assignments.length > 3 && (
          <p className="text-center text-sm text-[#BD1E28] font-medium">
            +{assignments.length - 3} autres rendez-vous ce mois
          </p>
        )}
      </div>
    </div>
  );
};
