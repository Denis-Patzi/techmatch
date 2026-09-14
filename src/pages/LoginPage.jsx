import { AuthLayout } from '@/components/organisms/AuthLayout';
import { LoginForm } from '@/components/organisms/LoginForm';

/**
 * LoginPage — CU02 + CU03: Autenticar con 2FA
 */
export default function LoginPage() {
  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresá tus datos para acceder a tu cuenta."
      footerText="¿No tenés cuenta?"
      footerLink="Registrate gratis"
      footerLinkTo="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
}
