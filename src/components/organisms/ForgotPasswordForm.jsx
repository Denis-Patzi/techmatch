import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/atoms/FormField';
import { Link } from 'react-router-dom';

const resetSchema = z.object({
  email: z.string().email('Ingresá un correo válido'),
});

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Enlace de recuperación enviado');
    } catch (err) {
      toast.error('Ocurrió un error al intentar enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-14 h-14 bg-cyan/10 border border-cyan/25 rounded-2xl flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-slate-body mb-2">Revisá tu correo</h3>
        <p className="text-sm text-slate-sub mb-6">
          Te enviamos un enlace seguro para que puedas crear una nueva contraseña.
        </p>
        <Link to="/login" className="w-full py-3.5 rounded-xl font-bold text-navy bg-cyan hover:opacity-90 transition-all inline-block">
          Volver a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Correo Electrónico" name="email" type="email" placeholder="correo@ejemplo.com" register={register} error={errors.email} />

      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-3.5 rounded-xl font-bold text-navy bg-cyan mt-2
          hover:opacity-90 active:scale-[0.98] transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading && <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />}
        {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
      </button>
    </form>
  );
}
