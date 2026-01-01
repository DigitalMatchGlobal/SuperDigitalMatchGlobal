import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { catalogApi } from '@/lib/supabase';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/components/ui/use-toast';

export const AdminCatalog = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadItems();
  }, [tenant]);

  const loadItems = async () => {
    if (!tenant) return;

    try {
      setLoading(true);
      const data = await catalogApi.getItems(tenant.id);
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los items del catálogo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await catalogApi.deleteItem(id);
      toast({
        title: 'Item eliminado',
        description: 'El item ha sido eliminado correctamente.',
      });
      setDeleteConfirm(null);
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el item',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Helmet>
        <title>Admin - Catálogo</title>
        <meta name="description" content="Gestión del catálogo" />
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Catálogo</h1>
              <p className="text-gray-400">Gestiona tus productos y servicios</p>
            </div>
            <Button
              onClick={() => toast({
                title: '🚧 Función no implementada',
                description: '¡Puedes solicitarla en tu próximo prompt! 🚀'
              })}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Item
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No hay items en el catálogo</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Precio</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {items.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span>📦</span>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-gray-400 text-sm line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                          ${parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toast({
                                title: '🚧 Función no implementada',
                                description: '¡Puedes solicitarla en tu próximo prompt! 🚀'
                              })}
                              className="text-gray-400 hover:text-primary"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirm(item.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-sm"
          >
            <h3 className="text-lg font-bold text-white mb-4">Confirmar eliminación</h3>
            <p className="text-gray-400 mb-6">¿Estás seguro de que deseas eliminar este item? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1"
              >
                Eliminar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};