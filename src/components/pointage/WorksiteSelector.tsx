
import React from "react";

interface WorksiteSelectorProps {
  selectedWorksite: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

export const WorksiteSelector: React.FC<WorksiteSelectorProps> = ({ 
  selectedWorksite, 
  onChange, 
  disabled 
}) => {
  return (
    <section className="mt-6">
      <label className="block text-[#333333] text-sm mb-2">
        Sélectionnez un chantier
      </label>
      <div className="relative">
        <select 
          className="w-full p-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#BD1E28]"
          value={selectedWorksite}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">Choisir un chantier</option>
          <option value="1">Chantier Paris-Nord</option>
          <option value="2">Chantier Marseille-Port</option>
          <option value="3">Chantier Lyon-Est</option>
        </select>
        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
    </section>
  );
};
