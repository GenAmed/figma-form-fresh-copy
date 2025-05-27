
import React, { useState, useMemo } from "react";
import { Search, ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Worksite {
  id: string;
  name: string;
  address?: string;
  status?: string;
}

interface WorksiteSearchSelectorProps {
  selectedWorksite: string;
  onChange: (worksiteId: string) => void;
  disabled: boolean;
}

// Mock data - sera remplacé par les vraies données plus tard
const mockWorksites: Worksite[] = [
  { id: "1", name: "Chantier Paris-Nord", address: "75018 Paris", status: "active" },
  { id: "2", name: "Chantier Marseille-Port", address: "13002 Marseille", status: "active" },
  { id: "3", name: "Chantier Lyon-Est", address: "69003 Lyon", status: "active" },
  { id: "4", name: "Chantier Bordeaux Centre", address: "33000 Bordeaux", status: "active" },
  { id: "5", name: "Chantier Toulouse Sud", address: "31000 Toulouse", status: "active" },
  { id: "6", name: "Chantier Nice Promenade", address: "06000 Nice", status: "active" },
  { id: "7", name: "Chantier Nantes Atlantique", address: "44000 Nantes", status: "active" },
  { id: "8", name: "Chantier Strasbourg Centre", address: "67000 Strasbourg", status: "active" },
];

export const WorksiteSearchSelector: React.FC<WorksiteSearchSelectorProps> = ({ 
  selectedWorksite, 
  onChange, 
  disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedWorksiteData = mockWorksites.find(ws => ws.id === selectedWorksite);

  // Filtrer les chantiers selon la recherche
  const filteredWorksites = useMemo(() => {
    if (!searchTerm.trim()) return mockWorksites;
    
    const term = searchTerm.toLowerCase();
    return mockWorksites.filter(worksite => 
      worksite.name.toLowerCase().includes(term) ||
      worksite.address?.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelect = (worksiteId: string) => {
    onChange(worksiteId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <section className="mt-6">
      <label className="block text-[#333333] text-sm mb-2">
        Sélectionnez un chantier
      </label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between p-3 h-auto text-left bg-white border border-gray-300 hover:bg-gray-50"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                {selectedWorksiteData ? (
                  <div>
                    <div className="font-medium text-[#333333]">
                      {selectedWorksiteData.name}
                    </div>
                    {selectedWorksiteData.address && (
                      <div className="text-sm text-gray-500">
                        {selectedWorksiteData.address}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Choisir un chantier</span>
                )}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un chantier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredWorksites.length > 0 ? (
              filteredWorksites.map((worksite) => (
                <button
                  key={worksite.id}
                  onClick={() => handleSelect(worksite.id)}
                  className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selectedWorksite === worksite.id ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <div className="font-medium text-[#333333]">
                    {worksite.name}
                  </div>
                  {worksite.address && (
                    <div className="text-sm text-gray-500 mt-1">
                      {worksite.address}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                Aucun chantier trouvé
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </section>
  );
};
