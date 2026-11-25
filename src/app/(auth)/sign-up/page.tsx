import RegisterPage from '@/components/manuPage/Sign-upPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: "Sign Up" };

function Sign_up() {
  return (
    <RegisterPage/>
  );
}

export default Sign_up;