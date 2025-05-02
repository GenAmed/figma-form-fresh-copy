
import React from "react";
import { Navigate } from "react-router-dom";
import { WeeklySummaryWorker } from "@/components/tracking/WeeklySummaryWorker";
import { getCurrentUser, User } from "@/lib/auth";
import { useEffect, useState } from "react";

const WeeklySummary: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <WeeklySummaryWorker user={user} />;
};

export default WeeklySummary;
