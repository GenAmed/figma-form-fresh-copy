
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Assignment } from "../types";

interface WorkerAssignmentsProps {
  selectedDate: Date;
  selectedDateAssignments: Assignment[];
}

export const WorkerAssignments: React.FC<WorkerAssignmentsProps> = ({
  selectedDate,
  selectedDateAssignments
}) => {
  return (
    <section>
      <h3 className="text-[#333333] font-bold mb-4 flex items-center">
        <Clock className="mr-2 h-5 w-5" />
        Assignations du {format(selectedDate, "dd/MM/yyyy")}
      </h3>
      
      {selectedDateAssignments.map(assignment => (
        <Card key={assignment.id} className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-[#333333] font-bold">{assignment.site}</h4>
            <Badge className={`${
              assignment.status === "confirmed" 
                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            }`}>
              {assignment.status === "confirmed" ? "Confirmé" : "En attente"}
            </Badge>
          </div>
          <div className="flex items-center text-[#666666] mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <p className="text-sm">123 Rue de la Paix, 33000 Bordeaux</p>
          </div>
          <div className="flex items-center text-[#666666]">
            <Clock className="w-4 h-4 mr-2" />
            <p className="text-sm">08:00 - 17:00</p>
          </div>
        </Card>
      ))}

      {/* Show a message if no assignments for the selected day */}
      {selectedDateAssignments.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <CalendarClock className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Aucune assignation pour cette date</p>
        </div>
      )}
    </section>
  );
};
