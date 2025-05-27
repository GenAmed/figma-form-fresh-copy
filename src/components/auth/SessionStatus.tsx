
import React, { useState, useEffect } from "react";
import { Clock, Shield, LogOut } from "lucide-react";
import { useSessionMonitoring } from "@/services/sessionService";
import { clearCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SessionStatus: React.FC = () => {
  const navigate = useNavigate();
  const { getSessionInfo, extendSession } = useSessionMonitoring();
  const [sessionInfo, setSessionInfo] = useState(getSessionInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionInfo(getSessionInfo());
    }, 1000); // Mise à jour chaque seconde

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    toast.success("Déconnexion réussie", {
      description: "À bientôt !",
      duration: 2000,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleExtendSession = () => {
    extendSession();
  };

  if (!sessionInfo) return null;

  const { user, timeLeft } = sessionInfo;
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const isExpiringSoon = timeLeft < 15 * 60 * 1000; // Moins de 15 minutes

  return (
    <div className="flex items-center space-x-3 text-sm">
      {/* Statut de session */}
      <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
        isExpiringSoon ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
      }`}>
        <Shield size={14} />
        <span className="font-medium">{user.name}</span>
        <span className="text-xs">({user.role})</span>
      </div>

      {/* Temps restant */}
      <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
        isExpiringSoon ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
      }`}>
        <Clock size={14} />
        <span className="text-xs">
          {hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {isExpiringSoon && (
          <button
            onClick={handleExtendSession}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            title="Prolonger la session"
          >
            Prolonger
          </button>
        )}
        
        <button
          onClick={handleLogout}
          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
          title="Se déconnecter"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};
