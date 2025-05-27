
import React from "react";
import { Navigate } from "react-router-dom";
import { ReportsAdmin } from "@/components/reports/ReportsAdmin";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";

const Reports: React.FC = () => {
  const { profile, loading, user } = useSupabaseProfile();

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

  // If no user is logged in, redirect to the login page
  if (!user || !profile) {
    return <Navigate to="/" />;
  }

  // Only admin should access this page
  if (profile.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return <ReportsAdmin user={{
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatarUrl: profile.avatar_url || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    phone: profile.phone
  }} />;
};

export default Reports;
