import { AuthLayout } from '@/components/organisms/AuthLayout';
import { ForgotPasswordForm } from '@/components/organisms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Ingresá tu correo electrónico y te enviaremos las instrucciones."
      footerText="¿Recordaste tu contraseña?"
      footerLink="Iniciá sesión acá"
      footerLinkTo="/login"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
