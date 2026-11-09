import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * ProtectedRoute — Guardia de rutas
 * @param {string} requiredRole - 'user' admite buyer/seller; 'admin' conserva administración separada.
 */
export function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, profileError, loading, refreshProfile, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (profileError || !profile)
    return (
      <div className="min-h-screen bg-navy grid place-items-center p-6">
        <div className="glass-panel empty-state" role="alert">
          <h1>No pudimos cargar tu perfil.</h1>
          <p>Tu sesión está abierta. Reintentá la carga o volvé a ingresar a tu cuenta.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={refreshProfile} className="btn-primary">
              Reintentar
            </button>
            <button
              type="button"
              onClick={() =>
                signOut().catch(() => toast.error('No pudimos cerrar la sesión. Intentá de nuevo.'))
              }
              className="btn-secondary"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );

  if (requiredRole === 'user') {
    if (profile.role === 'admin') return <Navigate to="/admin" replace />;
    if (profile.role === 'buyer' || profile.role === 'seller') return children;
    return <Navigate to="/" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Si es admin intentando ir a buyer/seller, redirige al admin
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    // Si no tiene el rol correcto, va al perfil
    return <Navigate to="/app" replace />;
  }

  return children;
}
