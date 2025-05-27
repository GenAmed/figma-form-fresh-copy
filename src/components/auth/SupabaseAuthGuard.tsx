
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

interface SupabaseAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "admin" | "ouvrier";
}

export const SupabaseAuthGuard: React.FC<SupabaseAuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  requireRole 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSupabaseAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  // Fonction pour récupérer le profil utilisateur - optimisée pour éviter les boucles
  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async () => {
      // Ne récupérer le profil que si un rôle est requis et qu'on ne l'a pas déjà vérifié
      if (!requireRole || !user || hasCheckedProfile || loading) {
        if (mounted && !requireRole) {
          setUserProfile(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);
      try {
        console.log("🔍 [SupabaseAuthGuard] Récupération du profil pour:", user.email);
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error("❌ [SupabaseAuthGuard] Erreur profil:", error);
          setUserProfile(null);
        } else if (profile) {
          console.log("✅ [SupabaseAuthGuard] Profil récupéré:", profile);
          setUserProfile(profile);
        } else {
          console.log("⚠️ [SupabaseAuthGuard] Aucun profil trouvé");
          setUserProfile(null);
        }
        
        setHasCheckedProfile(true);
      } catch (error) {
        console.error("❌ [SupabaseAuthGuard] Exception profil:", error);
        if (mounted) {
          setUserProfile(null);
          setHasCheckedProfile(true);
        }
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    // Délai pour éviter les appels multiples
    const timeoutId = setTimeout(fetchUserProfile, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [user?.id, requireRole, hasCheckedProfile, loading]);

  // Logique principale de navigation - optimisée
  useEffect(() => {
    console.log("🔍 [SupabaseAuthGuard] État actuel:", {
      loading,
      hasUser: !!user,
      userEmail: user?.email,
      requireAuth,
      requireRole,
      profileLoading,
      hasProfile: !!userProfile,
      userRole: userProfile?.role,
      currentPath: location.pathname,
      isReady,
      hasCheckedProfile
    });

    // Attendre que l'auth soit chargée
    if (loading) {
      console.log("🔄 [SupabaseAuthGuard] Auth en cours de chargement...");
      setIsReady(false);
      return;
    }

    // Route publique (page de connexion)
    if (!requireAuth) {
      // Si utilisateur connecté sur page de connexion, rediriger
      if (user && location.pathname === "/") {
        console.log("🔄 [SupabaseAuthGuard] Redirection utilisateur connecté vers /home");
        navigate("/home", { replace: true });
        return;
      }
      console.log("✅ [SupabaseAuthGuard] Route publique autorisée");
      setIsReady(true);
      return;
    }

    // Routes protégées - vérifier l'authentification
    if (!user) {
      console.log("🔒 [SupabaseAuthGuard] Pas d'utilisateur, redirection vers /");
      navigate("/", { replace: true });
      setIsReady(false);
      return;
    }

    // Si un rôle est requis
    if (requireRole) {
      // Attendre le chargement du profil
      if (profileLoading || !hasCheckedProfile) {
        console.log("🔄 [SupabaseAuthGuard] Chargement du profil...");
        setIsReady(false);
        return;
      }

      // Vérifier si le profil existe
      if (!userProfile) {
        console.log("❌ [SupabaseAuthGuard] Profil non trouvé, redirection vers /home");
        navigate("/home", { replace: true });
        setIsReady(false);
        return;
      }

      // Vérifier le rôle
      if (userProfile.role !== requireRole) {
        console.log(`🔒 [SupabaseAuthGuard] Rôle incorrect: requis=${requireRole}, actuel=${userProfile.role}`);
        navigate("/home", { replace: true });
        setIsReady(false);
        return;
      }
    }

    console.log("✅ [SupabaseAuthGuard] Accès autorisé");
    setIsReady(true);
  }, [navigate, location.pathname, requireAuth, requireRole, user?.id, loading, userProfile?.role, profileLoading, hasCheckedProfile]);

  // Écran de chargement
  if (loading || (requireRole && (profileLoading || !hasCheckedProfile)) || !isReady) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Vérification de l'authentification..." : 
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
