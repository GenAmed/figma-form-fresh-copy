
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { showPointageFeedback } from "@/services/notifications/feedbackService";
import { Clock, Loader, Play, Square, MessageSquare } from "lucide-react";
import { hapticFeedback } from "@/services/hapticFeedback";
import { CommentDialog } from "./CommentDialog";

interface TrackingControlsProps {
  isTracking: boolean;
  onStartTracking: (comment?: string) => void;
  onEndTracking: (comment?: string) => void;
  isLoading?: boolean;
  startTime?: string;
  hasSelectedWorksite?: boolean;
  isOffline?: boolean;
  pendingSyncCount?: number;
  onSyncRequest?: () => void;
}

export const TrackingControls: React.FC<TrackingControlsProps> = ({
  isTracking,
  onStartTracking,
  onEndTracking,
  isLoading = false,
  startTime,
  hasSelectedWorksite = true,
  isOffline = false,
  pendingSyncCount = 0,
  onSyncRequest,
}) => {
  // Fonction pour déclencher le retour haptique approprié
  const handleStartTracking = (comment?: string) => {
    hapticFeedback.success();
    onStartTracking(comment);
    showPointageFeedback("start", true);
  };

  const handleEndTracking = (comment?: string) => {
    hapticFeedback.warning();
    onEndTracking(comment);
    showPointageFeedback("end", true);
  };

  const handleQuickStart = () => {
    handleStartTracking();
  };

  const handleQuickEnd = () => {
    handleEndTracking();
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {isTracking ? (
        <div className="w-full space-y-3">
          {/* Bouton principal de fin */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-14 text-lg flex items-center justify-center gap-3 font-medium"
            onClick={handleQuickEnd}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Square className="h-5 w-5" />
            )}
            Terminer le travail
          </Button>

          {/* Bouton avec commentaire */}
          <CommentDialog
            trigger={
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={isLoading}
              >
                <MessageSquare className="h-4 w-4" />
                Terminer avec commentaire
              </Button>
            }
            title="Terminer le travail"
            description="Ajoutez un commentaire pour expliquer votre fin de journée (départ anticipé, problème, etc.)"
            placeholder="Ex: Parti plus tôt pour rendez-vous médical, problème sur le chantier..."
            onConfirm={handleEndTracking}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="w-full space-y-3">
          {/* Bouton principal de début */}
          <Button
            variant="default"
            size="lg"
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 flex items-center justify-center gap-3 font-medium"
            onClick={handleQuickStart}
            disabled={isLoading || !hasSelectedWorksite}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            Commencer le travail
          </Button>

          {/* Bouton avec commentaire */}
          {hasSelectedWorksite && (
            <CommentDialog
              trigger={
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  disabled={isLoading}
                >
                  <MessageSquare className="h-4 w-4" />
                  Commencer avec commentaire
                </Button>
              }
              title="Commencer le travail"
              description="Ajoutez un commentaire pour expliquer votre arrivée (retard, situation particulière, etc.)"
              placeholder="Ex: Arrivé en retard à cause des transports, commencé plus tôt que prévu..."
              onConfirm={handleStartTracking}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
      
      <p className="text-sm text-gray-500 text-center">
        {isTracking 
          ? `Votre temps de travail est actuellement enregistré${startTime ? ` depuis ${startTime}` : ""}`
          : hasSelectedWorksite 
            ? "Cliquez pour commencer à enregistrer votre temps de travail" 
            : "Veuillez sélectionner un chantier pour commencer"}
      </p>
      
      {isOffline && pendingSyncCount > 0 && onSyncRequest && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md w-full">
          <p className="text-sm text-amber-700 mb-2">
            {pendingSyncCount} pointage{pendingSyncCount > 1 ? "s" : ""} en attente de synchronisation
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSyncRequest}
            disabled={isOffline}
            className="w-full"
          >
            Synchroniser maintenant
          </Button>
        </div>
      )}
    </div>
  );
};
