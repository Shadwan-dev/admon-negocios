// app/register/page.tsx
import { RegisterForm } from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12">
      <RegisterForm />
    </div>
  );
}