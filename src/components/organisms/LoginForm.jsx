import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { FormField } from '@/components/atoms/FormField';
import { TwoFactorInput } from '@/components/molecules/TwoFactorInput';

/* ── Esquemas Zod ── */
const credentialsSchema = z.object({
  email: z.string().email('Ingresá un correo válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

const TIMER_SECONDS = 60;

export function LoginForm() {
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [otpEmail, setOtpEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, verifyOtp, profile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(credentialsSchema),
  });

  /* ── Timer de cuenta regresiva ── */
  useEffect(() => {
    if (step !== 'otp') return;
    setTimer(TIMER_SECONDS);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  /* ── Paso 1: Verificar credenciales ── */
  const onCredentials = async (data) => {
    setLoading(true);
    try {
      const authData = await signIn(data.email, data.password);
      toast.success('¡Sesión iniciada!');

      // Obtenemos el perfil directamente para saber a dónde redirigir sin esperar al context
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileData?.role === 'admin') {
        navigate('/admin');
      } else if (profileData?.role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      if (err.message?.includes('Email not confirmed')) {
        toast.error('Tenés que confirmar tu correo primero (revisá tu bandeja de entrada)');
      } else {
        toast.error(err.message || 'Email o contraseña incorrectos');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Paso 2: Verificar OTP ── */
  const onVerifyOtp = async () => {
    if (otpValue.trim().length !== 6) {
      toast.error('Ingresá el código completo de 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(otpEmail, otpValue.trim());
      // Redirige según el rol
      if (profile?.role === 'admin') navigate('/admin');
      else navigate('/profile');
    } catch (err) {
      if (err.message?.includes('expired')) {
        toast.error('Código expirado. Solicitá uno nuevo.');
      } else {
        toast.error('Código inválido. Verificá e intentá de nuevo.');
      }
      setOtpValue('');
    } finally {
      setLoading(false);
    }
  };

  /* ── Reenviar código ── */
  const resendCode = async () => {
    setLoading(true);
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      await supabase.auth.signInWithOtp({ email: otpEmail });
      toast.success('Código reenviado. Revisá tu correo.');
      setTimer(TIMER_SECONDS);
      setCanResend(false);
    } catch {
      toast.error('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* ── Paso 1: Credenciales ── */}
      {step === 'credentials' && (
        <motion.form
          key="credentials"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit(onCredentials)}
          className="flex flex-col gap-4"
        >
          <FormField
            label="Correo Electrónico"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            register={register}
            error={errors.email}
          />
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            register={register}
            error={errors.password}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-cyan hover:opacity-75 transition-opacity"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3.5 rounded-xl font-bold text-navy bg-cyan mt-1
              hover:opacity-90 active:scale-[0.98] transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
        </motion.form>
      )}

      {/* ── Paso 2: Código OTP ── */}
      {step === 'otp' && (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-5"
        >
          {/* Header */}
          <div className="text-center">
            <div className="bare-icon w-14 h-14 text-cyan flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-cyan"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <p className="text-sm text-slate-sub">
              Enviamos un código de 6 dígitos a<br />
              <span className="font-semibold text-slate-body">{otpEmail}</span>
            </p>
          </div>

          {/* Input OTP */}
          <TwoFactorInput value={otpValue} onChange={setOtpValue} />

          {/* Timer */}
          <p className="text-xs text-slate-muted">
            {canResend ? null : (
              <>
                El código expira en <span className="text-cyan font-bold">{timer}s</span>
              </>
            )}
          </p>

          {/* Verificar */}
          <button
            onClick={onVerifyOtp}
            disabled={loading || otpValue.trim().length !== 6}
            className="
              w-full py-3.5 rounded-xl font-bold text-navy bg-cyan
              hover:opacity-90 active:scale-[0.98] transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>

          {/* Reenviar / Volver */}
          <div className="flex gap-2 text-sm">
            {canResend && (
              <button
                onClick={resendCode}
                className="text-cyan hover:opacity-75 font-medium transition-opacity py-2 px-3 rounded-lg"
              >
                Reenviar código
              </button>
            )}
            <button
              onClick={() => {
                setStep('credentials');
                setOtpValue('');
              }}
              className="text-slate-muted hover:text-slate-sub transition-colors py-2 px-3 rounded-lg"
            >
              ← Volver
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
