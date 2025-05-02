
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface WorksiteHeaderProps {
  title: string;
}

export const WorksiteHeader: React.FC<WorksiteHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#BD1E28] text-white p-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4 p-0 hover:bg-transparent text-white"
          onClick={() => navigate("/gestion")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
    </header>
  );
};
