import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, Users, Activity, Globe } from 'lucide-react';
import { SuperAdminSidebar } from '@/components/SuperAdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { superAdminApi } from '@/lib/superadmin-api';

export const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0 // Placeholder as we might not have global user count easily without RPC
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const tenants = await superAdminApi.getAllTenants();
      
      setStats({
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.is_active).length,
        totalUsers: tenants.reduce((acc, curr) => acc + (curr.tenant_users?.[0]?.count || 0), 0)
      });
    } catch (error) {
      console.error('Error loading superadmin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Tenants', value: stats.totalTenants, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Tenants Activos', value: stats.activeTenants, icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Usuarios Totales', value: stats.totalUsers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Dominios Conectados', value: stats.activeTenants, icon: Globe, color: 'text-orange-400', bg: 'bg-orange-400/10' }, // Approximation
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Helmet>
        <title>Super Admin - Dashboard</title>
      </Helmet>

      <SuperAdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Global Dashboard</h1>
            <p className="text-slate-400">Visión general de la plataforma DigitalMatch</p>
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
                    className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <Icon size={24} className={stat.color} />
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm font-medium block mb-1">{stat.title}</span>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
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