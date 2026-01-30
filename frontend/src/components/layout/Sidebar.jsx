import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, StickyNote, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Przegląd', icon: <LayoutDashboard size={20} />, end: true },
    { path: '/dashboard/tasks', label: 'Zadania', icon: <CheckSquare size={20} /> },
    { path: '/dashboard/calendar', label: 'Kalendarz', icon: <Calendar size={20} /> },
    { path: '/dashboard/notes', label: 'Notatki', icon: <StickyNote size={20} /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen fixed left-0 top-0 hidden md:flex z-50">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-primary-20 p-2 rounded-lg text-primary">
          <Bot size={24} />
        </div>
        <span className="font-bold text-xl text-text-main tracking-tight">AI Time Mgr</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-primary text-text-main shadow-primary font-medium' 
                : 'text-text-muted hover:bg-surfaceHover hover:text-text-main'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-background rounded-xl p-4 mb-2">
          <p className="text-sm font-medium text-text-main truncate">{user?.name || 'Użytkownik'}</p>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-danger-light hover:bg-danger-background rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={18} /> Wyloguj się
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;