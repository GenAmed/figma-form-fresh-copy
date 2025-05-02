
import React, { useState } from "react";
import { Play, Square, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface TrackingControlsProps {
  isTracking: boolean;
  startTime: string;
  isLoading: boolean;
  hasSelectedWorksite: boolean;
  isOffline: boolean;
  onStartTracking: (comment?: string) => void;
  onEndTracking: (comment?: string) => void;
  pendingSyncCount: number;
  onSyncRequest: () => void;
}

export const TrackingControls: React.FC<TrackingControlsProps> = ({
  isTracking,
  startTime,
  isLoading,
  hasSelectedWorksite,
  isOffline,
  onStartTracking,
  onEndTracking,
  pendingSyncCount,
  onSyncRequest
}) => {
  const [startComment, setStartComment] = useState("");
  const [endComment, setEndComment] = useState("");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"start" | "end">("start");
  
  const handleOpenStartDialog = () => {
    setDialogMode("start");
    setCommentDialogOpen(true);
  };
  
  const handleOpenEndDialog = () => {
    setDialogMode("end");
    setCommentDialogOpen(true);
  };
  
  const handleCommentSubmit = () => {
    if (dialogMode === "start") {
      onStartTracking(startComment);
      setStartComment("");
    } else {
      onEndTracking(endComment);
      setEndComment("");
    }
    setCommentDialogOpen(false);
  };

  return (
    <section className="mt-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Sync Notification */}
        {pendingSyncCount > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-amber-700 text-sm">
                {pendingSyncCount} pointage{pendingSyncCount > 1 ? "s" : ""} en attente de synchronisation
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSyncRequest}
                disabled={!navigator.onLine}
                className="text-amber-700 border-amber-700"
              >
                Synchroniser
              </Button>
            </div>
          </div>
        )}

        {/* Offline Mode Indicator */}
        {isOffline && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 text-sm">
              Mode hors-ligne actif. Vos pointages seront enregistrés localement et synchronisés lorsque vous serez à nouveau en ligne.
            </p>
          </div>
        )}

        {!isTracking ? (
          // No Active Time Tracking
          <div className="text-center">
            <div className="text-[#666666] mb-4">Aucun pointage en cours</div>

            <div className="space-y-2">
              {/* Bouton principal */}
              <Button 
                onClick={handleOpenStartDialog}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium"
                disabled={isLoading || !hasSelectedWorksite}
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
              
              {/* Bouton direct sans commentaire */}
              <Button 
                onClick={() => onStartTracking()}
                variant="outline"
                className="w-full"
                disabled={isLoading || !hasSelectedWorksite}
              >
                Commencer sans commentaire
              </Button>
            </div>
          </div>
        ) : (
          // Active Time Tracking
          <div className="text-center">
            <div className="text-[#666666] mb-2">Pointage en cours</div>
            <div className="text-[#333333] font-bold mb-4">Début: {startTime}</div>

            <div className="space-y-2">
              {/* Bouton principal */}
              <Button 
                onClick={handleOpenEndDialog}
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
              
              {/* Bouton direct sans commentaire */}
              <Button 
                onClick={() => onEndTracking()}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Terminer sans commentaire
              </Button>
            </div>
          </div>
        )}

        {/* Dialog pour ajouter des commentaires */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "start" ? "Commencer la journée" : "Terminer la journée"}
              </DialogTitle>
              <DialogDescription>
                Vous pouvez ajouter un commentaire à votre pointage (optionnel).
              </DialogDescription>
            </DialogHeader>
            
            <Textarea
              placeholder="Exemple: Intervention sur la canalisation principale"
              value={dialogMode === "start" ? startComment : endComment}
              onChange={(e) => {
                if (dialogMode === "start") {
                  setStartComment(e.target.value);
                } else {
                  setEndComment(e.target.value);
                }
              }}
              className="min-h-[100px]"
            />
            
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setCommentDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleCommentSubmit}
                variant={dialogMode === "start" ? "default" : "destructive"}
              >
                {dialogMode === "start" ? "Commencer" : "Terminer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
