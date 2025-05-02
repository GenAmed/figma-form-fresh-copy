
import { useState } from "react";
import { subDays } from "date-fns";

export const useFilters = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [selectedChantiers, setSelectedChantiers] = useState<string[]>([]);
  const [selectedEmployes, setSelectedEmployes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Toggle pour la sélection des chantiers
  const toggleChantierSelection = (chantierId: string) => {
    if (chantierId === "") {
      // Reset all selections
      setSelectedChantiers([]);
      return;
    }
    
    if (selectedChantiers.includes(chantierId)) {
      setSelectedChantiers(selectedChantiers.filter(id => id !== chantierId));
    } else {
      setSelectedChantiers([...selectedChantiers, chantierId]);
    }
  };

  // Toggle pour la sélection des employés
  const toggleEmployeSelection = (employeId: string) => {
    if (employeId === "") {
      // Reset all selections
      setSelectedEmployes([]);
      return;
    }
    
    if (selectedEmployes.includes(employeId)) {
      setSelectedEmployes(selectedEmployes.filter(id => id !== employeId));
    } else {
      setSelectedEmployes([...selectedEmployes, employeId]);
    }
  };

  return {
    dateRange,
    setDateRange,
    selectedChantiers,
    selectedEmployes,
    toggleChantierSelection,
    toggleEmployeSelection,
    showFilters,
    setShowFilters
  };
};
