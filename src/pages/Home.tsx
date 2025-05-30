
import React from "react";
import { HomeWorker } from "@/components/home/HomeWorker";
import { HomeAdmin } from "@/components/home/HomeAdmin";
import { useAuth } from "@/hooks/useAuth";

const Home: React.FC = () => {
  const { profile, loading, error, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur de chargement du profil</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profil non trouvé</p>
        </div>
      </div>
    );
  }

  // Convert profile to the format expected by HomeWorker
  const userForWorker = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatarUrl: profile.avatar_url || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    phone: profile.phone
  };

  return profile.role === "admin" ? 
    <HomeAdmin profile={profile} /> : 
    <HomeWorker user={userForWorker} />;
};

export default Home;
