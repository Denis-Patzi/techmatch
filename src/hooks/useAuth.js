import { useAuthContext } from '@/contexts/AuthContext';

/**
 * useAuth — Hook
 * Acceso simple al contexto de autenticación desde cualquier componente.
 */
export function useAuth() {
  return useAuthContext();
}
