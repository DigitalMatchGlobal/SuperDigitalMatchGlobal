import React, { createContext, useContext, useState, useEffect } from 'react'
import { tenantsApi, TENANT_SLUG } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const TenantContext = createContext(null)

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTenant = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await tenantsApi.getBySlug(TENANT_SLUG)
      setTenant(data)
    } catch (err) {
      console.error('[Tenant] Error loading tenant:', err)
      setError(err.message || 'Failed to load tenant')
      setTenant(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenant()
    // preparado para cuando el slug deje de ser estático
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TENANT_SLUG])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">
            Error loading application
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadTenant}
            className="px-4 py-2 rounded bg-white text-black font-medium hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <TenantContext.Provider
      value={{
        tenant,
        loading,
        error,
        reload: loadTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}
