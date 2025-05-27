
import React, { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { format } from "date-fns";
import { toast } from "sonner";
import { WorksiteSearchSelector } from "./WorksiteSearchSelector";
import { LocationDisplay } from "./LocationDisplay";
import { TrackingControls } from "./TrackingControls";
import { BreakControls } from "./BreakControls";
import { getCurrentLocation, getAddressFromCoordinates } from "@/services/locationService";
import { 
  createTimeEntry, 
  updateTimeEntry, 
  getActiveTimeEntry,
  TimeEntry
} from "@/services/timeEntryService";
import { 
  requestNotificationPermission, 
  sendNotification, 
  schedulePointageReminder
} from "@/services/notificationService";
import { Switch } from "@/components/ui/switch";
import { BellRing, Wifi, WifiOff, Settings } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PointageWorkerProps {
  user: User;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface BreakEntry {
  startTime: string;
  endTime?: string;
  duration?: number;
}

export const PointageWorker: React.FC<PointageWorkerProps> = ({ user }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const [selectedWorksite, setSelectedWorksite] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  
  // États pour la gestion des pauses
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>([]);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderSettings, setReminderSettings] = useState({
    morningReminder: true,
    morningReminderTime: "08:00",
    eveningReminder: true,
    eveningReminderTime: "17:00",
  });
  
  const currentDate = format(new Date(), "dd/MM/yyyy");
  
  // Vérifier s'il y a un pointage actif au chargement
  useEffect(() => {
    const checkActiveTracking = async () => {
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const activeEntry = await getActiveTimeEntry(user.id, today);
        
        if (activeEntry) {
          setIsTracking(true);
          setStartTime(activeEntry.start_time);
          setSelectedWorksite(activeEntry.worksite_id);
          setCurrentEntryId(activeEntry.id);
          
          // Restaurer les pauses si elles existent
          if (activeEntry.breaks && activeEntry.breaks.length > 0) {
            setBreakEntries(activeEntry.breaks);
            
            // Vérifier si une pause est en cours
            const lastBreak = activeEntry.breaks[activeEntry.breaks.length - 1];
            if (lastBreak && !lastBreak.endTime) {
              setIsOnBreak(true);
              setBreakStartTime(lastBreak.startTime);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du pointage actif:', error);
      }
    };

    // Configurer les écouteurs de connectivité
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Connexion rétablie");
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("Mode hors-ligne activé");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Demander l'autorisation pour les notifications
    requestNotificationPermission().then(granted => {
      setNotificationsEnabled(granted);
      if (granted) {
        toast.success("Notifications activées");
      }
    });
    
    checkActiveTracking();
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user.id]);
  
  // Gestion des pauses
  const handleStartBreak = async () => {
    if (!isTracking || !currentEntryId) return;
    
    const now = new Date();
    const breakTime = format(now, "HH:mm");
    
    setIsOnBreak(true);
    setBreakStartTime(breakTime);
    
    // Ajouter l'entrée de pause
    const newBreakEntry: BreakEntry = {
      startTime: breakTime
    };
    const updatedBreaks = [...breakEntries, newBreakEntry];
    setBreakEntries(updatedBreaks);

    // Mettre à jour en base de données
    try {
      await updateTimeEntry(currentEntryId, {
        breaks: updatedBreaks
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la pause:', error);
      toast.error("Erreur lors de la sauvegarde de la pause");
    }
  };

  const handleEndBreak = async () => {
    if (!isOnBreak || !breakStartTime || !currentEntryId) return;
    
    const now = new Date();
    const endTime = format(now, "HH:mm");
    
    // Calculer la durée de la pause
    const startParts = breakStartTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);
    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    const duration = endMinutes - startMinutes;
    
    // Mettre à jour la dernière entrée de pause
    const updatedBreaks = breakEntries.map((entry, index) => 
      index === breakEntries.length - 1 
        ? { ...entry, endTime, duration }
        : entry
    );
    setBreakEntries(updatedBreaks);
    
    setIsOnBreak(false);
    setBreakStartTime(null);

    // Mettre à jour en base de données
    try {
      await updateTimeEntry(currentEntryId, {
        breaks: updatedBreaks
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la fin de pause:', error);
      toast.error("Erreur lors de la sauvegarde de la fin de pause");
    }
  };

  const handleWorksiteChange = (worksiteId: string) => {
    setSelectedWorksite(worksiteId);
  };

  // Fonction pour démarrer le pointage
  const handleStartTracking = async (comment?: string) => {
    if (!selectedWorksite) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Récupération de la position
      let position;
      try {
        position = await getCurrentLocation();
      } catch (locationError) {
        if (isOffline) {
          position = {
            latitude: 0,
            longitude: 0,
            accuracy: 0
          };
          toast.warning("Position non disponible en mode hors-ligne");
        } else {
          throw locationError;
        }
      }
      
      // Démarrage du pointage
      const now = new Date();
      const startTimeStr = format(now, "HH:mm");
      const dateStr = format(now, "yyyy-MM-dd");
      
      // Créer l'entrée de pointage
      const timeEntry = await createTimeEntry({
        user_id: user.id,
        worksite_id: selectedWorksite,
        date: dateStr,
        start_time: startTimeStr,
        start_coordinates: position,
        comment: comment,
        breaks: [],
        status: 'active'
      });
      
      setStartTime(startTimeStr);
      setIsTracking(true);
      setLocationData(position);
      setCurrentEntryId(timeEntry.id);
      
      toast.success("Pointage démarré avec succès", {
        description: comment 
          ? `Commentaire: ${comment}` 
          : `Position enregistrée: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`,
      });
      
      // Programmer un rappel pour la fin de journée si les notifications sont activées
      if (notificationsEnabled && reminderSettings.eveningReminder) {
        const [hours, minutes] = reminderSettings.eveningReminderTime.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        
        if (reminderTime > now) {
          const timeInMinutes = (reminderTime.getTime() - now.getTime()) / (1000 * 60);
          schedulePointageReminder(
            timeInMinutes,
            "Rappel de fin de journée",
            "N'oubliez pas de pointer la fin de votre journée de travail."
          );
        }
      }
      
      // Récupérer l'adresse en arrière-plan si en ligne
      if (!isOffline) {
        setIsAddressLoading(true);
        
        try {
          const address = await getAddressFromCoordinates(position.latitude, position.longitude);
          setLocationData(prev => prev ? {...prev, address} : null);
        } catch (addressError) {
          console.error("Erreur lors de la récupération de l'adresse", addressError);
        } finally {
          setIsAddressLoading(false);
        }
      }
      
    } catch (error) {
      console.error('Erreur lors du démarrage du pointage:', error);
      if (error instanceof Error) {
        setLocationError(error.message);
        toast.error("Erreur lors du démarrage du pointage", {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour terminer le pointage
  const handleEndTracking = async (comment?: string) => {
    if (!currentEntryId) return;
    
    setIsLoading(true);
    
    try {
      // Récupération de la position de fin
      let position;
      try {
        position = await getCurrentLocation();
      } catch (locationError) {
        if (isOffline) {
          position = {
            latitude: 0,
            longitude: 0,
            accuracy: 0
          };
          toast.warning("Position non disponible en mode hors-ligne");
        } else {
          throw locationError;
        }
      }
      
      // Terminer la pause si en cours
      if (isOnBreak) {
        await handleEndBreak();
      }
      
      // Mettre à jour l'entrée de pointage
      const endTimeStr = format(new Date(), "HH:mm");
      const finalComment = comment ? 
        (await getActiveTimeEntry(user.id, format(new Date(), "yyyy-MM-dd")))?.comment ? 
          `${(await getActiveTimeEntry(user.id, format(new Date(), "yyyy-MM-dd")))?.comment}\n\nFin: ${comment}` : 
          comment : 
        undefined;
      
      await updateTimeEntry(currentEntryId, {
        end_time: endTimeStr,
        end_coordinates: position,
        comment: finalComment,
        status: 'completed'
      });
      
      setLocationData(position);
      setIsTracking(false);
      setCurrentEntryId(null);
      setBreakEntries([]);
      
      toast.success("Pointage terminé avec succès", {
        description: comment 
          ? `Commentaire: ${comment}` 
          : `Position enregistrée: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`,
      });
      
      // Récupérer l'adresse en arrière-plan si en ligne
      if (!isOffline) {
        setIsAddressLoading(true);
        
        try {
          const address = await getAddressFromCoordinates(position.latitude, position.longitude);
          setLocationData(prev => prev ? {...prev, address} : null);
        } catch (addressError) {
          console.error("Erreur lors de la récupération de l'adresse", addressError);
        } finally {
          setIsAddressLoading(false);
        }
      }
      
    } catch (error) {
      console.error('Erreur lors de la fin du pointage:', error);
      if (error instanceof Error) {
        setLocationError(error.message);
        toast.error("Erreur lors de la fin du pointage", {
          description: error.message,
        });
      }
      setIsTracking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminderSettingChange = (setting: keyof typeof reminderSettings, value: any) => {
    setReminderSettings(prev => {
      const updated = { ...prev, [setting]: value };
      localStorage.setItem("avem_reminder_preferences", JSON.stringify(updated));
      return updated;
    });
  };

  // Fonction de synchronisation factice pour la compatibilité
  const handleSyncRequest = async () => {
    toast.info("Synchronisation automatique avec Supabase");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header with title and settings */}
      <header className="bg-gray-800 text-white px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Pointage de la journée</h1>
          <div className="flex items-center space-x-2">
            <div className="text-sm">{currentDate}</div>
            
            {/* Sheet for settings */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Paramètres</SheetTitle>
                  <SheetDescription>
                    Configurez vos paramètres de pointage et de notifications.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  {/* Paramètres des notifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Activer les notifications</Label>
                        <p className="text-sm text-gray-500">Recevoir des rappels pour le pointage</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={async (checked) => {
                          if (checked) {
                            const granted = await requestNotificationPermission();
                            setNotificationsEnabled(granted);
                          } else {
                            setNotificationsEnabled(false);
                          }
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="morning-reminder">Rappel du matin</Label>
                        <Switch
                          id="morning-reminder"
                          checked={reminderSettings.morningReminder}
                          onCheckedChange={(checked) => handleReminderSettingChange('morningReminder', checked)}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="morning-time" className="shrink-0">Heure :</Label>
                        <Input
                          id="morning-time"
                          type="time"
                          value={reminderSettings.morningReminderTime}
                          onChange={(e) => handleReminderSettingChange('morningReminderTime', e.target.value)}
                          disabled={!notificationsEnabled || !reminderSettings.morningReminder}
                          className="max-w-[120px]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="evening-reminder">Rappel du soir</Label>
                        <Switch
                          id="evening-reminder"
                          checked={reminderSettings.eveningReminder}
                          onCheckedChange={(checked) => handleReminderSettingChange('eveningReminder', checked)}
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="evening-time" className="shrink-0">Heure :</Label>
                        <Input
                          id="evening-time"
                          type="time"
                          value={reminderSettings.eveningReminderTime}
                          onChange={(e) => handleReminderSettingChange('eveningReminderTime', e.target.value)}
                          disabled={!notificationsEnabled || !reminderSettings.eveningReminder}
                          className="max-w-[120px]"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Statut de connexion */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Connexion</h3>
                    
                    <div className="flex items-center space-x-2 p-4 rounded-md bg-gray-50">
                      {isOffline ? (
                        <WifiOff className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Wifi className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {isOffline ? "Mode hors-ligne" : "Connecté à Supabase"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isOffline 
                            ? "Les pointages seront synchronisés dès le retour de la connexion." 
                            : "Les pointages sont enregistrés en temps réel."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full">Fermer</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-16 pb-20">
        {/* Worksite Selection with Search */}
        <WorksiteSearchSelector 
          selectedWorksite={selectedWorksite} 
          onChange={handleWorksiteChange} 
          disabled={isTracking} 
        />

        {/* Location Status and Error Display */}
        <LocationDisplay 
          locationData={locationData} 
          locationError={locationError} 
          isAddressLoading={isAddressLoading}
          isOffline={isOffline} 
        />

        {/* Break Controls */}
        <BreakControls
          isTracking={isTracking}
          isOnBreak={isOnBreak}
          breakStartTime={breakStartTime}
          onStartBreak={handleStartBreak}
          onEndBreak={handleEndBreak}
          disabled={isLoading}
        />

        {/* Time Tracking Controls */}
        <TrackingControls 
          isTracking={isTracking}
          startTime={startTime}
          isLoading={isLoading}
          hasSelectedWorksite={!!selectedWorksite}
          isOffline={isOffline}
          onStartTracking={handleStartTracking}
          onEndTracking={handleEndTracking}
          pendingSyncCount={0}
          onSyncRequest={handleSyncRequest}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="pointage" />
    </div>
  );
};
