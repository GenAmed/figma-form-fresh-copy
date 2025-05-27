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
  getOfflineEntries, 
  saveOfflineEntry, 
  syncOfflineEntries, 
  isOnline, 
  setupConnectivityListeners, 
  generateOfflineId, 
  OfflineTimeEntry 
} from "@/services/offlineService";
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
  const [pendingEntries, setPendingEntries] = useState<OfflineTimeEntry[]>([]);
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
  
  // Initialisation et vérification de l'état hors-ligne
  useEffect(() => {
    // Récupérer les pointages en attente
    const updatePendingEntries = () => {
      const entries = getOfflineEntries().filter(entry => entry.status === "pending");
      setPendingEntries(entries);
    };
    
    // Vérifier s'il y a un pointage actif
    const checkActiveTracking = () => {
      const entries = getOfflineEntries();
      const activeEntry = entries.find(entry => 
        entry.userId === user.id && 
        entry.date === format(new Date(), "yyyy-MM-dd") && 
        !entry.endTime
      );
      
      if (activeEntry) {
        setIsTracking(true);
        setStartTime(activeEntry.startTime);
        setSelectedWorksite(activeEntry.worksiteId);
        setCurrentEntryId(activeEntry.id);
      }
    };
    
    // Configurer les écouteurs de connectivité
    const cleanup = setupConnectivityListeners(
      () => {
        setIsOffline(false);
        toast.success("Connexion rétablie");
        // Tenter de synchroniser les pointages en attente
        syncOfflineEntries().then(updatePendingEntries);
      },
      () => {
        setIsOffline(true);
        toast.warning("Mode hors-ligne activé");
      }
    );
    
    // Demander l'autorisation pour les notifications
    requestNotificationPermission().then(granted => {
      setNotificationsEnabled(granted);
      if (granted) {
        toast.success("Notifications activées");
      }
    });
    
    updatePendingEntries();
    checkActiveTracking();
    
    return cleanup;
  }, [user.id]);
  
  // Gestion des pauses
  const handleStartBreak = async () => {
    if (!isTracking) return;
    
    const now = new Date();
    const breakTime = format(now, "HH:mm");
    
    setIsOnBreak(true);
    setBreakStartTime(breakTime);
    
    // Ajouter l'entrée de pause
    const newBreakEntry: BreakEntry = {
      startTime: breakTime
    };
    setBreakEntries(prev => [...prev, newBreakEntry]);
  };

  const handleEndBreak = async () => {
    if (!isOnBreak || !breakStartTime) return;
    
    const now = new Date();
    const endTime = format(now, "HH:mm");
    
    // Calculer la durée de la pause
    const startParts = breakStartTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);
    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    const duration = endMinutes - startMinutes;
    
    // Mettre à jour la dernière entrée de pause
    setBreakEntries(prev => 
      prev.map((entry, index) => 
        index === prev.length - 1 
          ? { ...entry, endTime, duration }
          : entry
      )
    );
    
    setIsOnBreak(false);
    setBreakStartTime(null);
  };

  const handleWorksiteChange = (worksiteId: string) => {
    setSelectedWorksite(worksiteId);
  };
  
  // Fonction pour gérer la synchronisation manuelle
  const handleSyncRequest = async () => {
    if (!navigator.onLine) {
      toast.error("Vous êtes hors-ligne. Veuillez vous connecter à internet pour synchroniser.");
      return;
    }
    
    const success = await syncOfflineEntries();
    if (success) {
      const entries = getOfflineEntries().filter(entry => entry.status === "pending");
      setPendingEntries(entries);
    }
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
          // En mode hors-ligne, utiliser des coordonnées fictives
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
      setStartTime(startTimeStr);
      setIsTracking(true);
      setLocationData(position);
      
      // Création d'une entrée de pointage hors-ligne
      const entryId = generateOfflineId();
      const entry: OfflineTimeEntry = {
        id: entryId,
        userId: user.id,
        worksiteId: selectedWorksite,
        date: format(now, "yyyy-MM-dd"),
        startTime: startTimeStr,
        endTime: null,
        startCoordinates: position,
        status: "pending",
        comment: comment || undefined
      };
      
      saveOfflineEntry(entry);
      setCurrentEntryId(entryId);
      
      // Mettre à jour les entrées en attente
      setPendingEntries(prev => [...prev, entry]);
      
      // Notification de confirmation
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
        
        // Si l'heure est déjà passée, ne pas programmer de rappel
        if (reminderTime > now) {
          const timeInMinutes = (reminderTime.getTime() - now.getTime()) / (1000 * 60);
          schedulePointageReminder(
            timeInMinutes,
            "Rappel de fin de journée",
            "N'oubliez pas de pointer la fin de votre journée de travail."
          );
        }
      }
      
      // On récupère l'adresse en arrière-plan sans bloquer l'interface
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

  // Fonction pour terminer le pointage
  const handleEndTracking = async (comment?: string) => {
    setIsLoading(true);
    
    try {
      // Récupération de la position de fin
      let position;
      try {
        position = await getCurrentLocation();
      } catch (locationError) {
        if (isOffline) {
          // En mode hors-ligne, utiliser des coordonnées fictives
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
      
      // Enregistrement de la position et fin du pointage
      setLocationData(position);
      setIsTracking(false);
      
      // Terminer la pause si en cours
      if (isOnBreak) {
        await handleEndBreak();
      }
      
      if (currentEntryId) {
        const entries = getOfflineEntries();
        const entry = entries.find(e => e.id === currentEntryId);
        
        if (entry) {
          const updatedEntry: OfflineTimeEntry = {
            ...entry,
            endTime: format(new Date(), "HH:mm"),
            endCoordinates: position,
            comment: comment ? (entry.comment ? `${entry.comment}\n\nFin: ${comment}` : comment) : entry.comment
          };
          
          saveOfflineEntry(updatedEntry);
          setCurrentEntryId(null);
          
          // Mettre à jour les entrées en attente
          const updatedPendingEntries = pendingEntries.map(e => 
            e.id === currentEntryId ? updatedEntry : e
          );
          setPendingEntries(updatedPendingEntries);
          
          // Tenter de synchroniser si en ligne
          if (navigator.onLine) {
            syncOfflineEntries();
          }
        }
      }
      
      // Réinitialiser les pauses
      setBreakEntries([]);
      
      toast.success("Pointage terminé avec succès", {
        description: comment 
          ? `Commentaire: ${comment}` 
          : `Position enregistrée: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`,
      });
      
      // On récupère l'adresse en arrière-plan
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

  const handleReminderSettingChange = (setting: keyof typeof reminderSettings, value: any) => {
    setReminderSettings(prev => {
      const updated = { ...prev, [setting]: value };
      localStorage.setItem("avem_reminder_preferences", JSON.stringify(updated));
      return updated;
    });
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
                  
                  {/* Mode hors-ligne */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Mode hors-ligne</h3>
                    
                    <div className="flex items-center space-x-2 p-4 rounded-md bg-gray-50">
                      {isOffline ? (
                        <WifiOff className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Wifi className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {isOffline ? "Mode hors-ligne activé" : "Connecté"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isOffline 
                            ? "Les pointages seront enregistrés localement." 
                            : "Les pointages sont synchronisés automatiquement."}
                        </p>
                      </div>
                    </div>
                    
                    {pendingEntries.length > 0 && (
                      <div className="p-4 rounded-md bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-700">
                          {pendingEntries.length} pointage{pendingEntries.length > 1 ? "s" : ""} en attente de synchronisation
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSyncRequest}
                          disabled={isOffline}
                          className="mt-2 w-full"
                        >
                          Synchroniser maintenant
                        </Button>
                      </div>
                    )}
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
          pendingSyncCount={pendingEntries.length}
          onSyncRequest={handleSyncRequest}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="pointage" />
    </div>
  );
};
