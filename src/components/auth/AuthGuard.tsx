
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { sessionService } from "@/services/sessionService";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "admin" | "ouvrier";
}

/**
 * Composant de protection des routes
 * Vérifie l'authentification et les permissions avant d'afficher le contenu
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  requireRole 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      
      // Si l'authentification n'est pas requise, autoriser l'accès
      if (!requireAuth) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Vérifier si l'utilisateur est connecté
      if (!user) {
        console.log("AuthGuard: Utilisateur non connecté, redirection vers /");
        navigate("/", { replace: true });
        setIsLoading(false);
        return;
      }

      // Vérifier le rôle si requis
      if (requireRole && user.role !== requireRole) {
        console.log(`AuthGuard: Accès refusé - rôle requis: ${requireRole}, rôle utilisateur: ${user.role}`);
        navigate("/home", { replace: true });
        setIsLoading(false);
        return;
      }

      // Démarrer la surveillance de session
      sessionService.startSessionMonitoring();
      
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location.pathname, requireAuth, requireRole]);

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Afficher le contenu si autorisé
  return isAuthorized ? <>{children}</> : null;
};
