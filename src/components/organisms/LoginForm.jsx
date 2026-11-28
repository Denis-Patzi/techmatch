import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/atoms/FormField';
import { TwoFactorInput } from '@/components/molecules/TwoFactorInput';

/* ── Esquemas Zod ── */
const credentialsSchema = z.object({
  email: z.string().email('Ingresá un correo válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

const TIMER_SECONDS = 60;

export function LoginForm({ redirectTo = '/app', variant = 'default' }) {
  const social = variant === 'social';
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
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
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(credentialsSchema),
    mode: social ? 'onChange' : 'onSubmit',
    defaultValues: { email: '', password: '' },
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
    setLoginError('');
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('¡Sesión iniciada!');

      // El guard espera el perfil y envía al administrador a su propio espacio.
      navigate(redirectTo);
    } catch (err) {
      console.error(err);
      if (err.message?.includes('Email not confirmed')) {
        setLoginError(
          'Confirmá tu correo antes de ingresar. Revisá tu bandeja de entrada.'
        );
        toast.error(
          'Tenés que confirmar tu correo primero (revisá tu bandeja de entrada)'
        );
      } else {
        setLoginError(
          err.message?.includes('Invalid login credentials')
            ? 'Correo o contraseña incorrectos. Revisá tus datos e intentá de nuevo.'
            : 'No pudimos iniciar sesión. Volvé a intentarlo.'
        );
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
      else navigate(redirectTo);
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
          className={social ? 'social-login-form' : 'flex flex-col gap-4'}
        >
          <FormField
            label="Correo Electrónico"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            register={register}
            error={errors.email}
          >
            {social ? (
              <input
                {...register('email')}
                type="email"
                inputMode="email"
                autoComplete="username"
                placeholder="Correo electrónico"
                className="social-login-input"
              />
            ) : undefined}
          </FormField>
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            register={register}
            error={errors.password}
          >
            {social ? (
              <div id="social-password-field" className="social-login-password">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  aria-invalid={Boolean(errors.password) || undefined}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  className="social-login-input"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    {!showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </button>
              </div>
            ) : undefined}
          </FormField>

          {!social && (
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-cyan hover:opacity-75 transition-opacity"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}

          {loginError && (
            <p role="alert" className="text-sm text-red-500">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || (social && !isValid)}
            className={
              social
                ? 'social-login-submit'
                : `
              w-full py-3.5 rounded-xl font-bold text-navy bg-cyan mt-1
              hover:opacity-90 active:scale-[0.98] transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            `
            }
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
          {social && (
            <Link to="/forgot-password" className="social-login-forgot">
              ¿Olvidaste tu contraseña?
            </Link>
          )}
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
                El código expira en{' '}
                <span className="text-cyan font-bold">{timer}s</span>
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
