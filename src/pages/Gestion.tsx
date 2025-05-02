
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { WorksiteManagement } from "@/components/gestion/WorksiteManagement";
import { AddWorksite } from "@/components/gestion/AddWorksite";
import { WorksiteDetails } from "@/components/gestion/WorksiteDetails";
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

  return (
    <Routes>
      <Route path="/" element={<WorksiteManagement user={user} />} />
      <Route path="/add" element={<AddWorksite />} />
      <Route path="/details/:id" element={<WorksiteDetails />} />
    </Routes>
  );
};

export default Gestion;
