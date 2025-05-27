
import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, MapPin, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getWorksites, Worksite } from "@/services/worksiteService";
import { toast } from "sonner";

interface WorksiteSearchSelectorProps {
  selectedWorksite: string;
  onChange: (worksiteId: string) => void;
  disabled: boolean;
}

export const WorksiteSearchSelector: React.FC<WorksiteSearchSelectorProps> = ({ 
  selectedWorksite, 
  onChange, 
  disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [worksites, setWorksites] = useState<Worksite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedWorksiteData = worksites.find(ws => ws.id === selectedWorksite);

  // Charger les chantiers au montage du composant
  useEffect(() => {
    const loadWorksites = async () => {
      setIsLoading(true);
      try {
        const data = await getWorksites();
        setWorksites(data);
      } catch (error) {
        console.error('Erreur lors du chargement des chantiers:', error);
        toast.error("Erreur lors du chargement des chantiers");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorksites();
  }, []);

  // Filtrer les chantiers selon la recherche
  const filteredWorksites = useMemo(() => {
    if (!searchTerm.trim()) return worksites;
    
    const term = searchTerm.toLowerCase();
    return worksites.filter(worksite => 
      worksite.name.toLowerCase().includes(term) ||
      worksite.address?.toLowerCase().includes(term)
    );
  }, [searchTerm, worksites]);

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
            disabled={disabled || isLoading}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-gray-500">Chargement...</span>
                  </div>
                ) : selectedWorksiteData ? (
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
            ) : isLoading ? (
              <div className="p-3 text-center text-gray-500">
                <Loader className="h-4 w-4 animate-spin mx-auto mb-2" />
                Chargement des chantiers...
              </div>
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
