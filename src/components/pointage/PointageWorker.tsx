
import React, { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Header } from "@/components/navigation/Header";
import { User } from "@/lib/auth";
import { Clock, Play, Stop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PointageWorkerProps {
  user: User;
}

export const PointageWorker: React.FC<PointageWorkerProps> = ({ user }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const currentDate = format(new Date(), "dd/MM/yyyy");

  const handleStartTracking = () => {
    const now = new Date();
    setStartTime(format(now, "HH:mm"));
    setIsTracking(true);
    // Ici, on pourrait appeler une API pour enregistrer le début du pointage
  };

  const handleEndTracking = () => {
    setIsTracking(false);
    // Ici, on pourrait appeler une API pour enregistrer la fin du pointage
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
            <select className="w-full p-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#BD1E28]">
              <option value="">Choisir un chantier</option>
              <option value="1">Chantier Paris-Nord</option>
              <option value="2">Chantier Marseille-Port</option>
              <option value="3">Chantier Lyon-Est</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </section>

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
                >
                  <Play className="h-4 w-4 mr-2" />
                  Commencer la journée
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
                >
                  <Stop className="h-4 w-4 mr-2" />
                  Terminer la journée
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
