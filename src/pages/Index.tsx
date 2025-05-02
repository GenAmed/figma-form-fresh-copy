
import React from "react";
import { LoginPage } from "@/components/auth/LoginPage";
import { Toaster } from "@/components/ui/sonner";

const Index: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <LoginPage />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default Index;
