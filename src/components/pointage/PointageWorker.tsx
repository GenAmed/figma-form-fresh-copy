
import React, { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { format } from "date-fns";
import { toast } from "sonner";
import { WorksiteSelector } from "./WorksiteSelector";
import { LocationDisplay } from "./LocationDisplay";
import { TrackingControls } from "./TrackingControls";
import { getCurrentLocation, getAddressFromCoordinates } from "@/services/locationService";

interface PointageWorkerProps {
  user: User;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

export const PointageWorker: React.FC<PointageWorkerProps> = ({ user }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const [selectedWorksite, setSelectedWorksite] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const currentDate = format(new Date(), "dd/MM/yyyy");

  const handleStartTracking = async () => {
    if (!selectedWorksite) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Récupération de la position
      const position = await getCurrentLocation();
      
      // Démarrage du pointage avant de récupérer l'adresse
      const now = new Date();
      setStartTime(format(now, "HH:mm"));
      setIsTracking(true);
      setLocationData(position);
      
      toast.success("Pointage démarré avec succès", {
        description: `Position enregistrée: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`,
      });
      
      // On récupère l'adresse en arrière-plan sans bloquer l'interface
      setIsAddressLoading(true);
      
      try {
        const address = await getAddressFromCoordinates(position.latitude, position.longitude);
        setLocationData(prev => prev ? {...prev, address} : null);
      } catch (addressError) {
        console.error("Erreur lors de la récupération de l'adresse", addressError);
      } finally {
        setIsAddressLoading(false);
      }
      
      // Ici, on pourrait appeler une API pour enregistrer le début du pointage avec les coordonnées
      console.log("Début de pointage:", {
        userId: user.id,
        worksiteId: selectedWorksite,
        startTime: format(now, "HH:mm:ss"),
        location: position
      });
      
    } catch (error) {
      if (error instanceof Error) {
        setLocationError(error.message);
        toast.error("Erreur de géolocalisation", {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndTracking = async () => {
    setIsLoading(true);
    
    try {
      // Récupération de la position de fin
      const position = await getCurrentLocation();
      
      // Enregistrement de la position et fin du pointage
      setLocationData(position);
      setIsTracking(false);
      
      toast.success("Pointage terminé avec succès", {
        description: `Position enregistrée: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`,
      });
      
      // On récupère l'adresse en arrière-plan
      setIsAddressLoading(true);
      
      try {
        const address = await getAddressFromCoordinates(position.latitude, position.longitude);
        setLocationData(prev => prev ? {...prev, address} : null);
      } catch (addressError) {
        console.error("Erreur lors de la récupération de l'adresse", addressError);
      } finally {
        setIsAddressLoading(false);
      }
      
      // Ici, on pourrait appeler une API pour enregistrer la fin du pointage avec les coordonnées
      console.log("Fin de pointage:", {
        userId: user.id,
        worksiteId: selectedWorksite,
        endTime: format(new Date(), "HH:mm:ss"),
        location: position
      });
      
    } catch (error) {
      if (error instanceof Error) {
        setLocationError(error.message);
        toast.error("Erreur de géolocalisation", {
          description: error.message,
        });
      }
      // Même en cas d'erreur, on termine le pointage
      setIsTracking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorksiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorksite(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header with title */}
      <header className="bg-gray-800 text-white px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Pointage de la journée</h1>
          <div className="text-sm">{currentDate}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-16 pb-20">
        {/* Worksite Selection */}
        <WorksiteSelector 
          selectedWorksite={selectedWorksite} 
          onChange={handleWorksiteChange} 
          disabled={isTracking} 
        />

        {/* Location Status and Error Display */}
        <LocationDisplay 
          locationData={locationData} 
          locationError={locationError} 
          isAddressLoading={isAddressLoading} 
        />

        {/* Time Tracking Controls */}
        <TrackingControls 
          isTracking={isTracking}
          startTime={startTime}
          isLoading={isLoading}
          hasSelectedWorksite={!!selectedWorksite}
          onStartTracking={handleStartTracking}
          onEndTracking={handleEndTracking}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="pointage" />
    </div>
  );
};
