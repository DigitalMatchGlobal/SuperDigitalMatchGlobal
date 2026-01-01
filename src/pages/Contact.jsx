import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { useTenant } from '@/contexts/TenantContext';

export const Contact = () => {
  const { tenant } = useTenant();
  const settings = tenant?.tenant_settings?.[0];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Helmet>
        <title>{tenant?.name} - Contacto</title>
        <meta name="description" content="Ponte en contacto con nosotros" />
      </Helmet>

      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Contáctanos</h1>
            <p className="text-gray-400 text-lg">Estamos aquí para ayudarte</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ContactForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>
                
                <div className="space-y-4">
                  {settings?.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <a href={`mailto:${settings.email}`} className="text-white hover:text-primary transition-colors">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Teléfono</p>
                        <a href={`tel:${settings.phone}`} className="text-white hover:text-primary transition-colors">
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings?.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Dirección</p>
                        <p className="text-white">{settings.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Horario de Atención</h3>
                <div className="space-y-2 text-gray-400">
                  <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                  <p>Sábado: 10:00 AM - 2:00 PM</p>
                  <p>Domingo: Cerrado</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};