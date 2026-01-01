import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookingsApi } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const BookingForm = ({ catalogItem, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await bookingsApi.create({
        ...formData,
        catalog_item_id: catalogItem.id
      });

      if (result.success) {
        toast({
          title: '¡Reserva creada!',
          description: 'Tu reserva ha sido enviada correctamente. Te contactaremos pronto.',
        });
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          booking_date: '',
          start_time: '',
          end_time: '',
          notes: ''
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error || 'Error al crear la reserva');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear la reserva. Por favor intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Reservar {catalogItem.name}</h3>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <User size={18} />
            Nombre completo
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Mail size={18} />
            Email
          </label>
          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Phone size={18} />
            Teléfono
          </label>
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Calendar size={18} />
            Fecha
          </label>
          <input
            type="date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Clock size={18} />
              Hora inicio
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Clock size={18} />
              Hora fin
            </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <MessageSquare size={18} />
            Notas adicionales
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
        >
          {loading ? 'Enviando...' : 'Confirmar Reserva'}
        </Button>
      </div>
    </motion.form>
  );
};