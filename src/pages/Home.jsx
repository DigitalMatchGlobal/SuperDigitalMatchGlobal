import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const Home = () => {
  const { tenant } = useTenant();

  const features = [
    {
      icon: Package,
      title: 'Catálogo Completo',
      description: 'Explora nuestra amplia gama de servicios y productos disponibles.'
    },
    {
      icon: Calendar,
      title: 'Reservas Fáciles',
      description: 'Sistema de reservas intuitivo y rápido para tu comodidad.'
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Equipo dedicado para brindarte la mejor experiencia.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Helmet>
        <title>{tenant?.name || 'DigitalMatch'} - Inicio</title>
        <meta name="description" content={tenant?.description || 'Plataforma de gestión multi-tenant'} />
      </Helmet>

      <Navbar />

      <main className="flex-1">
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Bienvenido a <span className="text-primary">{tenant?.name}</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {tenant?.description || 'Tu plataforma digital para gestión de servicios y reservas'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalog">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                    Ver Catálogo
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    Contáctanos
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">¿Por qué elegirnos?</h2>
              <p className="text-gray-400 text-lg">Descubre las ventajas de nuestra plataforma</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-primary transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};