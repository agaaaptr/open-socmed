import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile - Cirqle',
  description: 'Edit your Cirqle profile information.',
};

export default function EditProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
