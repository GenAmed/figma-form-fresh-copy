
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { ReportsAdmin } from "@/components/reports/ReportsAdmin";

const Reports: React.FC = () => {
  const user = getCurrentUser();

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // Only admin should access this page
  if (user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return <ReportsAdmin user={user} />;
};

export default Reports;
