
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center">
         {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="font-semibold text-white">{user?.email}</p>
        </div>
        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center border-2 border-indigo-400">
            <span className="text-lg font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
