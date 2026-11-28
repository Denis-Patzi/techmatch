import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PublicFeedPage from './PublicFeedPage';

/**
 * Email sign-in appears over Explore, matching the public access flow.
 */
export default function LoginPage() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="market-loading" role="status">
        Cargando…
      </div>
    );
  if (user) return <Navigate to="/app" replace />;
  return <PublicFeedPage emailLogin />;
}
