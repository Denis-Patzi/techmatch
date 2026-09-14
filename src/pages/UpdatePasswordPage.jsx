import { AuthLayout } from '@/components/organisms/AuthLayout';
import { UpdatePasswordForm } from '@/components/organisms/UpdatePasswordForm';

export default function UpdatePasswordPage() {
  return (
    <AuthLayout
      title="Crear nueva contraseña"
      subtitle="Elegí una contraseña segura para tu cuenta."
    >
      <UpdatePasswordForm />
    </AuthLayout>
  );
}
