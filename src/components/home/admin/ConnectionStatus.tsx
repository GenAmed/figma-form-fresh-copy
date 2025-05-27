
import React from "react";
import { WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  if (isConnected) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-amber-800 flex items-center">
      <WifiOff className="h-4 w-4 mr-2 flex-shrink-0" />
      <p className="text-sm">
        Mode hors ligne activé. Certaines fonctionnalités peuvent être limitées.
      </p>
    </div>
  );
};
