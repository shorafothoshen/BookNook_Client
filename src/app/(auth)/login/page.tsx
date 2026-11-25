import LoginPage from '@/components/manuPage/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: "Login" };

function Login() {
  return (
    <LoginPage/>
  );
}

export default Login;