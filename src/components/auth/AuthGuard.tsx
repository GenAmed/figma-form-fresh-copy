
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";

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
  const { user, loading: authLoading } = useSupabaseAuth();
  const { profile, loading: profileLoading } = useSupabaseProfile();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("🔍 [AuthGuard] État actuel:", {
      authLoading,
      profileLoading,
      hasUser: !!user,
      userEmail: user?.email,
      requireAuth,
      requireRole,
      hasProfile: !!profile,
      userRole: profile?.role,
      currentPath: location.pathname,
      isReady
    });

    // Si l'authentification est en cours, attendre
    if (authLoading) {
      console.log("🔄 [AuthGuard] Auth en cours de chargement...");
      setIsReady(false);
      return;
    }

    // Route publique (page de connexion)
    if (!requireAuth) {
      // Si utilisateur connecté sur page de connexion, rediriger
      if (user && location.pathname === "/") {
        console.log("🔄 [AuthGuard] Redirection utilisateur connecté vers /home");
        navigate("/home", { replace: true });
        return;
      }
      console.log("✅ [AuthGuard] Route publique autorisée");
      setIsReady(true);
      return;
    }

    // Routes protégées - vérifier l'authentification
    if (!user) {
      console.log("🔒 [AuthGuard] Pas d'utilisateur, redirection vers /");
      navigate("/", { replace: true });
      setIsReady(false);
      return;
    }

    // Si un rôle est requis
    if (requireRole) {
      // Attendre le chargement du profil
      if (profileLoading) {
        console.log("🔄 [AuthGuard] Chargement du profil...");
        setIsReady(false);
        return;
      }

      // Vérifier si le profil existe
      if (!profile) {
        console.log("❌ [AuthGuard] Profil non trouvé, redirection vers /home");
        navigate("/home", { replace: true });
        setIsReady(false);
        return;
      }

      // Vérifier le rôle
      if (profile.role !== requireRole) {
        console.log(`🔒 [AuthGuard] Rôle incorrect: requis=${requireRole}, actuel=${profile.role}`);
        navigate("/home", { replace: true });
        setIsReady(false);
        return;
      }
    }

    console.log("✅ [AuthGuard] Accès autorisé");
    setIsReady(true);
  }, [navigate, location.pathname, requireAuth, requireRole, user, authLoading, profile, profileLoading]);

  // Écran de chargement
  if (authLoading || (requireRole && profileLoading) || !isReady) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? "Vérification de l'authentification..." : 
             profileLoading ? "Chargement du profil..." :
             "Préparation..."}
          </p>
        </div>
      </div>
    );
  }

  // Afficher le contenu
  return <>{children}</>;
};
