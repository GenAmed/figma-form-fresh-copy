
import React, { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarWorkerProps {
  user: User;
}

type Assignment = {
  id: string;
  site: string;
  address: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending";
};

export const CalendarWorker: React.FC<CalendarWorkerProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Sample assignments data
  const assignments: Assignment[] = [
    {
      id: "1",
      site: "Chantier Bordeaux Centre",
      address: "123 Rue de la Paix, 33000 Bordeaux",
      startTime: "08:00",
      endTime: "17:00",
      status: "confirmed"
    },
    {
      id: "2",
      site: "Chantier Mérignac",
      address: "45 Avenue de l'Aéroport, 33700 Mérignac",
      startTime: "14:00",
      endTime: "18:00",
      status: "pending"
    }
  ];

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header with title */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between fixed top-0 w-full z-50">
        <div className="flex items-center">
          <h1 className="text-[#333333] text-lg font-bold">Calendrier</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 mb-16 px-4 pb-4">
        {/* Calendar Widget */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePreviousMonth} className="p-2">
              <ChevronLeft className="text-[#666666]" />
            </button>
            <h2 className="text-[#333333] font-bold">
              {format(currentDate, "MMMM yyyy", { locale: fr })}
            </h2>
            <button onClick={handleNextMonth} className="p-2">
              <ChevronRight className="text-[#666666]" />
            </button>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            month={currentDate}
            showOutsideDays={true}
          />
        </div>

        {/* Assignments Section */}
        <section>
          <h3 className="text-[#333333] font-bold mb-4">
            Assignations du {format(selectedDate, "dd/MM/yyyy")}
          </h3>
          
          {assignments.map(assignment => (
            <Card key={assignment.id} className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-[#333333] font-bold">{assignment.site}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  assignment.status === "confirmed" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {assignment.status === "confirmed" ? "Confirmé" : "En attente"}
                </span>
              </div>
              <div className="flex items-center text-[#666666] mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <p className="text-sm">{assignment.address}</p>
              </div>
              <div className="flex items-center text-[#666666]">
                <Clock className="w-4 h-4 mr-2" />
                <p className="text-sm">{assignment.startTime} - {assignment.endTime}</p>
              </div>
            </Card>
          ))}

          {/* Show a message if no assignments for the selected day */}
          {assignments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune assignation pour cette date
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendrier" />
    </div>
  );
};
