
import React, { useEffect, useState } from "react";
import { HomeWorker } from "@/components/home/HomeWorker";
import { HomeAdmin } from "@/components/home/HomeAdmin";
import { getCurrentUser, User } from "@/lib/auth";
import { Navigate } from "react-router-dom";

const Home: React.FC = () => {
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

  return user.role === "admin" ? <HomeAdmin user={user} /> : <HomeWorker user={user} />;
};

export default Home;
