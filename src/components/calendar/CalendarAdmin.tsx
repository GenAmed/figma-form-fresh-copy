
import React, { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarAdminProps {
  user: User;
}

type Assignment = {
  id: string;
  worker: string;
  site: string;
  status: "confirmed" | "pending";
};

export const CalendarAdmin: React.FC<CalendarAdminProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Sample assignments data
  const assignments: Assignment[] = [
    {
      id: "1",
      worker: "Jean Dupont",
      site: "Chantier Tour Eiffel",
      status: "confirmed"
    },
    {
      id: "2",
      worker: "Marie Martin",
      site: "Chantier Arc de Triomphe",
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
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Calendrier des assignations</h1>
          <button id="filter-btn" className="p-2">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {/* Calendar Widget */}
        <section className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePreviousMonth} className="text-[#666666]">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-[#333333] font-bold">
                {format(currentDate, "MMMM yyyy", { locale: fr })}
              </h2>
              <button onClick={handleNextMonth} className="text-[#666666]">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              month={currentDate}
              showOutsideDays={true}
            />
          </div>
        </section>

        {/* Assignments Section */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-[#333333] mb-4">
            Assignations du {format(selectedDate, "dd/MM/yyyy")}
          </h2>
          <div className="space-y-4">
            {assignments.map(assignment => (
              <Card key={assignment.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#333333]">{assignment.worker}</h3>
                    <p className="text-sm text-[#666666]">{assignment.site}</p>
                  </div>
                  <span className={`px-3 py-1 ${
                    assignment.status === "confirmed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  } rounded-full text-sm`}>
                    {assignment.status === "confirmed" ? "Confirmé" : "En attente"}
                  </span>
                </div>
              </Card>
            ))}

            {assignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune assignation pour cette date
              </div>
            )}
          </div>
        </section>

        {/* Floating Action Button */}
        <button className="fixed right-4 bottom-20 w-14 h-14 bg-[#BD1E28] rounded-full shadow-lg flex items-center justify-center text-white">
          <Plus size={24} />
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendrier" />
    </div>
  );
};
