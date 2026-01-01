import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingForm } from '@/components/BookingForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { catalogApi } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export const ProductDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await catalogApi.getItemById(id);
      setItem(data);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Servicio no encontrado</h2>
            <Link to="/catalog">
              <Button>Volver al catálogo</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Helmet>
        <title>{item.name} - Detalle</title>
        <meta name="description" content={item.description} />
      </Helmet>

      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8">
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-700">
                    <span className="text-8xl">📦</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h1 className="text-3xl font-bold text-white mb-4">{item.name}</h1>
                <p className="text-gray-300 mb-6">{item.description}</p>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-primary">
                    <DollarSign size={24} />
                    <span className="text-2xl font-bold">${parseFloat(item.price).toFixed(2)}</span>
                  </div>
                  {item.duration_minutes && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={20} />
                      <span>{item.duration_minutes} minutos</span>
                    </div>
                  )}
                </div>

                {item.capacity && (
                  <div className="text-gray-400">
                    <span className="font-semibold">Capacidad:</span> {item.capacity} personas
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {item.is_bookable ? (
                <BookingForm catalogItem={item} />
              ) : (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Este servicio no está disponible para reservas</h3>
                  <p className="text-gray-400 mb-6">
                    Para más información sobre este servicio, por favor contáctanos.
                  </p>
                  <Link to="/contact">
                    <Button className="w-full">Contactar</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};