
import React from "react";
import { Navigate } from "react-router-dom";
import { WorksiteManagement } from "@/components/gestion/WorksiteManagement";
import { getCurrentUser } from "@/lib/auth";

const Gestion = () => {
  const user = getCurrentUser();

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // Only admin should access this page
  if (user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return <WorksiteManagement user={user} />;
};

export default Gestion;
