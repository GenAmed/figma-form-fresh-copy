import React, { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, MapPin, CalendarClock } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

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
  date: Date;
};

export const CalendarWorker: React.FC<CalendarWorkerProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Charger les assignations (exemple avec données fictives)
  useEffect(() => {
    // Dans une application réelle, ces données viendraient d'une API
    const fakeAssignments: Assignment[] = [
      {
        id: "1",
        site: "Chantier Bordeaux Centre",
        address: "123 Rue de la Paix, 33000 Bordeaux",
        startTime: "08:00",
        endTime: "17:00",
        status: "confirmed",
        date: new Date(2025, 4, 2) // 2 mai 2025
      },
      {
        id: "2",
        site: "Chantier Mérignac",
        address: "45 Avenue de l'Aéroport, 33700 Mérignac",
        startTime: "14:00",
        endTime: "18:00",
        status: "pending",
        date: new Date(2025, 4, 5) // 5 mai 2025
      },
      {
        id: "3",
        site: "Chantier Pessac",
        address: "12 Avenue Jean Jaurès, 33600 Pessac",
        startTime: "07:30",
        endTime: "16:30",
        status: "confirmed",
        date: new Date(2025, 4, 7) // 7 mai 2025
      },
      {
        id: "4", 
        site: "Chantier Lormont",
        address: "8 Rue des Erables, 33310 Lormont",
        startTime: "09:00", 
        endTime: "18:00",
        status: "confirmed",
        date: new Date(2025, 4, 12) // 12 mai 2025
      },
      {
        id: "5",
        site: "Chantier Bordeaux Centre",
        address: "123 Rue de la Paix, 33000 Bordeaux",
        startTime: "08:00",
        endTime: "17:00", 
        status: "confirmed",
        date: new Date(2025, 4, 15) // 15 mai 2025
      }
    ];
    
    setAssignments(fakeAssignments);
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Filtre les assignations pour la date sélectionnée
  const selectedDateAssignments = assignments.filter(assignment => 
    isSameDay(assignment.date, selectedDate)
  );

  // Fonction pour obtenir les dates qui ont des assignations
  const getAssignmentDates = () => {
    return assignments.map(assignment => assignment.date);
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
        {/* Calendar Widget with Visual Indicators */}
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

          {/* Calendar avec indicateurs visuels */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            month={currentDate}
            showOutsideDays={true}
            modifiers={{
              booked: getAssignmentDates(),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "#F0F9FF",
                color: "#0369A1",
                position: "relative",
              }
            }}
            components={{
              DayContent: (props) => {
                const date = props.date;
                const hasAssignment = assignments.some(assignment => 
                  isSameDay(assignment.date, date)
                );
                
                return (
                  <div className="relative h-full w-full flex items-center justify-center">
                    {props.day}
                    {hasAssignment && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                    )}
                  </div>
                );
              }
            }}
          />
          
          {/* Légende */}
          <div className="mt-2 flex items-center justify-start text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-[#BD1E28] mr-1"></div>
            <span>Chantier prévu</span>
          </div>
        </div>

        {/* Vue d'ensemble des rendez-vous du mois */}
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

        {/* Assignments Section */}
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
                <p className="text-sm">{assignment.address}</p>
              </div>
              <div className="flex items-center text-[#666666]">
                <Clock className="w-4 h-4 mr-2" />
                <p className="text-sm">{assignment.startTime} - {assignment.endTime}</p>
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
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendrier" />
    </div>
  );
};
