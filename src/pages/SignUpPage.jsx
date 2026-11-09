import { AuthLayout } from '@/components/organisms/AuthLayout';
import { SignUpForm } from '@/components/organisms/SignUpForm';

/**
 * SignUpPage — CU01: Registrar Usuario
 */
export default function SignUpPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Una cuenta para comprar y vender, por tu cuenta o como tienda."
      footerText="¿Ya tenés cuenta?"
      footerLink="Iniciá sesión"
      footerLinkTo="/login"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
