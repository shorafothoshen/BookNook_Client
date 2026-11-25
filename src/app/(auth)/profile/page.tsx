import ProfilePage from '@/components/manuPage/ProfilePage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: "Profile" };

function Profilepage() {
  return (
    <ProfilePage/>
  );
}

export default Profilepage;