
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
    
    // Public route (login page)
    if (!requireAuth) {
      if (user && currentPath === "/") {
        navigate("/home", { replace: true });
      }
      return;
    }

    // Protected routes
    if (!user) {
      if (currentPath !== "/") {
        navigate("/", { replace: true });
      }
      return;
    }

    // Role-based access
    if (requireRole && profile && profile.role !== requireRole) {
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

  return <>{children}</>;
};
