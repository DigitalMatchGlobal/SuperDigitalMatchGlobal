import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, User, LogOut } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { tenant } = useTenant();
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalog', label: 'Catálogo' },
    { to: '/contact', label: 'Contacto' }
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-8 w-auto" />
            ) : (
              <span className="text-2xl font-bold text-primary">{tenant?.name || 'DigitalMatch'}</span>
            )}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <User size={18} />
                  Admin
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-primary"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn size={18} />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-primary transition-colors duration-200 py-2"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-300 hover:text-primary transition-colors duration-200 py-2"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-300 hover:text-primary transition-colors duration-200 py-2"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-primary transition-colors duration-200 py-2"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};