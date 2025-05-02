
import React from "react";
import { MapPin, AlertCircle } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface LocationDisplayProps {
  locationData: LocationData | null;
  locationError: string | null;
  isAddressLoading: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  locationData, 
  locationError,
  isAddressLoading 
}) => {
  return (
    <>
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
    </>
  );
};
