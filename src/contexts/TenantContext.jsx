import React, { createContext, useContext, useState, useEffect } from 'react';
import { tenantsApi, supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const TenantContext = createContext(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTenant();
  }, []);

  const loadTenant = async () => {
    try {
      setLoading(true);
      
      // 1. Try to resolve by domain
      const hostname = window.location.hostname;
      // Skip localhost domain check for dev unless specifically testing local domains
      const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      
      let data = null;

      if (!isLocal) {
        const { data: domainData } = await supabase
          .from('tenants')
          .select(`*, tenant_settings(*), tenant_features(*)`)
          .eq('domain', hostname)
          .eq('is_active', true)
          .maybeSingle();
        
        if (domainData) {
          data = domainData;
        }
      }

      // 2. Fallback to SLUG from env if no domain match or if localhost
      if (!data) {
        const fallbackSlug = import.meta.env.VITE_TENANT_SLUG || 'vicky';
        data = await tenantsApi.getBySlug(fallbackSlug);
      }

      setTenant(data);
    } catch (err) {
      console.error('Error loading tenant:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Application</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ tenant, loading, error, reload: loadTenant }}>
      {children}
    </TenantContext.Provider>
  );
};