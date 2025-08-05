import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Cirqle',
  description: 'Create your Cirqle account and join the community.',
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
