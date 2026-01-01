import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';

export const Footer = () => {
  const { tenant } = useTenant();
  const settings = tenant?.tenant_settings?.[0];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">{tenant?.name}</h3>
            <p className="text-gray-400 mb-4">{tenant?.description}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3">
              {settings?.email && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={18} className="text-primary" />
                  <span>{settings.email}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={18} className="text-primary" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} className="text-primary" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces</h4>
            <div className="space-y-2">
              <a href="/" className="block text-gray-400 hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="/catalog" className="block text-gray-400 hover:text-primary transition-colors">
                Catálogo
              </a>
              <a href="/contact" className="block text-gray-400 hover:text-primary transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {tenant?.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};