
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, CalendarDays, Settings, User, BarChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavigationProps {
  activeTab: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const isAdmin = profile?.role === "admin";

  // Determine active tab based on current location if not provided
  const currentActiveTab = React.useMemo(() => {
    if (activeTab !== 'auto') return activeTab;
    
    const path = location.pathname;
    if (path === '/home') return 'home';
    if (path.startsWith('/gestion')) return 'gestion';
    if (path === '/calendrier') return 'calendrier';
    if (path === '/pointage') return 'pointage';
    if (path === '/suivi-hebdo') return 'suivi-hebdo';
    if (path === '/profil') return 'profil';
    return 'home';
  }, [activeTab, location.pathname]);

  return (
    <div id="footer" className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/home" 
          className={`flex flex-col items-center ${currentActiveTab === 'home' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        {isAdmin ? (
          <>
            <Link 
              to="/gestion" 
              className={`flex flex-col items-center ${currentActiveTab === 'gestion' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <Settings size={20} />
              <span className="text-xs mt-1">Gestion</span>
            </Link>
            <Link 
              to="/calendrier" 
              className={`flex flex-col items-center ${currentActiveTab === 'calendrier' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <CalendarDays size={20} />
              <span className="text-xs mt-1">Calendrier</span>
            </Link>
            <Link 
              to="/profil" 
              className={`flex flex-col items-center ${currentActiveTab === 'profil' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <User size={20} />
              <span className="text-xs mt-1">Profil</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/pointage" 
              className={`flex flex-col items-center ${currentActiveTab === 'pointage' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <Clock size={20} />
              <span className="text-xs mt-1">Pointage</span>
            </Link>
            <Link 
              to="/calendrier" 
              className={`flex flex-col items-center ${currentActiveTab === 'calendrier' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <CalendarDays size={20} />
              <span className="text-xs mt-1">Calendrier</span>
            </Link>
            <Link 
              to="/suivi-hebdo" 
              className={`flex flex-col items-center ${currentActiveTab === 'suivi-hebdo' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <BarChart size={20} />
              <span className="text-xs mt-1">Suivi</span>
            </Link>
            <Link 
              to="/profil" 
              className={`flex flex-col items-center ${currentActiveTab === 'profil' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
            >
              <User size={20} />
              <span className="text-xs mt-1">Profil</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
