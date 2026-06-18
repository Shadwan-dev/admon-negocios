// app/login/page.tsx
import { LoginForm } from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12">
      <LoginForm />
    </div>
  );
}