
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ label = "Retour" }) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate(-1)} 
      className="flex items-center gap-1"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};
