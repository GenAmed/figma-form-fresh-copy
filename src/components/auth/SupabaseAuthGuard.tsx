
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

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
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    console.log(`[AuthGuard] Current path: ${location.pathname}, requireAuth: ${requireAuth}, user: ${!!user}`);
    
    // Si on est sur la page de login (requireAuth = false)
    if (!requireAuth) {
      // Si l'utilisateur est connecté et sur la page de login, rediriger vers home
      if (user && (location.pathname === "/" || location.pathname === "")) {
        console.log('Utilisateur connecté sur page login, redirection vers /home');
        navigate("/home", { replace: true });
      }
      return;
    }

    // Si on a besoin d'authentification mais pas d'utilisateur
    if (!user) {
      console.log('Authentification requise mais pas d\'utilisateur, redirection vers login');
      navigate("/", { replace: true });
      return;
    }

    // Vérification des rôles si nécessaire
    if (requireRole && profile && profile.role !== requireRole) {
      console.log(`Rôle requis: ${requireRole}, rôle utilisateur: ${profile.role}, redirection vers /home`);
      navigate("/home", { replace: true });
      return;
    }

    console.log('[AuthGuard] Accès autorisé');
  }, [loading, user, profile?.role, requireAuth, requireRole, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si on est sur une route protégée sans utilisateur, ne rien afficher (la redirection est en cours)
  if (requireAuth && !user) {
    return null;
  }

  // Si on a besoin d'un rôle spécifique et que l'utilisateur ne l'a pas
  if (requireRole && profile && profile.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
};
