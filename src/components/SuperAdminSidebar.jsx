import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

export const SuperAdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useSupabaseAuth();

  const menuItems = [
    { to: '/superadmin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/superadmin/tenants', icon: Building2, label: 'Tenants' },
    { to: '/superadmin/users', icon: Users, label: 'Usuarios Globales' },
    // { to: '/superadmin/settings', icon: Settings, label: 'Configuración' }
  ];

  const isActive = (path) => {
    if (path === '/superadmin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h2 className="text-2xl font-bold text-blue-500 tracking-tight">Super Admin</h2>
        <p className="text-xs text-slate-400 mt-1">DigitalMatch Global</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.to)
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive(item.to) ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <Button
          onClick={() => signOut()}
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut size={20} className="mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
};