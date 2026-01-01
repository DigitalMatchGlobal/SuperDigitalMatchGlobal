import { createClient } from '@supabase/supabase-js'

// =======================
// Supabase client (único)
// =======================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env / Vercel env vars.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =======================
// Multitenant
// =======================
export const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || 'digitalmatch'

// =======================
// Catalog API
// =======================
export const catalogApi = {
  async getItems(tenantId) {
    const { data, error } = await supabase
      .from('catalog_items')
      .select(`
        *,
        catalog_item_categories(
          category_id,
          catalog_categories(*)
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data
  },

  async getItemById(id) {
    const { data, error } = await supabase
      .from('catalog_items')
      .select(`
        *,
        catalog_item_categories(
          category_id,
          catalog_categories(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createItem(item) {
    const { data, error } = await supabase
      .from('catalog_items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateItem(id, updates) {
    const { data, error } = await supabase
      .from('catalog_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteItem(id) {
    const { error } = await supabase
      .from('catalog_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// =======================
// Bookings API
// =======================
export const bookingsApi = {
  async getAll(tenantId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        catalog_items(name),
        people(name, email)
      `)
      .eq('tenant_id', tenantId)
      .order('booking_date', { ascending: false })

    if (error) throw error
    return data
  },

  async create(booking) {
    const { data, error } = await supabase.rpc('public_create_booking', {
      tenant_slug: TENANT_SLUG,
      catalog_item_id_param: booking.catalog_item_id,
      customer_name_param: booking.customer_name,
      customer_email_param: booking.customer_email,
      customer_phone_param: booking.customer_phone || null,
      booking_date_param: booking.booking_date,
      start_time_param: booking.start_time,
      end_time_param: booking.end_time,
      notes_param: booking.notes || null,
    })

    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// =======================
// Leads API
// =======================
export const leadsApi = {
  async getAll(tenantId) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(lead) {
    const { data, error } = await supabase.rpc('public_create_lead', {
      tenant_slug: TENANT_SLUG,
      name_param: lead.name,
      email_param: lead.email,
      phone_param: lead.phone || null,
      message_param: lead.message || null,
      source_param: lead.source || 'web',
    })

    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// =======================
// Tenants API
// =======================
export const tenantsApi = {
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        tenant_settings(*),
        tenant_features(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },
}

// =======================
// Categories API
// =======================
export const categoriesApi = {
  async getAll(tenantId) {
    const { data, error } = await supabase
      .from('catalog_categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data
  },
}
