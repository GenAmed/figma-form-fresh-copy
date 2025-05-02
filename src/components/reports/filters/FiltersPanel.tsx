
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { startOfMonth, endOfMonth, subDays } from "date-fns";

interface Chantier {
  id: string;
  nom: string;
}

interface Employe {
  id: string;
  nom: string;
}

interface FiltersPanelProps {
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  selectedChantiers: string[];
  toggleChantierSelection: (chantierId: string) => void;
  selectedEmployes: string[];
  toggleEmployeSelection: (employeId: string) => void;
  setShowFilters: (show: boolean) => void;
  mockChantiers: Chantier[];
  mockEmployes: Employe[];
}

export const FiltersPanel = ({
  dateRange,
  setDateRange,
  selectedChantiers,
  toggleChantierSelection,
  selectedEmployes,
  toggleEmployeSelection,
  setShowFilters,
  mockChantiers,
  mockEmployes
}: FiltersPanelProps) => {
  return (
    <div className="pt-16 pb-4 px-4 bg-white shadow-md mb-4">
      <div className="space-y-4">
        <div>
          <Label>Période</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDateRange({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date())
              })}
            >
              Mois en cours
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDateRange({
                from: subDays(new Date(), 7),
                to: new Date()
              })}
            >
              7 derniers jours
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDateRange({
                from: subDays(new Date(), 30),
                to: new Date()
              })}
            >
              30 derniers jours
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="space-y-2">
              <Label>Date début</Label>
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                className="rounded border bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Date fin</Label>
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                className="rounded border bg-white"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Chantiers</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockChantiers.map(chantier => (
                <Badge 
                  key={chantier.id}
                  variant={selectedChantiers.includes(chantier.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleChantierSelection(chantier.id)}
                >
                  {chantier.nom}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Employés</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockEmployes.map(employe => (
                <Badge 
                  key={employe.id}
                  variant={selectedEmployes.includes(employe.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleEmployeSelection(employe.id)}
                >
                  {employe.nom}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => {
            toggleChantierSelection("");
            toggleEmployeSelection("");
          }}>
            Réinitialiser
          </Button>
          <Button onClick={() => setShowFilters(false)}>
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
};
