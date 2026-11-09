import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);
const EMPTY_PROFILE = { userId: null, value: null, error: null };

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;
  // The migration provides a safe fallback for accounts without a profiles row.
  const result = await supabase.rpc('ensure_my_profile');
  if (result.error) throw result.error;
  const profile = Array.isArray(result.data) ? result.data[0] : result.data;
  if (!profile || profile.id !== userId) throw new Error('No se pudo recuperar el perfil.');
  return profile;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [profileState, setProfileState] = useState(EMPTY_PROFILE);
  const userIdRef = useRef(null);
  userIdRef.current = user?.id ?? null;

  useEffect(() => {
    let active = true;
    let eventSeen = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      eventSeen = true;
      // Keep this callback synchronous; profile requests run in a separate effect.
      setUser(session?.user ?? null);
      setSessionReady(true);
    });
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || eventSeen) return;
        setUser(error ? null : (data.session?.user ?? null));
        setSessionReady(true);
      })
      .catch(() => {
        if (active && !eventSeen) {
          setUser(null);
          setSessionReady(true);
        }
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!user?.id) {
      setProfileState(EMPTY_PROFILE);
      return;
    }
    const userId = user.id;
    loadProfile(userId)
      .then((value) => {
        if (active) setProfileState({ userId, value, error: null });
      })
      .catch((error) => {
        if (active) setProfileState({ userId, value: null, error });
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    const userId = user.id;
    setProfileState(EMPTY_PROFILE);
    try {
      const value = await loadProfile(userId);
      if (userIdRef.current === userId) setProfileState({ userId, value, error: null });
    } catch (error) {
      if (userIdRef.current === userId) setProfileState({ userId, value: null, error });
    }
  }, [user?.id]);

  const signUp = async ({
    email,
    password,
    fullName,
    phone,
    accountType = 'personal',
    storeName,
    nit,
    city,
  }) => {
    const store = accountType === 'store';
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'buyer',
          full_name: fullName,
          phone,
          city,
          account_type: store ? 'store' : 'personal',
          store_name: store ? storeName : null,
          nit: store ? nit : null,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };
  const verifyOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) throw error;
    return data;
  };
  const updateProfile = async (updates) => {
    if (!user?.id) throw new Error('Ingresá a tu cuenta para guardar cambios.');
    const allowed = ['full_name', 'phone', 'city', 'account_type', 'store_name', 'nit'];
    const values = Object.fromEntries(
      allowed.filter((key) => Object.hasOwn(updates, key)).map((key) => [key, updates[key]])
    );
    const { data, error } = await supabase
      .from('profiles')
      .update(values)
      .eq('id', user.id)
      .select('*')
      .single();
    if (error) throw error;
    if (userIdRef.current === user.id)
      setProfileState({ userId: user.id, value: data, error: null });
    return data;
  };
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
  };
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfileState(EMPTY_PROFILE);
  };
  const profile = profileState.userId === user?.id ? profileState.value : null;
  const profileError = profileState.userId === user?.id ? profileState.error : null;
  const loading = !sessionReady || Boolean(user && profileState.userId !== user.id);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        profileError,
        loading,
        refreshProfile,
        signUp,
        signIn,
        verifyOtp,
        updateProfile,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
