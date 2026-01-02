import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check, X } from 'lucide-react';
import { SuperAdminSidebar } from '@/components/SuperAdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { superAdminApi } from '@/lib/superadmin-api';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch'; // Note: Assuming shadcn Switch or checkbox if not available

// Simple Checkbox component if Switch isn't available
const FeatureToggle = ({ label, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
    <span className="text-slate-200 font-medium">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

export const SuperAdminTenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [features, setFeatures] = useState({
    catalog: false,
    bookings: false,
    members: false,
    payments: false,
    analytics: false
  });
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    description: '',
    industry: ''
  });

  useEffect(() => {
    if (id !== 'new') {
      loadTenant();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      const data = await superAdminApi.getTenantById(id);
      setTenant(data);
      setFormData({
        name: data.name,
        slug: data.slug,
        domain: data.domain || '',
        description: data.description || '',
        industry: data.industry || ''
      });
      if (data.tenant_features?.[0]) {
        const feat = data.tenant_features[0];
        setFeatures({
          catalog: feat.catalog || false,
          bookings: feat.bookings || false,
          members: feat.members || false,
          payments: feat.payments || false,
          analytics: feat.analytics || false
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el tenant',
        variant: 'destructive'
      });
      navigate('/superadmin/tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let tenantId = id;
      
      if (id === 'new') {
        const newTenant = await superAdminApi.createTenant(formData);
        tenantId = newTenant.id;
      } else {
        await superAdminApi.updateTenant(id, formData);
      }

      await superAdminApi.updateTenantFeatures(tenantId, features);

      toast({
        title: 'Guardado',
        description: 'El tenant ha sido guardado correctamente',
      });
      
      if (id === 'new') {
        navigate(`/superadmin/tenants/${tenantId}`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Helmet>
        <title>Super Admin - {id === 'new' ? 'Nuevo Tenant' : tenant?.name}</title>
      </Helmet>

      <SuperAdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/superadmin/tenants')} className="text-slate-400">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-bold text-white">
              {id === 'new' ? 'Crear Nuevo Tenant' : `Editar: ${tenant?.name}`}
            </h1>
          </div>

          <div className="grid gap-8">
            {/* General Info */}
            <section className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Información General
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nombre de la Organización</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Industria</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Slug (Identificador URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Ej: vicky (digitalmatch.com/vicky)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Dominio Personalizado</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    placeholder="ejemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Descripción</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Features Toggle */}
            <section className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                Features & Módulos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FeatureToggle 
                  label="Catálogo" 
                  checked={features.catalog} 
                  onChange={(v) => setFeatures({...features, catalog: v})} 
                />
                <FeatureToggle 
                  label="Reservas (Bookings)" 
                  checked={features.bookings} 
                  onChange={(v) => setFeatures({...features, bookings: v})} 
                />
                <FeatureToggle 
                  label="Membresías" 
                  checked={features.members} 
                  onChange={(v) => setFeatures({...features, members: v})} 
                />
                <FeatureToggle 
                  label="Pagos Online" 
                  checked={features.payments} 
                  onChange={(v) => setFeatures({...features, payments: v})} 
                />
                <FeatureToggle 
                  label="Analíticas" 
                  checked={features.analytics} 
                  onChange={(v) => setFeatures({...features, analytics: v})} 
                />
              </div>
            </section>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate('/superadmin/tenants')} className="text-slate-300 border-slate-700 hover:bg-slate-800">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 min-w-[140px]">
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};