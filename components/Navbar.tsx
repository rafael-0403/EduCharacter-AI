
import React from 'react';
import { UserRole } from '../types';
import { LogOut, User, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  user: { id: string; name: string; role: UserRole };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const displayInfo = user.name;

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
          <span className="text-lg md:text-xl font-bold tracking-tight">
            EduCharacter <span className="text-indigo-200">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="flex items-center">
             <span className="text-[10px] md:text-sm bg-indigo-800 px-2 md:px-4 py-1.5 rounded-full flex items-center gap-1.5 md:gap-2.5 border border-indigo-500/30 shadow-inner">
               <User className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
               <span className="max-w-[150px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-none truncate font-medium">
                 {displayInfo}
               </span>
             </span>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-indigo-600 active:bg-indigo-800 rounded-full transition-colors group relative"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute hidden md:group-hover:block top-10 right-0 bg-slate-800 text-xs text-white px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl border border-slate-700">
              Keluar
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
