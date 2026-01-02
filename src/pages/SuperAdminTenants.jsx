import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Edit, Trash2, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SuperAdminSidebar } from '@/components/SuperAdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { superAdminApi } from '@/lib/superadmin-api';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SuperAdminTenants = () => {
  const { toast } = useToast();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await superAdminApi.getAllTenants();
      setTenants(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los tenants',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Helmet>
        <title>Super Admin - Tenants</title>
      </Helmet>

      <SuperAdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Tenants</h1>
              <p className="text-slate-400">Gestión de organizaciones y clientes</p>
            </div>
            <Link to="/superadmin/tenants/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus size={20} />
                Nuevo Tenant
              </Button>
            </Link>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, slug o dominio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Organización</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Slug / Dominio</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Industria</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Estado</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTenants.map((tenant) => (
                      <motion.tr
                        key={tenant.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-xl font-bold text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-all">
                              {tenant.logo_url ? (
                                <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                tenant.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{tenant.name}</p>
                              <p className="text-slate-500 text-xs">{tenant.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                              <Shield size={14} className="text-slate-500" />
                              {tenant.slug}
                            </div>
                            {tenant.domain && (
                              <div className="flex items-center gap-2 text-blue-400 text-sm">
                                <Globe size={14} />
                                {tenant.domain}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">
                          {tenant.industry || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            tenant.is_active 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {tenant.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                              <Link to={`/superadmin/tenants/${tenant.id}`}>
                                <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar / Detalles</span>
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem className="focus:bg-red-900/20 focus:text-red-400 text-red-400 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Desactivar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};