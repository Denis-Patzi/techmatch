import { AuthLayout } from '@/components/organisms/AuthLayout';
import { SignUpForm } from '@/components/organisms/SignUpForm';

/**
 * SignUpPage — CU01: Registrar Usuario
 */
export default function SignUpPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Elegí tu rol y empezá gratis en segundos."
      footerText="¿Ya tenés cuenta?"
      footerLink="Iniciá sesión"
      footerLinkTo="/login"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
