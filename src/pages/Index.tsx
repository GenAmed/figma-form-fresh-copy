
import React from "react";
import { LoginPage } from "@/components/auth/LoginPage";
import { Toaster } from "@/components/ui/sonner";

const Index: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <LoginPage />
      {/* Nous n'ajoutons pas le Toaster ici car il est déjà dans App.tsx */}
    </div>
  );
};

export default Index;
