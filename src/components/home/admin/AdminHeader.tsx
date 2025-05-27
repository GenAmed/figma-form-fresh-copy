
import React from "react";
import { Check, WifiOff } from "lucide-react";

interface AdminHeaderProps {
  profileName: string;
  isConnected: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ profileName, isConnected }) => {
  return (
    <header className="bg-[#BD1E28] text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">Bonjour, {profileName}</h1>
          <p className="text-sm opacity-90">Rôle: Administrateur</p>
        </div>
        <div className="relative flex items-center">
          <span className="mr-2">
            {isConnected ? 
              <Check className="h-4 w-4 text-green-400" /> : 
              <WifiOff className="h-4 w-4 text-amber-400" />
            }
          </span>
          <button id="notifications-btn" className="p-2">
            <i className="fa-regular fa-bell text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
          </button>
        </div>
      </div>
    </header>
  );
};
