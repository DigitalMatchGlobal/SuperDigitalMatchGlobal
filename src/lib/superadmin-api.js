import { supabase } from './supabase';

export const superAdminApi = {
  // Tenants Management
  async getAllTenants() {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        tenant_features(*),
        tenant_users(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTenantById(id) {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        tenant_features(*),
        tenant_settings(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createTenant(tenantData) {
    const { data, error } = await supabase
      .from('tenants')
      .insert({
        name: tenantData.name,
        slug: tenantData.slug,
        domain: tenantData.domain || null,
        description: tenantData.description,
        industry: tenantData.industry,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTenant(id, updates) {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTenant(id) {
    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('tenants')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Features Management
  async updateTenantFeatures(tenantId, features) {
    const { data, error } = await supabase
      .from('tenant_features')
      .upsert({ tenant_id: tenantId, ...features })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Users Management
  async getTenantUsers(tenantId) {
    const { data, error } = await supabase
      .from('tenant_users')
      .select(`
        *,
        user:user_id(email, raw_user_meta_data)
      `)
      .eq('tenant_id', tenantId);

    // Note: In a real scenario, accessing auth.users directly via client might be restricted.
    // Ideally this should be an RPC or Edge Function if direct access is blocked.
    // For this implementation, we assume the view/policy allows it or we use metadata.
    
    if (error) throw error;
    return data;
  },

  async createUserRole(tenantId, email, role) {
    // This usually requires an Edge Function to invite a user or assign role if user exists
    // Here we simulate the assignment assuming user ID is known or handled via invitation logic
    // For MVP/Demo: We'll assume the user exists in auth.users and we are mapping them.
    // Real implementation: Supabase Invite User API
    
    // For now, let's just return a placeholder or implement basic insert if user_id is provided
    // This part is tricky without an Edge Function for "invite by email"
    throw new Error("User creation requires Edge Function for Auth management.");
  },
  
  async updateUserRole(id, role, isActive) {
    const { data, error } = await supabase
      .from('tenant_users')
      .update({ role, is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};