
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/components/profile/UserProfile";
import { AdminProfile } from "@/components/profile/AdminProfile";

const Profile: React.FC = () => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" />;
  }

  // Render the appropriate profile based on user role
  return user.role === "admin" ? (
    <AdminProfile user={user} />
  ) : (
    <UserProfile user={user} />
  );
};

export default Profile;
