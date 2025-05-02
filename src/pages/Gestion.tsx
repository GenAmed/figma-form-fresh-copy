
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { WorksiteManagement } from "@/components/gestion/WorksiteManagement";
import { AddWorksite } from "@/components/gestion/AddWorksite";
import { WorksiteDetails } from "@/components/gestion/WorksiteDetails";
import { UserManagement } from "@/components/gestion/UserManagement";
import { AddUser } from "@/components/gestion/AddUser";
import { UserDetails } from "@/components/gestion/UserDetails";
import { AddAssignment } from "@/components/gestion/AddAssignment";
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
      <Route path="/users" element={<UserManagement user={user} />} />
      <Route path="/users/add" element={<AddUser />} />
      <Route path="/users/details/:id" element={<UserDetails />} />
      <Route path="/users/details/:id/add-assignment" element={<AddAssignment />} />
    </Routes>
  );
};

export default Gestion;
