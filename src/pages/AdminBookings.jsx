import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { bookingsApi } from '@/lib/supabase';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/components/ui/use-toast';

export const AdminBookings = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [tenant]);

  const loadBookings = async () => {
    if (!tenant) return;

    try {
      setLoading(true);
      const data = await bookingsApi.getAll(tenant.id);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reservas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingsApi.updateStatus(id, newStatus);
      toast({
        title: 'Estado actualizado',
        description: `La reserva ha sido marcada como ${newStatus}`,
      });
      loadBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      completed: 'bg-blue-500/20 text-blue-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Helmet>
        <title>Admin - Reservas</title>
        <meta name="description" content="Gestión de reservas" />
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reservas</h1>
            <p className="text-gray-400">Gestiona todas las reservas del sistema</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No hay reservas registradas</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {booking.catalog_items?.name || 'Servicio'}
                        </h3>
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-400">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          <span>{booking.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-primary" />
                          <span>{booking.customer_email}</span>
                        </div>
                        {booking.customer_phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-primary" />
                            <span>{booking.customer_phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          <span>{booking.start_time} - {booking.end_time}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <p className="text-gray-400 text-sm bg-gray-700/50 p-3 rounded-lg">
                          {booking.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            variant="destructive"
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};