
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, CalendarDays, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  return (
    <div id="footer" className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/home" 
          className={`flex flex-col items-center ${activeTab === 'home' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        <Link 
          to="/pointage" 
          className={`flex flex-col items-center ${activeTab === 'pointage' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
        >
          <Clock size={20} />
          <span className="text-xs mt-1">Pointage</span>
        </Link>
        <Link 
          to="/calendrier" 
          className={`flex flex-col items-center ${activeTab === 'calendrier' ? 'text-[#BD1E28]' : 'text-[#666666]'} cursor-pointer`}
        >
          <CalendarDays size={20} />
          <span className="text-xs mt-1">Calendrier</span>
        </Link>
      </div>
    </div>
  );
};
