import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/atoms/FormField';

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updatePassword(data.password);
      toast.success('¡Contraseña actualizada correctamente!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Nueva Contraseña" name="password" type="password" placeholder="Mín. 8 caracteres con números" register={register} error={errors.password} />
      <FormField label="Confirmar Nueva Contraseña" name="confirmPassword" type="password" placeholder="Repetí tu contraseña" register={register} error={errors.confirmPassword} />

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
        {loading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
      </button>
    </form>
  );
}
