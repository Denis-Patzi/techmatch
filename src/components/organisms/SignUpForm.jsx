import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { RoleSelector } from '@/components/molecules/RoleSelector';
import { FormField } from '@/components/atoms/FormField';

/* ── Esquema de validación con Zod ── */
const baseSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresá un correo electrónico válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
  storeName: z.string().optional(),
  nit: z.string().optional(),
});

const signUpSchema = baseSchema.refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const CITIES = ['La Paz', 'Santa Cruz', 'Cochabamba'];

export function SignUpForm() {
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({ ...data, role });
      toast.success('¡Cuenta creada correctamente!');
      
      // Dependiendo del rol, lo mandamos al flujo correcto
      if (role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      toast.error(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Selector de Rol */}
      <RoleSelector value={role} onChange={setRole} />

      {/* Campos base */}
      <FormField label="Nombre Completo" name="fullName" placeholder="Denis Patzi" register={register} error={errors.fullName} />
      <FormField label="Correo Electrónico" name="email" type="email" placeholder="correo@ejemplo.com" register={register} error={errors.email} />
      <FormField label="Contraseña" name="password" type="password" placeholder="Mín. 8 caracteres con números" register={register} error={errors.password} />
      <FormField label="Confirmar Contraseña" name="confirmPassword" type="password" placeholder="Repetí tu contraseña" register={register} error={errors.confirmPassword} />
      <FormField label="Teléfono (opcional)" name="phone" placeholder="+591 7xxxxxxx" register={register} error={errors.phone} />

      {/* Selector de Ciudad */}
      <FormField label="Ciudad" name="city" error={errors.city}>
        <select
          {...register('city')}
          className="w-full px-4 py-3 rounded-xl bg-navy-light border border-cyan/15 text-slate-body text-sm focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/10 transition-all duration-150"
        >
          <option value="">Seleccioná tu ciudad</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </FormField>

      {/* Campos extra solo para Vendedores */}
      <AnimatePresence>
        {role === 'seller' && (
          <motion.div
            key="seller-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <div className="border-t border-cyan/10 pt-4">
              <p className="text-xs text-slate-muted mb-3 font-semibold uppercase tracking-widest">Datos de tu tienda</p>
              <div className="flex flex-col gap-4">
                <FormField label="Nombre de la Tienda" name="storeName" placeholder="Ej: TechStore Bolivia" register={register} error={errors.storeName} />
                <FormField label="NIT" name="nit" placeholder="Solo números (7-12 dígitos)" register={register} error={errors.nit} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
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
        {loading && (
          <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? 'Creando cuenta...' : 'Crear mi Cuenta'}
      </button>
    </form>
  );
}
