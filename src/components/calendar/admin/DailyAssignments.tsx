
import React from "react";
import { Card } from "@/components/ui/card";
import { CalendarClock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Assignment } from "../types";

interface DailyAssignmentsProps {
  selectedDate: Date;
  selectedDateAssignments: Assignment[];
  handleAddAssignment: () => void;
}

export const DailyAssignments: React.FC<DailyAssignmentsProps> = ({
  selectedDate,
  selectedDateAssignments,
  handleAddAssignment
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-[#333333] mb-4 flex items-center">
        <CalendarClock className="mr-2 h-5 w-5" />
        Assignations du {format(selectedDate, "dd/MM/yyyy")}
      </h2>
      <div className="space-y-4">
        {selectedDateAssignments.map(assignment => (
          <Card key={assignment.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#333333]">{assignment.worker}</h3>
                <p className="text-sm text-[#666666]">{assignment.site}</p>
              </div>
              <Badge className={`${
                assignment.status === "confirmed" 
                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }`}>
                {assignment.status === "confirmed" ? "Confirmé" : "En attente"}
              </Badge>
            </div>
          </Card>
        ))}

        {selectedDateAssignments.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <CalendarClock className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Aucune assignation pour cette date</p>
            <button 
              className="mt-3 text-[#BD1E28] flex items-center justify-center mx-auto text-sm"
              onClick={handleAddAssignment}
            >
              <Plus size={16} className="mr-1" />
              Ajouter une assignation
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
