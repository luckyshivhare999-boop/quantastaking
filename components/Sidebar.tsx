
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-gray-700 text-white' : ''
      }`}
    >
      {icon}
      <span className="ml-4 font-medium hidden md:inline">{label}</span>
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
  return (
    <div className="flex flex-col w-16 md:w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex items-center justify-center md:justify-start md:px-6 h-20 border-b border-gray-700">
        <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h1 className="ml-3 text-2xl font-bold text-white hidden md:inline">QuantumLeap</h1>
      </div>
      <div className="flex flex-col flex-grow p-4 space-y-2">
        <NavLink icon={ICONS.dashboard} label="Dashboard" isActive={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
        <NavLink icon={ICONS.staking} label="Staking" isActive={activePage === 'staking'} onClick={() => setActivePage('staking')} />
        <NavLink icon={ICONS.wallet} label="Wallet" isActive={activePage === 'wallet'} onClick={() => setActivePage('wallet')} />
        <NavLink icon={ICONS.history} label="History" isActive={activePage === 'history'} onClick={() => setActivePage('history')} />
        <div className="flex-grow"></div>
        <NavLink icon={ICONS.logout} label="Logout" isActive={false} onClick={onLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
