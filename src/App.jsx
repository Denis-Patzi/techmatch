import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';
import { ScrollProgress } from '@/components/atoms/ScrollProgress';

/* ── Auth ── */
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/organisms/ProtectedRoute';

/* ── Organisms (Landing) ── */
import { Navbar } from '@/components/organisms/Navbar';
import { HeroSection } from '@/components/organisms/HeroSection';
import { SocialFeedSection } from '@/components/organisms/SocialFeedSection';
import { ProfilesSection } from '@/components/organisms/ProfilesSection';
import { AIAssistantSection } from '@/components/organisms/AIAssistantSection';
import { AuctionsSection } from '@/components/organisms/AuctionsSection';
import { HowItWorksSection } from '@/components/organisms/HowItWorksSection';
import { LandingJoinSection } from '@/components/organisms/LandingJoinSection';
import { Footer } from '@/components/organisms/Footer';

/* ── Pages (lazy load) ── */
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const SellerPage = lazy(() => import('@/pages/SellerPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const UpdatePasswordPage = lazy(() => import('@/pages/UpdatePasswordPage'));

/* ── Spinner de carga ── */
const PageSpinner = () => (
  <div className="min-h-screen bg-navy flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
  </div>
);

/* ── Back-to-top ── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="btt"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="
            fixed bottom-6 right-6 z-50
            w-11 h-11 icon-button
            flex items-center justify-center text-cyan
            transition-colors duration-150
          "
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ── Landing Page ── */
function LandingPage({ isDark, onToggleTheme }) {
  const rootRef = useRef(null);
  useScrollReveal(rootRef);
  useLiquidGlass(rootRef);
  return (
    <div className="landing-page" ref={rootRef}>
      <ScrollProgress />
      <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />
      <main id="main-content">
        <HeroSection />
        <SocialFeedSection />
        <ProfilesSection />
        <AIAssistantSection />
        <AuctionsSection />
        <HowItWorksSection />
        <LandingJoinSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

/* ── App Root ── */
export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications globales */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgb(var(--c-navy-light))',
              color: 'rgb(var(--c-slate-body))',
              border: '1px solid rgb(var(--c-cyan) / .2)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#1C75E8', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#0D1118' } },
          }}
        />

        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage isDark={isDark} onToggleTheme={toggleTheme} />} />

            {/* Auth */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />

            {/* Protegidas */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller"
              element={
                <ProtectedRoute requiredRole="seller">
                  <SellerPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
