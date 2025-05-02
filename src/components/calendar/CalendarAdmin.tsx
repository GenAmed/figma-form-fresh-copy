import React, { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  AlertTriangle, 
  Users, 
  CalendarClock, 
  Building
} from "lucide-react";
import { format, addMonths, subMonths, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { checkUnassignedWorkers } from "@/services/assignment/assignmentCheckService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayContentProps } from "react-day-picker";

interface CalendarAdminProps {
  user: User;
}

type Assignment = {
  id: string;
  worker: string;
  site: string;
  status: "confirmed" | "pending";
  date: Date;
};

type Worker = {
  id: string;
  name: string;
  assignedDays: number;
};

export const CalendarAdmin: React.FC<CalendarAdminProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [unassignedWorkers, setUnassignedWorkers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");
  
  // Sample assignments data with dates
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workerStats, setWorkerStats] = useState<Worker[]>([]);

  // Charger les données au démarrage
  useEffect(() => {
    // Dans une implémentation réelle, ces données viendraient d'une API
    const fakeAssignments: Assignment[] = [
      {
        id: "1",
        worker: "Jean Dupont",
        site: "Chantier Tour Eiffel",
        status: "confirmed",
        date: new Date(2025, 4, 2) // 2 mai 2025
      },
      {
        id: "2",
        worker: "Marie Martin",
        site: "Chantier Arc de Triomphe",
        status: "pending",
        date: new Date(2025, 4, 5) // 5 mai 2025
      },
      {
        id: "3",
        worker: "Philippe Legrand",
        site: "Chantier Louvre",
        status: "confirmed",
        date: new Date(2025, 4, 5) // 5 mai 2025
      },
      {
        id: "4",
        worker: "Sophie Petit",
        site: "Chantier Notre Dame",
        status: "confirmed",
        date: new Date(2025, 4, 8) // 8 mai 2025
      },
      {
        id: "5",
        worker: "Jean Dupont",
        site: "Chantier Tour Eiffel",
        status: "confirmed",
        date: new Date(2025, 4, 12) // 12 mai 2025
      },
      {
        id: "6",
        worker: "Marie Martin",
        site: "Chantier Montmartre",
        status: "pending",
        date: new Date(2025, 4, 15) // 15 mai 2025
      },
      {
        id: "7",
        worker: "Philippe Legrand",
        site: "Chantier Bastille",
        status: "confirmed",
        date: new Date(2025, 4, 18) // 18 mai 2025
      }
    ];
    
    setAssignments(fakeAssignments);

    // Créer des statistiques pour les ouvriers
    const fakeWorkerStats: Worker[] = [
      { id: "1", name: "Jean Dupont", assignedDays: 15 },
      { id: "2", name: "Marie Martin", assignedDays: 12 },
      { id: "3", name: "Philippe Legrand", assignedDays: 18 },
      { id: "4", name: "Sophie Petit", assignedDays: 9 }
    ];
    
    setWorkerStats(fakeWorkerStats);

    const unassignedList = checkUnassignedWorkers();
    setUnassignedWorkers(unassignedList);
    
    if (unassignedList.length > 0) {
      const workerNames = unassignedList.map(w => w.name).join(", ");
      toast.warning(`${unassignedList.length} ouvrier(s) non assigné(s)`, {
        description: `Ouvriers sans assignation: ${workerNames}`,
        duration: 5000,
      });
    }
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle "Add Assignment" button click
  const handleAddAssignment = () => {
    // In a real app, this would open a modal or navigate to an assignment form
    toast.info("Ajouter une assignation", {
      description: "Cette fonctionnalité sera bientôt disponible",
    });
  };

  // Filtre les assignations pour la date sélectionnée
  const selectedDateAssignments = assignments.filter(assignment => 
    isSameDay(assignment.date, selectedDate)
  );
  
  // Obtenir les dates qui ont des assignations
  const getAssignmentDates = () => {
    return assignments.map(assignment => assignment.date);
  };

  // Obtenir les jours de la semaine actuelle
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

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
        {/* Tabs for different views */}
        <Tabs defaultValue="daily" className="w-full mb-4" onValueChange={(value) => setActiveTab(value as "daily" | "weekly")}>
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="daily">Vue Journalière</TabsTrigger>
            <TabsTrigger value="weekly">Vue Hebdomadaire</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Unassigned Workers Alert (if any) */}
        {unassignedWorkers.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Attention</p>
              <p className="text-xs text-amber-800">
                {unassignedWorkers.length} ouvrier(s) n'ont pas d'assignation pour la semaine prochaine.
              </p>
            </div>
          </div>
        )}

        {/* Calendar Widget with Visual Indicators */}
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
              components={{
                DayContent: (props: DayContentProps) => {
                  const date = props.date;
                  const dayAssignments = assignments.filter(assignment => 
                    isSameDay(assignment.date, date)
                  );
                  
                  return (
                    <div className="relative h-full w-full flex items-center justify-center">
                      {props.date.getDate()}
                      {dayAssignments.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                          <div className="w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                          {dayAssignments.length > 1 && (
                            <div className="w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                          )}
                          {dayAssignments.length > 2 && (
                            <div className="w-1 h-1 rounded-full bg-[#BD1E28]"></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
            
            {/* Légende */}
            <div className="mt-2 flex items-center justify-start text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-[#BD1E28] mr-1"></div>
              <span>Assignations</span>
            </div>
          </div>
        </section>

        {/* Vue statistique rapide */}
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

        {/* Daily View */}
        {activeTab === "daily" && (
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
        )}

        {/* Weekly View */}
        {activeTab === "weekly" && (
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
        )}

        {/* Floating Action Button */}
        <button 
          className="fixed right-4 bottom-20 w-14 h-14 bg-[#BD1E28] rounded-full shadow-lg flex items-center justify-center text-white"
          onClick={handleAddAssignment}
        >
          <Plus size={24} />
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendrier" />
    </div>
  );
};
