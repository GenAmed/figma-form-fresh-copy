
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
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        setHasCheckedAuth(true);
        return;
      }

      try {
        console.log("🔍 [AuthGuard] Récupération du profil utilisateur:", user.email);
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("❌ [AuthGuard] Erreur lors de la récupération du profil:", error);
        } else {
          console.log("✅ [AuthGuard] Profil utilisateur récupéré:", profile);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("❌ [AuthGuard] Erreur lors de la récupération du profil:", error);
      } finally {
        setProfileLoading(false);
        setHasCheckedAuth(true);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (loading || profileLoading || !hasCheckedAuth) {
      console.log("🔄 [AuthGuard] En cours de chargement...", { loading, profileLoading, hasCheckedAuth });
      return;
    }

    console.log("🔍 [AuthGuard] Vérification des permissions:", {
      requireAuth,
      user: !!user,
      userProfile,
      currentPath: location.pathname
    });

    // Si l'utilisateur est connecté et sur la page de connexion, rediriger vers /home
    if (user && location.pathname === "/" && !requireAuth) {
      console.log("🔄 [AuthGuard] Utilisateur connecté sur page de connexion, redirection vers /home");
      navigate("/home", { replace: true });
      return;
    }

    // Si l'authentification n'est pas requise, autoriser l'accès
    if (!requireAuth) {
      console.log("✅ [AuthGuard] Authentification non requise, accès autorisé");
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!user) {
      console.log("🔒 [AuthGuard] Utilisateur non connecté, redirection vers /");
      navigate("/", { replace: true });
      return;
    }

    // Vérifier le rôle si requis
    if (requireRole && userProfile && userProfile.role !== requireRole) {
      console.log(`🔒 [AuthGuard] Accès refusé - rôle requis: ${requireRole}, rôle utilisateur: ${userProfile.role}`);
      navigate("/home", { replace: true });
      return;
    }

    console.log("✅ [AuthGuard] Accès autorisé");
  }, [navigate, location.pathname, requireAuth, requireRole, user, loading, userProfile, profileLoading, hasCheckedAuth]);

  // Affichage de chargement
  if (loading || profileLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si pas authentifié
  if (requireAuth && !user) {
    return null;
  }

  // Vérifier les permissions de rôle
  if (requireRole && userProfile && userProfile.role !== requireRole) {
    return null;
  }

  // Afficher le contenu si autorisé
  return <>{children}</>;
};
