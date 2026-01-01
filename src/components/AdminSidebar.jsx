import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, Users, LogOut } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useSupabaseAuth();

  const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/catalog', icon: Package, label: 'Catálogo' },
    { to: '/admin/bookings', icon: Calendar, label: 'Reservas' },
    { to: '/admin/leads', icon: Users, label: 'Leads' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.to)
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <Button
          onClick={() => signOut()}
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <LogOut size={20} className="mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
};