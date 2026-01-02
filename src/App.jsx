import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider } from '@/contexts/TenantContext';
import { SupabaseAuthProvider, useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Toaster } from '@/components/ui/toaster';

import { Home } from '@/pages/Home';
import { Catalog } from '@/pages/Catalog';
import { ProductDetail } from '@/pages/ProductDetail';
import { Contact } from '@/pages/Contact';
import { Login } from '@/pages/Login';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminCatalog } from '@/pages/AdminCatalog';
import { AdminBookings } from '@/pages/AdminBookings';
import { AdminLeads } from '@/pages/AdminLeads';

// Super Admin Pages
import { SuperAdminDashboard } from '@/pages/SuperAdminDashboard';
import { SuperAdminTenants } from '@/pages/SuperAdminTenants';
import { SuperAdminTenantDetail } from '@/pages/SuperAdminTenantDetail';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const SuperAdminRoute = ({ children }) => {
  const { user, loading, roles } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !roles.isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <SupabaseAuthProvider>
        <TenantProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Tenant Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/catalog"
              element={
                <ProtectedRoute>
                  <AdminCatalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute>
                  <AdminLeads />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Routes */}
            <Route
              path="/superadmin"
              element={
                <SuperAdminRoute>
                  <SuperAdminDashboard />
                </SuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/tenants"
              element={
                <SuperAdminRoute>
                  <SuperAdminTenants />
                </SuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/tenants/:id"
              element={
                <SuperAdminRoute>
                  <SuperAdminTenantDetail />
                </SuperAdminRoute>
              }
            />
            {/* Add more super admin routes as needed like /superadmin/users */}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </TenantProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  );
}

export default App;