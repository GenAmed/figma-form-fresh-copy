
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { WorksiteManagement } from "@/components/gestion/WorksiteManagement";
import { AddWorksite } from "@/components/gestion/AddWorksite";
import { WorksiteDetails } from "@/components/gestion/WorksiteDetails";
import { EditWorksite } from "@/components/gestion/EditWorksite";
import { UserManagement } from "@/components/gestion/UserManagement";
import { AddUser } from "@/components/gestion/AddUser";
import { UserDetails } from "@/components/gestion/UserDetails";
import { AddAssignment } from "@/components/gestion/AddAssignment";
import { EditUser } from "@/components/gestion/EditUser";
import { InternalMessagesManager } from "@/components/admin/InternalMessagesManager";
import { useAuth } from "@/hooks/useAuth";

const Gestion = () => {
  const { profile, loading } = useAuth();

  // Affichage de chargement
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

  // Si pas de profil ou pas admin, rediriger
  if (!profile || profile.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return (
    <Routes>
      <Route path="/" element={<WorksiteManagement />} />
      <Route path="/add" element={<AddWorksite />} />
      <Route path="/details/:id" element={<WorksiteDetails />} />
      <Route path="/edit/:id" element={<EditWorksite />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/add" element={<AddUser />} />
      <Route path="/users/details/:id" element={<UserDetails />} />
      <Route path="/users/edit/:id" element={<EditUser />} />
      <Route path="/users/details/:id/add-assignment" element={<AddAssignment />} />
      <Route path="/messages" element={<InternalMessagesManager />} />
    </Routes>
  );
};

export default Gestion;
