import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

const AuthContext = createContext(undefined)

export const SupabaseAuthProvider = ({ children }) => {
  const { toast } = useToast()

  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Centraliza el manejo de sesión
   */
  const handleSession = useCallback((session) => {
    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)
  }, [])

  /**
   * Bootstrap de sesión + listener de cambios
   */
  useEffect(() => {
    let isMounted = true

    const bootstrapSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (isMounted) {
          handleSession(data?.session ?? null)
        }
      } catch (err) {
        console.error('[Auth] getSession failed:', err)
        if (isMounted) {
          handleSession(null)
        }
      }
    }

    bootstrapSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [handleSession])

  /**
   * Auth actions
   */
  const signUp = useCallback(
    async (email, password, options = {}) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options,
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign up failed',
          description: error.message || 'Something went wrong',
        })
      }

      return { error }
    },
    [toast]
  )

  const signIn = useCallback(
    async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign in failed',
          description: error.message || 'Something went wrong',
        })
      }

      return { error }
    },
    [toast]
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: error.message || 'Something went wrong',
      })
    }

    return { error }
  }, [toast])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }),
    [user, session, loading, signUp, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(
      'useSupabaseAuth must be used within a SupabaseAuthProvider'
    )
  }
  return context
}
