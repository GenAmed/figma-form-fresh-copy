
import React from "react";
import { HomeWorker } from "@/components/home/HomeWorker";
import { HomeAdmin } from "@/components/home/HomeAdmin";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";
import { Navigate } from "react-router-dom";

const Home: React.FC = () => {
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

  if (!user || !profile) {
    return <Navigate to="/" />;
  }

  // Convertir le profil Supabase vers le format User attendu par les composants
  const userForComponents = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatarUrl: profile.avatar_url || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    phone: profile.phone
  };

  return profile.role === "admin" ? 
    <HomeAdmin user={userForComponents} /> : 
    <HomeWorker user={userForComponents} />;
};

export default Home;
