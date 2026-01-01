import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Package, Calendar, Users, TrendingUp } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { catalogApi, bookingsApi, leadsApi } from '@/lib/supabase';
import { useTenant } from '@/contexts/TenantContext';

export const AdminDashboard = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalBookings: 0,
    totalLeads: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    loadStats();
  }, [tenant]);

  const loadStats = async () => {
    if (!tenant) return;

    try {
      setLoading(true);
      const [items, bookings, leads] = await Promise.all([
        catalogApi.getItems(tenant.id),
        bookingsApi.getAll(tenant.id),
        leadsApi.getAll(tenant.id)
      ]);

      setStats({
        totalItems: items.length,
        totalBookings: bookings.length,
        totalLeads: leads.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      color: 'text-blue-400'
    },
    {
      title: 'Total Reservas',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-green-400'
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'text-purple-400'
    },
    {
      title: 'Reservas Pendientes',
      value: stats.pendingBookings,
      icon: TrendingUp,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Helmet>
        <title>Admin - Dashboard</title>
        <meta name="description" content="Panel de administración" />
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Resumen general del sistema</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm font-medium">{stat.title}</span>
                      <Icon size={24} className={stat.color} />
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};