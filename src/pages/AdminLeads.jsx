import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { leadsApi } from '@/lib/supabase';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/components/ui/use-toast';

export const AdminLeads = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, [tenant]);

  const loadLeads = async () => {
    if (!tenant) return;

    try {
      setLoading(true);
      const data = await leadsApi.getAll(tenant.id);
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadsApi.updateStatus(id, newStatus);
      toast({
        title: 'Estado actualizado',
        description: `El lead ha sido marcado como ${newStatus}`,
      });
      loadLeads();
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
      new: 'bg-blue-500/20 text-blue-400',
      contacted: 'bg-yellow-500/20 text-yellow-400',
      qualified: 'bg-purple-500/20 text-purple-400',
      converted: 'bg-green-500/20 text-green-400',
      lost: 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Helmet>
        <title>Admin - Leads</title>
        <meta name="description" content="Gestión de leads" />
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
            <p className="text-gray-400">Gestiona todos los contactos del sistema</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No hay leads registrados</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {leads.map((lead) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {lead.source}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-primary" />
                          <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-primary" />
                            <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {lead.message && (
                        <div className="flex items-start gap-2 bg-gray-700/50 p-3 rounded-lg">
                          <MessageSquare size={16} className="text-primary mt-1 flex-shrink-0" />
                          <p className="text-gray-400 text-sm">{lead.message}</p>
                        </div>
                      )}

                      <p className="text-gray-500 text-xs">
                        Creado: {new Date(lead.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="qualified">Calificado</option>
                        <option value="converted">Convertido</option>
                        <option value="lost">Perdido</option>
                      </select>
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