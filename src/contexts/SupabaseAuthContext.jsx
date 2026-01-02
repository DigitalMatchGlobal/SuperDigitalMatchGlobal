import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const SupabaseAuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState({
    isSuperAdmin: false,
    tenantRoles: [] // Array of { tenant_id, role }
  });

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      // Check for Super Admin
      // Method 1: Check against hardcoded email (simplest for now)
      // Method 2: RPC call 'is_super_admin' (more secure if implemented in DB)
      
      let isSuperAdmin = false;
      const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL;
      
      if (superAdminEmail && currentUser.email === superAdminEmail) {
        isSuperAdmin = true;
      } else {
        // Fallback to DB check
        const { data } = await supabase.rpc('is_super_admin');
        isSuperAdmin = !!data;
      }

      // Load tenant roles
      const { data: tenantRoles } = await supabase
        .from('tenant_users')
        .select('tenant_id, role')
        .eq('user_id', currentUser.id)
        .eq('is_active', true);

      setRoles({
        isSuperAdmin,
        tenantRoles: tenantRoles || []
      });
    } else {
      setRoles({ isSuperAdmin: false, tenantRoles: [] });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    roles, // Export roles
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, roles, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};