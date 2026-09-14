import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/atoms/FormField';

const profileSchema = z.object({
  full_name: z.string().min(3, 'Nombre demasiado corto'),
  phone: z.string().optional(),
  city: z.string().optional(),
  store_name: z.string().optional(),
});

const CITIES = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Tarija', 'Oruro', 'Potosí', 'Chuquisaca', 'Beni', 'Pando'];

export default function BuyerProfileTab() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name:  profile?.full_name  ?? '',
      phone:      profile?.phone      ?? '',
      city:       profile?.city       ?? '',
      store_name: profile?.store_name ?? '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success('Perfil actualizado correctamente');
    } catch {
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-slate-body mb-6">Mi Perfil (CU04)</h1>
      
      <div className="bg-navy-light border border-cyan/10 rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Nombre Completo" name="full_name" placeholder="Tu nombre" register={register} error={errors.full_name} />
          <FormField label="Teléfono" name="phone" placeholder="+591 7xxxxxxx" register={register} error={errors.phone} />

          <FormField label="Ciudad" name="city" error={errors.city}>
            <select
              {...register('city')}
              className="w-full px-4 py-3 rounded-xl bg-navy border border-cyan/15 text-slate-body text-sm focus:outline-none focus:border-cyan/50 transition-all"
            >
              <option value="">Seleccioná tu ciudad</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          {profile?.role === 'seller' && (
            <FormField label="Nombre de la Tienda" name="store_name" placeholder="Nombre de tu tienda" register={register} error={errors.store_name} />
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-navy bg-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
