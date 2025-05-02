
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { showPointageFeedback } from "@/services/notifications/feedbackService";
import { Clock, Loader } from "lucide-react";
import { hapticFeedback } from "@/services/hapticFeedback";

interface TrackingControlsProps {
  isTracking: boolean;
  onStartTracking: () => void;
  onEndTracking: () => void;
  isLoading?: boolean;
}

export const TrackingControls: React.FC<TrackingControlsProps> = ({
  isTracking,
  onStartTracking,
  onEndTracking,
  isLoading = false,
}) => {
  // Fonction pour déclencher le retour haptique approprié
  const handleButtonClick = (action: "start" | "end") => {
    // Vibration du téléphone
    if (action === "start") {
      hapticFeedback.success();
      onStartTracking();
      showPointageFeedback("start", true);
    } else {
      hapticFeedback.warning();
      onEndTracking();
      showPointageFeedback("end", true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {isTracking ? (
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-14 text-lg flex items-center justify-center gap-3 font-medium"
          onClick={() => handleButtonClick("end")}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
          Terminer le travail
        </Button>
      ) : (
        <Button
          variant="default"
          size="lg"
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 flex items-center justify-center gap-3 font-medium"
          onClick={() => handleButtonClick("start")}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
          Commencer le travail
        </Button>
      )}
      
      <p className="text-sm text-gray-500 text-center">
        {isTracking 
          ? "Votre temps de travail est actuellement enregistré" 
          : "Cliquez pour commencer à enregistrer votre temps de travail"}
      </p>
    </div>
  );
};
