
import React, { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Clock, Play, Square, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

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

  // Fonction pour obtenir la géolocalisation
  const getLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("La géolocalisation n'est pas supportée par votre navigateur"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage = "Erreur de géolocalisation inconnue";
          
          switch (error.code) {
            case 1:
              errorMessage = "Permission de géolocalisation refusée";
              break;
            case 2:
              errorMessage = "Position indisponible";
              break;
            case 3:
              errorMessage = "Délai d'attente dépassé";
              break;
          }
          
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  // Fonction pour convertir les coordonnées en adresse
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'adresse");
      }
      
      const data = await response.json();
      
      // Formatage de l'adresse
      if (data && data.display_name) {
        // On peut aussi créer un format plus court avec des éléments spécifiques
        // par exemple: route, house_number, village/town/city, postcode
        return data.display_name;
      } else {
        return "Adresse non disponible";
      }
    } catch (error) {
      console.error("Erreur de géocodage inverse:", error);
      return "Erreur lors de la récupération de l'adresse";
    }
  };

  const handleStartTracking = async () => {
    if (!selectedWorksite) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Récupération de la position
      const position = await getLocation();
      
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
      const position = await getLocation();
      
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
        <section className="mt-6">
          <label className="block text-[#333333] text-sm mb-2">
            Sélectionnez un chantier
          </label>
          <div className="relative">
            <select 
              className="w-full p-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#BD1E28]"
              value={selectedWorksite}
              onChange={handleWorksiteChange}
              disabled={isTracking}
            >
              <option value="">Choisir un chantier</option>
              <option value="1">Chantier Paris-Nord</option>
              <option value="2">Chantier Marseille-Port</option>
              <option value="3">Chantier Lyon-Est</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </section>

        {/* Location Status */}
        {locationData && (
          <section className="mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-700">Position enregistrée</h4>
                  <p className="text-xs text-blue-600">
                    Lat: {locationData.latitude.toFixed(5)}, Long: {locationData.longitude.toFixed(5)}
                  </p>
                  <p className="text-xs text-blue-600">
                    Précision: ~{Math.round(locationData.accuracy)}m
                  </p>
                  {isAddressLoading ? (
                    <p className="text-xs text-blue-600 italic">Récupération de l'adresse en cours...</p>
                  ) : locationData.address ? (
                    <p className="text-xs text-blue-600">
                      Adresse: {locationData.address}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Location Error */}
        {locationError && (
          <section className="mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-red-700">Problème de localisation</h4>
                  <p className="text-xs text-red-600">{locationError}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Time Tracking Status */}
        <section className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {!isTracking ? (
              // No Active Time Tracking
              <div className="text-center">
                <div className="text-[#666666] mb-4">Aucun pointage en cours</div>
                <Button 
                  onClick={handleStartTracking}
                  className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium"
                  disabled={isLoading || !selectedWorksite}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Localisation...
                    </span>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Commencer la journée
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // Active Time Tracking
              <div className="text-center">
                <div className="text-[#666666] mb-2">Pointage en cours</div>
                <div className="text-[#333333] font-bold mb-4">Début: {startTime}</div>
                <Button 
                  onClick={handleEndTracking}
                  className="w-full bg-[#BD1E28] text-white py-3 rounded-md hover:bg-[#a01820] transition-colors duration-200 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Localisation...
                    </span>
                  ) : (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Terminer la journée
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="pointage" />
    </div>
  );
};
