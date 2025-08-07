'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Loader, LogOut, Edit, ArrowLeft, Rss, Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

// Reusable component for a list of users
const UserList = ({ users, isLoading, error, listType }: { users: User[], isLoading: boolean, error: string | null, listType?: 'followers' | 'following' }) => {
  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Loader className="w-8 h-8 text-accent-main animate-spin" /></div>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }
  
  if (!users || users.length === 0) {
    const message = listType === 'followers' ? 'No followers yet.' : listType === 'following' ? 'Not following anyone yet.' : 'No users found.';
    return (
        <div className="text-center text-text-muted py-10 bg-background-light rounded-lg">
            <Users className="mx-auto w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold">{message}</h3>
            <p>This list is currently empty.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.1, ease: 'easeOut' }}
          className="bg-background-light p-4 rounded-lg flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Link href={`/profile/${user.username}`} className="flex items-center space-x-4">
            <div className="relative w-12 h-12 rounded-full bg-background-medium flex items-center justify-center overflow-hidden">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.full_name} layout="fill" objectFit="cover" />
              ) : (
                <UserCircle className="w-8 h-8 text-accent-main" />
              )}
            </div>
            <div>
              <p className="font-bold text-text-light">{user.full_name}</p>
              <p className="text-sm text-text-muted">@{user.username}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

// Reusable component for a list of posts
const PostList = ({ posts, isLoading, error }: { posts: Post[], isLoading: boolean, error: string | null }) => {
  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Loader className="w-8 h-8 text-accent-main animate-spin" /></div>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }
  
  if (!posts || posts.length === 0) {
    return (
        <div className="text-center text-text-muted py-10 bg-background-light rounded-lg">
            <Rss className="mx-auto w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold">No posts yet</h3>
            <p>This user has not posted anything yet.</p>
        </div>
    );
  }

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          variants={postVariants}
          className="bg-background-medium/30 p-4 md:p-5 rounded-xl border border-border-subtle"
        >
          <div className="flex items-center mb-3">
            {post.user?.avatar_url ? (
              <Image src={post.user.avatar_url} alt={post.user.full_name} width={40} height={40} className="rounded-full mr-3 md:mr-4" />
            ) : (
              <UserCircle className="w-9 h-9 md:w-10 md:h-10 text-accent-main mr-3 md:mr-4" />
            )}
            <div>
              <p className="font-semibold text-text-light text-base md:text-lg">{post.user?.full_name || 'Unknown User'}</p>
              <p className="text-xs md:text-sm text-text-muted">@{post.user?.username || 'unknown'} • {new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-text-light text-sm md:text-base leading-relaxed mb-4">{post.content}</p>
          <div className="flex space-x-4 md:space-x-6 text-text-muted text-sm">
            <button className="flex items-center hover:text-accent-main transition-colors duration-200">
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              <span>Like</span>
            </button>
            <button className="flex items-center hover:text-accent-main transition-colors duration-200">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              <span>Comment</span>
            </button>
            <button className="flex items-center hover:text-accent-main transition-colors duration-200">
              <Share2 className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function ProfileViewPage({ params }: { params: { username: string } }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState<(User & { email?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [tabData, setTabData] = useState<{ 
    followers: { data: User[], isLoading: boolean, error: string | null };
    following: { data: User[], isLoading: boolean, error: string | null };
    posts: { data: Post[], isLoading: boolean, error: string | null };
  }> ({
      followers: { data: [], isLoading: true, error: null },
      following: { data: [], isLoading: true, error: null },
      posts: { data: [], isLoading: true, error: null },
  });

  const fetchFollowData = useCallback(async (type: 'followers' | 'following', userId: string) => {
    setTabData(prev => {
      if (prev[type].data.length > 0 && !prev[type].isLoading && !prev[type].error) {
        return prev; 
      }
      return { ...prev, [type]: { ...prev[type], isLoading: true, error: null } };
    });

    try {
      const response = await fetch(`/api/${type}?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }
      const data = await response.json();
      const processedData = data === null ? [] : data;

      if (!Array.isArray(processedData)) {
        throw new Error(`API returned unexpected data for ${type}. Received: ${JSON.stringify(data)}`);
      }
      setTabData(prev => ({ ...prev, [type]: { data: processedData, isLoading: false, error: null } }));
    } catch (err: any) {
      setTabData(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false, error: err.message } }));
    }
  }, []);

  const fetchPostsData = useCallback(async (userId: string) => {
    setTabData(prev => ({ ...prev, posts: { ...prev.posts, isLoading: true, error: null } }));
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('User not authenticated. Please sign in.');
      }
      const token = session.access_token;

      const response = await fetch(`/api/posts?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts.');
      }

      const data: Post[] = await response.json();
      setTabData(prev => ({ ...prev, posts: { data, isLoading: false, error: null } }));
    } catch (err: any) {
      setTabData(prev => ({ ...prev, posts: { ...prev.posts, isLoading: false, error: err.message } }));
    }
  }, [supabase]);

  useEffect(() => {
    async function fetchProfileAndData() {
      setLoading(true);
      setError('');
      const { data: { user } } = await supabase.auth.getUser();

      if (!params.username && !user) {
        router.push('/auth/signin');
        return;
      }

      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) throw new Error('No access token found.');

        const apiUrl = `/api/profile?username=${params.username || ''}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile.');
        }

        const data = await response.json();
        
        if (user && data.id === user.id) {
          setProfile({ ...data, email: user.email });
          setIsOwnProfile(true);
        } else {
          setProfile(data);
          setIsOwnProfile(false);
        }
        
        fetchFollowData('followers', data.id);
        fetchFollowData('following', data.id);
        fetchPostsData(data.id); // Fetch posts for the profile

      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndData();
  }, [supabase, router, fetchFollowData, fetchPostsData, params.username]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      if((tab === 'followers' || tab === 'following') && profile) {
          fetchFollowData(tab, profile.id)
      } else if (tab === 'posts' && profile) {
          fetchPostsData(profile.id);
      }
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-background-dark text-text-light">
        <Loader className="w-12 h-12 text-accent-main animate-spin" />
        <p className="mt-4 text-text-muted">Loading profile...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-text-light">
        <p className="text-red-400 text-lg">Error: {error}</p>
        <Link href="/home" className="mt-4 text-accent-main hover:underline">Back to Home</Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background-dark text-text-light">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="relative bg-background-light p-6 rounded-2xl shadow-lg"
        >
          <Link href="/home" className="absolute top-4 right-4 flex items-center text-text-light hover:text-accent-main transition-colors duration-300 p-2 rounded-lg text-sm">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <UserCircle className="w-24 h-24 sm:w-28 sm:h-28 text-accent-main flex-shrink-0" />
            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-2xl md:text-3xl font-bold text-text-light">{profile?.full_name}</h1>
              <p className="text-md md:text-lg text-text-muted">@{profile?.username}</p>
              <div className="flex justify-center sm:justify-start space-x-6 mt-4 text-text-light">
                <div>
                  <span className="font-bold">{tabData.posts.isLoading ? '...' : tabData.posts.data.length}</span>
                  <span className="text-text-muted ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold">{tabData.followers.isLoading ? '...' : tabData.followers.data.length}</span>
                  <span className="text-text-muted ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold">{tabData.following.isLoading ? '...' : tabData.following.data.length}</span>
                  <span className="text-text-muted ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-border-subtle">
              <Link href="/settings/profile" className="flex-1 text-center py-2 px-4 bg-accent-main hover:bg-accent-hover rounded-lg font-semibold text-text-light transition-colors duration-300 shadow-md flex items-center justify-center">
                <Edit className="mr-2 h-5 w-5" /> Edit Profile
              </Link>
              <button onClick={handleSignOut} className="flex-1 text-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-text-light transition-colors duration-300 shadow-md flex items-center justify-center">
                <LogOut className="mr-2 h-5 w-5" /> Sign Out
              </button>
            </div>
          )}
        </motion.div>

        <div className="mt-8">
          <div className="flex border-b border-border-medium">
            <button onClick={() => handleTabChange('posts')} className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'posts' ? 'text-accent-main border-b-2 border-accent-main' : 'text-text-muted'}`}>Posts</button>
            <button onClick={() => handleTabChange('followers')} className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'followers' ? 'text-accent-main border-b-2 border-accent-main' : 'text-text-muted'}`}>Followers</button>
            <button onClick={() => handleTabChange('following')} className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'following' ? 'text-accent-main border-b-2 border-accent-main' : 'text-text-muted'}`}>Following</button>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                {activeTab === 'posts' && <PostList posts={tabData.posts.data} isLoading={tabData.posts.isLoading} error={tabData.posts.error} />}
                {activeTab === 'followers' && <UserList users={tabData.followers.data} isLoading={tabData.followers.isLoading} error={tabData.followers.error} listType="followers" />}
                {activeTab === 'following' && <UserList users={tabData.following.data} isLoading={tabData.following.isLoading} error={tabData.following.error} listType="following" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}