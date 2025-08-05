import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Cirqle',
  description: 'View your Cirqle profile and manage your account settings.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
