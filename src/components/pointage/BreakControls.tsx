
import React, { useState } from "react";
import { Coffee, Play, Pause as PauseIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BreakControlsProps {
  isTracking: boolean;
  isOnBreak: boolean;
  breakStartTime: string | null;
  onStartBreak: () => void;
  onEndBreak: () => void;
  disabled?: boolean;
}

export const BreakControls: React.FC<BreakControlsProps> = ({
  isTracking,
  isOnBreak,
  breakStartTime,
  onStartBreak,
  onEndBreak,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBreakAction = async () => {
    setIsLoading(true);
    
    try {
      if (isOnBreak) {
        await onEndBreak();
        toast.success("Pause terminée", {
          description: "Reprise du travail enregistrée",
        });
      } else {
        await onStartBreak();
        toast.success("Pause commencée", {
          description: "Profitez bien de votre pause",
        });
      }
    } catch (error) {
      toast.error("Erreur lors de la gestion de la pause");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer la durée de la pause si en cours
  const getBreakDuration = () => {
    if (!isOnBreak || !breakStartTime) return null;
    
    const start = new Date();
    const [hours, minutes] = breakStartTime.split(':').map(Number);
    start.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Ne pas afficher si le pointage n'est pas actif
  if (!isTracking) return null;

  return (
    <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isOnBreak ? 'bg-amber-100' : 'bg-blue-100'}`}>
            <Coffee className={`h-5 w-5 ${isOnBreak ? 'text-amber-600' : 'text-blue-600'}`} />
          </div>
          
          <div>
            <h3 className="font-medium text-[#333333]">
              {isOnBreak ? "Pause en cours" : "Gestion des pauses"}
            </h3>
            
            {isOnBreak && breakStartTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4" />
                <span>Commencée à {breakStartTime}</span>
                {getBreakDuration() && (
                  <span className="font-medium text-amber-600">
                    • {getBreakDuration()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleBreakAction}
          disabled={disabled || isLoading}
          variant={isOnBreak ? "destructive" : "outline"}
          className={`flex items-center gap-2 ${
            isOnBreak 
              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" 
              : "border-blue-500 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isOnBreak ? (
            <Play className="h-4 w-4" />
          ) : (
            <PauseIcon className="h-4 w-4" />
          )}
          
          <span className="text-sm font-medium">
            {isOnBreak ? "Reprendre" : "Pause"}
          </span>
        </Button>
      </div>
    </div>
  );
};
