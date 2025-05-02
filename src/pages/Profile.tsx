
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/components/profile/UserProfile";

const Profile: React.FC = () => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" />;
  }

  return <UserProfile user={user} />;
};

export default Profile;
