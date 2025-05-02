
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WorksiteActionsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const WorksiteActions: React.FC<WorksiteActionsProps> = ({ onSubmit, isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
      <div className="flex justify-between gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate("/gestion")}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          onClick={onSubmit} 
          className="flex-1 bg-[#BD1E28] hover:bg-[#A01822] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Chargement...' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
};
