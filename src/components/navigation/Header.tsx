
import React from "react";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser } from "@/lib/auth";
import { BackButton } from "./BackButton";

interface HeaderProps {
  username: string;
  role: string;
  avatarUrl: string;
  showBackButton?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  username, 
  role, 
  avatarUrl, 
  showBackButton = false,
  title
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-3 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showBackButton && <BackButton />}
          {title ? (
            <h1 className="text-lg font-bold">{title}</h1>
          ) : (
            <div>
              <p className="text-lg font-bold">Bonjour {username}</p>
              <p className="text-sm text-gray-300">Rôle: {role}</p>
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            id="profile-button" 
            className="w-10 h-10 rounded-full overflow-hidden"
            onClick={() => setShowMenu(!showMenu)}
          >
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
