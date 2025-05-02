
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, MapPin, WifiOff } from "lucide-react";

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
  return (
    <section className="mt-6">
      <Card className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="font-semibold text-[#333333] mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          Localisation
        </h2>

        {isOffline && !locationError && (
          <div className="flex items-start mb-2 text-amber-600">
            <WifiOff className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Mode hors-ligne: localisation précise indisponible. Vos coordonnées seront mises à jour automatiquement lorsque vous serez à nouveau en ligne.
            </p>
          </div>
        )}

        {locationError ? (
          <div className="flex items-start text-red-600">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erreur de géolocalisation</p>
              <p className="text-sm">{locationError}</p>
            </div>
          </div>
        ) : locationData ? (
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs text-[#666666] mb-2">
              <div>
                <span className="block font-medium">Latitude</span>
                <span>{locationData.latitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="block font-medium">Longitude</span>
                <span>{locationData.longitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="block font-medium">Précision</span>
                <span>{locationData.accuracy.toFixed(0)} m</span>
              </div>
            </div>

            {locationData.address ? (
              <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
                <span className="font-medium">Adresse :</span> {locationData.address}
              </div>
            ) : isAddressLoading ? (
              <div className="text-xs text-gray-500 mt-2 italic">
                Récupération de l'adresse en cours...
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-[#666666]">
            La position sera affichée ici au moment du pointage.
          </div>
        )}
      </Card>
    </section>
  );
};
