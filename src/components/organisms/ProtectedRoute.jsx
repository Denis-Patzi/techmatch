import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute — Guardia de rutas
 * @param {string} requiredRole - Rol requerido ('buyer' | 'seller' | 'admin'). Si no se pasa, solo verifica sesión activa.
 */
export function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && profile?.role !== requiredRole) {
    // Si es admin intentando ir a buyer/seller, redirige al admin
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    // Si no tiene el rol correcto, va al perfil
    return <Navigate to="/profile" replace />;
  }

  return children;
}
