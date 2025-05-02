
import React from "react";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Worker, Assignment } from "../types";

interface WeeklyViewProps {
  weekDays: Date[];
  workerStats: Worker[];
  assignments: Assignment[];
  handleAddAssignment: () => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  weekDays,
  workerStats,
  assignments,
  handleAddAssignment
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-[#333333] mb-4">
        Vue hebdomadaire
      </h2>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="p-2"></div>
            {weekDays.map(day => (
              <div key={day.toString()} className="text-center">
                <div className="font-medium">{format(day, "EEE", { locale: fr })}</div>
                <div className="text-sm">{format(day, "dd/MM")}</div>
              </div>
            ))}
          </div>

          {workerStats.map(worker => {
            return (
              <div key={worker.id} className="grid grid-cols-8 gap-2 mb-2">
                <div className="p-2 bg-white rounded-md text-sm font-medium">
                  {worker.name}
                </div>
                {weekDays.map(day => {
                  const dayAssignments = assignments.filter(a => 
                    a.worker === worker.name && isSameDay(a.date, day)
                  );
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className={`p-2 rounded-md text-sm ${
                        dayAssignments.length > 0 
                          ? 'bg-[#F0F9FF] border border-blue-200' 
                          : 'bg-white border border-gray-100'
                      }`}
                    >
                      {dayAssignments.length > 0 ? (
                        <div>
                          <p className="font-medium text-xs truncate">
                            {dayAssignments[0].site}
                          </p>
                          <Badge className={`mt-1 text-xs ${
                            dayAssignments[0].status === "confirmed" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }`}>
                            {dayAssignments[0].status === "confirmed" ? "C" : "P"}
                          </Badge>
                        </div>
                      ) : (
                        <div 
                          className="h-full w-full flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100"
                          onClick={handleAddAssignment}
                        >
                          <Plus size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
