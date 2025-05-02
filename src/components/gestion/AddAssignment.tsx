
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";

type Worksite = {
  id: string;
  name: string;
};

export const AddAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();
  
  // Sample worksites data
  const worksites: Worksite[] = [
    { id: "1", name: "Chantier Saint-Michel" },
    { id: "2", name: "Chantier Belleville" },
    { id: "3", name: "Chantier République" }
  ];

  const [selectedWorksite, setSelectedWorksite] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
    if (!selectedWorksite) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }

    if (!startDate) {
      toast.error("Veuillez sélectionner une date de début");
      return;
    }

    if (!endDate) {
      toast.error("Veuillez sélectionner une date de fin");
      return;
    }

    if (startDate > endDate) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    // Success - would normally send to API
    const worksite = worksites.find(site => site.id === selectedWorksite);
    toast.success(`Assignment created successfully for ${worksite?.name}`);
    navigate(`/gestion/users/details/${userId}`);
  };

  const handleCancel = () => {
    navigate(`/gestion/users/details/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-3 p-0 hover:bg-transparent text-white"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Nouvelle assignation</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Label className="block text-[#333333] font-bold mb-2">
              Sélectionnez un chantier
            </Label>
            <Select value={selectedWorksite} onValueChange={setSelectedWorksite}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un chantier" />
              </SelectTrigger>
              <SelectContent>
                {worksites.map((worksite) => (
                  <SelectItem key={worksite.id} value={worksite.id}>
                    {worksite.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <Label className="block text-[#333333] font-bold mb-2">
                  Date de début
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !startDate ? "text-muted-foreground" : ""
                      }`}
                    >
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <Label className="block text-[#333333] font-bold mb-2">
                  Date de fin
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !endDate ? "text-muted-foreground" : ""
                      }`}
                    >
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        
          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
            <div className="flex justify-between gap-4">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-[#BD1E28] hover:bg-[#A01822] text-white"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
