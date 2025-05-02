
import React from "react";
import { PointageWorker } from "@/components/pointage/PointageWorker";
import { getCurrentUser, User } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Pointage: React.FC = () => {
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

  return <PointageWorker user={user} />;
};

export default Pointage;
