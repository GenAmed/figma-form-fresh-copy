
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
    // Wait for loading to complete
    if (loading) return;

    console.log('AuthGuard check:', {
      path: location.pathname,
      requireAuth,
      requireRole,
      hasUser: !!user,
      userRole: profile?.role
    });

    // Public route (login page)
    if (!requireAuth) {
      if (user && location.pathname === "/") {
        console.log('Redirecting authenticated user to /home');
        navigate("/home", { replace: true });
      }
      return;
    }

    // Protected routes
    if (!user) {
      console.log('No user, redirecting to login');
      navigate("/", { replace: true });
      return;
    }

    // Role-based access
    if (requireRole && (!profile || profile.role !== requireRole)) {
      console.log('Role mismatch or no profile, redirecting to /home');
      navigate("/home", { replace: true });
      return;
    }

    console.log('Access granted');
  }, [loading, user, profile, requireAuth, requireRole, location.pathname, navigate]);

  // Loading screen
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
