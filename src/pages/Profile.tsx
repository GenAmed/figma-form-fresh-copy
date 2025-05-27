
import React from "react";
import { Navigate } from "react-router-dom";
import { UserProfile } from "@/components/profile/UserProfile";
import { AdminProfile } from "@/components/profile/AdminProfile";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";

const Profile: React.FC = () => {
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

  const userForComponents = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatarUrl: profile.avatar_url || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    phone: profile.phone
  };

  // Render the appropriate profile based on user role
  return profile.role === "admin" ? (
    <AdminProfile user={userForComponents} />
  ) : (
    <UserProfile user={userForComponents} />
  );
};

export default Profile;
