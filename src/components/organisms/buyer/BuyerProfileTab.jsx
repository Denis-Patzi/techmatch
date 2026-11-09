import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/atoms/FormField';
import { Icon } from '@/components/atoms/Icon';
import { AccountTypeSelector } from '@/components/molecules/AccountTypeSelector';
import { getAccountType } from '@/lib/account';

const schema = z
  .object({
    account_type: z.enum(['personal', 'store']),
    full_name: z.string().trim().min(3, 'Ingresá al menos 3 caracteres.').max(120),
    phone: z.string().trim().max(30).optional(),
    city: z.string().trim().max(80).optional(),
    store_name: z.string().trim().max(120).optional(),
    nit: z.string().trim().max(30).optional(),
  })
  .refine((values) => values.account_type !== 'store' || values.store_name?.length >= 2, {
    message: 'Ingresá el nombre de tu tienda.',
    path: ['store_name'],
  });
const CITIES = [
  'La Paz',
  'Santa Cruz',
  'Cochabamba',
  'Tarija',
  'Oruro',
  'Potosí',
  'Chuquisaca',
  'Beni',
  'Pando',
];

function defaults(profile) {
  return {
    account_type: getAccountType(profile),
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    city: profile?.city ?? '',
    store_name: profile?.store_name ?? '',
    nit: profile?.nit ?? '',
  };
}

export default function BuyerProfileTab() {
  const { user, profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(schema), defaultValues: defaults(profile) });
  useEffect(() => {
    reset(defaults(profile));
  }, [profile, reset]);
  const accountType = watch('account_type');
  const store = accountType === 'store';
  const publicName = getAccountType(profile) === 'store' ? profile?.store_name : profile?.full_name;

  const save = async (data) => {
    setSaving(true);
    try {
      await updateProfile({
        ...data,
        store_name: store ? data.store_name : null,
        nit: store ? data.nit || null : null,
      });
      toast.success('Perfil actualizado correctamente.');
    } catch (error) {
      const schemaPending = ['42703', 'PGRST204'].includes(error.code);
      toast.error(
        schemaPending
          ? 'La actualización de cuentas aún no está disponible. Tus cambios no se guardaron.'
          : 'No pudimos guardar los cambios. Intentá de nuevo.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-profile-settings">
      <span className="eyebrow mb-4">Tu identidad en TechMatch</span>
      <h1>Mi perfil.</h1>
      <p className="text-sm text-slate-sub mt-3 mb-6">
        Una misma cuenta para comprar y vender. Elegí cómo querés presentarte a la comunidad.
      </p>
      <div className="glass-panel user-profile-summary">
        <span className="user-profile-monogram" aria-hidden="true">
          {publicName?.[0]?.toUpperCase() || 'T'}
        </span>
        <div>
          <h2>{publicName || 'Tu perfil'}</h2>
          <p>{user?.email}</p>
          <span>
            {getAccountType(profile) === 'store' ? 'Cuenta de tienda' : 'Cuenta personal'}
          </span>
        </div>
        {profile?.is_verified && (
          <span className="user-verified">
            <Icon name="shield" size={17} /> Verificado
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit(save)} className="glass-panel user-profile-form">
        <fieldset disabled={saving}>
          <legend className="text-sm font-medium mb-4">Tipo de cuenta</legend>
          <input type="hidden" {...register('account_type')} />
          <AccountTypeSelector
            value={accountType}
            onChange={(value) =>
              setValue('account_type', value, { shouldDirty: true, shouldValidate: true })
            }
          />
          <div className="user-form-fields">
            <FormField
              label="Nombre completo"
              name="full_name"
              register={register}
              error={errors.full_name}
            />
            <FormField
              label="Teléfono (opcional)"
              name="phone"
              register={register}
              error={errors.phone}
            />
            <FormField label="Ciudad" name="city" error={errors.city}>
              <select {...register('city')} className="user-input">
                <option value="">Seleccioná tu ciudad</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </FormField>
            {store && (
              <>
                <FormField
                  label="Nombre de la tienda"
                  name="store_name"
                  register={register}
                  error={errors.store_name}
                />
                <FormField
                  label="NIT (opcional)"
                  name="nit"
                  register={register}
                  error={errors.nit}
                />
              </>
            )}
          </div>
          <p className="text-xs text-slate-muted mt-5 mb-5">
            {store
              ? 'Tu tienda también puede comprar y participar en la comunidad.'
              : 'Podés publicar y vender con tu nombre personal.'}{' '}
            Cambiar a cuenta personal retira el nombre comercial y el NIT del perfil.
          </p>
          <button className="btn-primary" type="submit" disabled={saving || !isDirty}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {profile?.is_verified && (
            <p className="text-xs text-slate-muted mt-4">
              Si cambiás tu nombre o los datos de identidad comercial, tu verificación necesitará
              una nueva revisión.
            </p>
          )}
        </fieldset>
      </form>
    </div>
  );
}
