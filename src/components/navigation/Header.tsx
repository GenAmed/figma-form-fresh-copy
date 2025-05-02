
import React from "react";

interface HeaderProps {
  username: string;
  role: string;
  avatarUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ username, role, avatarUrl }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-3 z-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">Bonjour {username}</p>
          <p className="text-sm text-gray-300">Rôle: {role}</p>
        </div>
        <div className="relative">
          <button id="profile-button" className="w-10 h-10 rounded-full overflow-hidden">
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </div>
  );
};
