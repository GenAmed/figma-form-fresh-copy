
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

    const currentPath = location.pathname;
    
    // Page publique (page de connexion)
    if (!requireAuth) {
      if (user && currentPath === "/") {
        console.log('Utilisateur connecté, redirection vers /home');
        navigate("/home", { replace: true });
      }
      return;
    }

    // Routes protégées
    if (!user) {
      console.log('Pas d\'utilisateur, redirection vers login');
      navigate("/", { replace: true });
      return;
    }

    // Contrôle d'accès basé sur les rôles
    if (requireRole && profile && profile.role !== requireRole) {
      console.log('Rôle utilisateur incompatible, redirection vers /home');
      navigate("/home", { replace: true });
      return;
    }
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

  // Ne pas afficher les enfants si l'utilisateur doit être redirigé
  if (requireAuth && !user) {
    return null;
  }

  if (requireRole && profile && profile.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
};
