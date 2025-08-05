'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare, Users, Heart } from 'lucide-react';

// Reusable Accent-colored Text
const AccentText = ({ children, className = '' }) => (
  <span className={`text-accent-main ${className}`}>
    {children}
  </span>
);

// Reusable Feature Card component
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeInOut' }}
    whileHover={{ scale: 1.03, y: -5 }}
    className="p-6 rounded-2xl bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg transition-shadow duration-300 hover:shadow-accent-subtle"
  >
    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-accent-500/10 rounded-full border border-accent-500/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-text-light">{title}</h3>
    <p className="text-text-muted">{description}</p>
  </motion.div>
);

// Reusable Accent-colored Button
const AccentButton = ({ href, children, className = '' }) => (
  <Link
    href={href}
    className={`inline-block text-text-light font-bold py-2 px-5 rounded-full bg-accent-main hover:bg-accent-hover transition-all duration-300 ease-in-out shadow-lg hover:shadow-accent-main/40 transform hover:scale-105 ${className}`}>
    {children}
  </Link>
);

// Header Component
const Header = ({ user, onSignOut }) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 p-4 bg-background-medium/80 backdrop-blur-lg shadow-md flex justify-between items-center border-b border-border-subtle"
  >
    <Link href="/" className="text-3xl font-bold text-text-light">
      Cirqle
    </Link>
    <nav>
      <AnimatePresence>
        {user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-4"
          >
            <Link href="/home" className="py-2 px-4 text-text-light hover:text-accent-main transition-colors duration-300">
              Home
            </Link>
            <button
              onClick={onSignOut}
              className="py-2 px-4 bg-accent-main hover:bg-accent-hover rounded-full font-semibold text-text-light transition-colors duration-300"
            >
              Sign Out
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-x-2 md:space-x-4 flex items-center"
          >
            <Link href="/auth/signin" className="py-2 px-4 text-text-light hover:text-accent-main transition-colors duration-300">
              Sign In
            </Link>
            <AccentButton href="/auth/signup">Get Started</AccentButton>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  </motion.header>
);

// Hero Section Component
const HeroSection = ({ user }) => (
  <motion.main
    initial="hidden"
    animate="visible"
    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
    className="flex-grow flex flex-col items-center justify-center text-center p-8 pt-32"
  >
    <motion.h1
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6 }}
      className="text-5xl md:text-7xl font-extrabold mb-4 text-text-light"
    >
      Your New <AccentText>Social Universe</AccentText>
    </motion.h1>
    <motion.p
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-lg md:text-xl text-text-muted max-w-3xl mb-8"
    >
      Discover, connect, and share in a universe that revolves around you. Cirqle is where your story comes to life.
    </motion.p>
    {!user && (
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AccentButton href="/auth/signup" className="py-3 px-8 text-lg">
          Join the Cirqle <ArrowRight className="inline-block ml-2 h-5 w-5" />
        </AccentButton>
      </motion.div>
    )}
  </motion.main>
);

// Features Section Component
const FeaturesSection = () => (
  <section className="w-full max-w-6xl mx-auto p-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        delay={0.2}
        icon={<MessageSquare className="w-6 h-6 text-accent-main" />}
        title="Share Your Story"
        description="Post updates, photos, and videos with our easy-to-use editor."
      />
      <FeatureCard
        delay={0.4}
        icon={<Users className="w-6 h-6 text-accent-main" />}
        title="Build Your Community"
        description="Connect with friends, family, and people who share your interests."
      />
      <FeatureCard
        delay={0.6}
        icon={<Heart className="w-6 h-6 text-accent-main" />}
        title="Discover & Interact"
        description="Explore trending topics and react to posts that inspire you."
      />
    </div>
  </section>
);

// CTA Section Component
const CTASection = ({ user }) => (
  <section className="w-full text-center p-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-4xl font-bold text-text-light mb-4">Ready to <AccentText>Dive In?</AccentText></h2>
      <p className="text-text-muted mb-8 max-w-xl mx-auto">Become a part of the fastest-growing social platform. Your new community is just one click away.</p>
      {!user && (
        <AccentButton href="/auth/signup" className="py-3 px-8 text-lg">
          Sign Up Now
        </AccentButton>
      )}
    </motion.div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="w-full p-6 text-center text-text-muted/70 text-sm">
    &copy; {new Date().getFullYear()} Cirqle. All rights reserved.
  </footer>
);

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col text-text-light overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-primary-900/50 animate-background-pan -z-10" />

      <Header user={user} onSignOut={handleSignOut} />
      <HeroSection user={user} />
      <FeaturesSection />
      <CTASection user={user} />
      <Footer />
    </div>
  );
}