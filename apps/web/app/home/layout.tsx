import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Cirqle',
  description: 'Your personalized social feed on Cirqle.',
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
