
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

  // Récupérer le profil seulement si un rôle est requis
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !requireRole) {
        setUserProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
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
      }
    };

    fetchUserProfile();
  }, [user, requireRole]);

  useEffect(() => {
    // Attendre que l'auth soit chargée
    if (loading) {
      console.log("🔄 [AuthGuard] Auth en cours de chargement...");
      return;
    }

    console.log("🔍 [AuthGuard] Vérification des permissions:", {
      requireAuth,
      hasUser: !!user,
      userEmail: user?.email,
      currentPath: location.pathname,
      requireRole,
      userRole: userProfile?.role
    });

    // Route publique (page de connexion)
    if (!requireAuth) {
      // Si l'utilisateur est connecté et sur la page de connexion, rediriger vers /home
      if (user && location.pathname === "/") {
        console.log("🔄 [AuthGuard] Utilisateur connecté sur page de connexion, redirection vers /home");
        navigate("/home", { replace: true });
        return;
      }
      console.log("✅ [AuthGuard] Accès autorisé à la route publique");
      return;
    }

    // Routes protégées - vérifier l'authentification
    if (!user) {
      console.log("🔒 [AuthGuard] Utilisateur non connecté, redirection vers /");
      navigate("/", { replace: true });
      return;
    }

    // Si un rôle est requis, attendre le chargement du profil
    if (requireRole) {
      if (profileLoading) {
        console.log("🔄 [AuthGuard] Profile en cours de chargement...");
        return;
      }

      if (!userProfile) {
        console.log("❌ [AuthGuard] Profil non trouvé");
        navigate("/", { replace: true });
        return;
      }

      if (userProfile.role !== requireRole) {
        console.log(`🔒 [AuthGuard] Accès refusé - rôle requis: ${requireRole}, rôle utilisateur: ${userProfile.role}`);
        navigate("/home", { replace: true });
        return;
      }
    }

    console.log("✅ [AuthGuard] Accès autorisé");
  }, [navigate, location.pathname, requireAuth, requireRole, user, loading, userProfile, profileLoading]);

  // Affichage de chargement pendant l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Affichage de chargement pendant la récupération du profil (seulement si un rôle est requis)
  if (requireRole && profileLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Afficher le contenu si autorisé
  return <>{children}</>;
};
