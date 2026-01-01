import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { leadsApi } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await leadsApi.create({
        ...formData,
        source: 'contact_form'
      });

      if (result.success) {
        toast({
          title: '¡Mensaje enviado!',
          description: 'Gracias por contactarnos. Te responderemos pronto.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar el mensaje. Por favor intenta nuevamente.',
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
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-6">Contáctanos</h2>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <User size={18} />
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Mail size={18} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Phone size={18} />
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <MessageSquare size={18} />
            Mensaje
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 flex items-center justify-center gap-2"
        >
          {loading ? 'Enviando...' : (
            <>
              <Send size={18} />
              Enviar Mensaje
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};