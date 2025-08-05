import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Cirqle',
  description: 'Sign in to your Cirqle account to continue your social journey.',
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
