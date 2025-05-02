
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Building, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Worker, Assignment } from "../types";

interface WorkerStatsProps {
  workerStats: Worker[];
  assignments: Assignment[];
  handleAddAssignment: () => void;
}

export const WorkerStats: React.FC<WorkerStatsProps> = ({ 
  workerStats, 
  assignments, 
  handleAddAssignment 
}) => {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-white p-3">
          <div className="flex flex-col items-center">
            <div className="bg-blue-50 p-2 rounded-full mb-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">Ouvriers assignés</p>
            <p className="text-xl font-bold">{workerStats.length}</p>
          </div>
        </Card>
        <Card className="bg-white p-3">
          <div className="flex flex-col items-center">
            <div className="bg-green-50 p-2 rounded-full mb-2">
              <Building className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">Chantiers actifs</p>
            <p className="text-xl font-bold">
              {new Set(assignments.map(a => a.site)).size}
            </p>
          </div>
        </Card>
      </div>
      
      <Card className="bg-white mb-4">
        <div className="p-3 border-b">
          <h3 className="font-medium flex items-center">
            <CalendarClock className="mr-2 h-4 w-4 text-[#BD1E28]" />
            <span>Assignations à venir ({assignments.length})</span>
          </h3>
        </div>
        <div className="p-1">
          {assignments.slice(0, 3).map((assignment) => (
            <div key={assignment.id} className="border-b last:border-0 p-2">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {format(assignment.date, "dd")}
                </div>
                <div>
                  <p className="text-sm font-medium">{assignment.worker}</p>
                  <p className="text-xs text-gray-500">{assignment.site}</p>
                </div>
                <Badge className={`ml-auto ${
                  assignment.status === "confirmed" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }`}>
                  {assignment.status === "confirmed" ? "Confirmé" : "En attente"}
                </Badge>
              </div>
            </div>
          ))}
          {assignments.length > 3 && (
            <div className="text-center py-2">
              <p className="text-sm text-[#BD1E28]">+{assignments.length - 3} autres</p>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};
