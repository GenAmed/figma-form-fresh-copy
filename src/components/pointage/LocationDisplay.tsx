
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, MapPin, WifiOff } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { showLocationFeedback } from "@/services/notificationService";

interface LocationDisplayProps {
  locationData: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  } | null;
  locationError: string | null;
  isAddressLoading: boolean;
  isOffline?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  locationData, 
  locationError, 
  isAddressLoading,
  isOffline = false
}) => {
  // Show feedback when location data changes
  useEffect(() => {
    if (locationData && !locationError) {
      showLocationFeedback(true, locationData.accuracy);
    } else if (locationError) {
      showLocationFeedback(false, undefined, locationError);
    }
  }, [locationData, locationError]);

  return (
    <section className="mt-6">
      <Card className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="font-semibold text-[#333333] mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          Localisation
        </h2>

        {isOffline && !locationError && (
          <Alert variant="warning" className="mb-3 bg-amber-50 text-amber-800 border-amber-200">
            <WifiOff className="h-4 w-4 mr-2" />
            <AlertTitle className="text-sm font-medium">Mode hors-ligne</AlertTitle>
            <AlertDescription className="text-xs">
              Localisation précise indisponible. Vos coordonnées seront mises à jour automatiquement lorsque vous serez à nouveau en ligne.
            </AlertDescription>
          </Alert>
        )}

        {locationError ? (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle className="text-sm font-medium">Erreur de géolocalisation</AlertTitle>
            <AlertDescription className="text-xs">{locationError}</AlertDescription>
          </Alert>
        ) : locationData ? (
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs text-[#666666] mb-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium">Latitude</span>
                      <span>{locationData.latitude.toFixed(6)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Coordonnée nord-sud</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium">Longitude</span>
                      <span>{locationData.longitude.toFixed(6)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Coordonnée est-ouest</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`p-2 rounded ${locationData.accuracy > 50 ? 'bg-amber-50' : 'bg-green-50'}`}>
                      <span className="block font-medium">Précision</span>
                      <span className={locationData.accuracy > 50 ? 'text-amber-600' : 'text-green-600'}>
                        {locationData.accuracy.toFixed(0)} m
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">
                      {locationData.accuracy > 50 
                        ? 'Précision moyenne, restez à l\'extérieur pour l\'améliorer' 
                        : 'Bonne précision de localisation'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {locationData.address ? (
              <div className="text-sm mt-2 p-2 bg-gray-50 rounded border border-gray-100">
                <span className="font-medium">Adresse :</span> {locationData.address}
              </div>
            ) : isAddressLoading ? (
              <div className="text-xs text-gray-500 mt-2 italic flex items-center">
                <div className="animate-spin h-3 w-3 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                Récupération de l'adresse en cours...
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-[#666666] italic">
            La position sera affichée ici au moment du pointage.
          </div>
        )}
      </Card>
    </section>
  );
};
