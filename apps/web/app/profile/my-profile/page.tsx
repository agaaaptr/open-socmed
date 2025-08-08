'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, LogOut, Edit, ArrowLeft, Rss, Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import LoadingState from '../../../components/LoadingState';
import Link from 'next/link';
import Image from 'next/image';
import PostOptionsMenu from '../../../components/PostOptionsMenu';
import ConfirmationModal from '../../../components/ConfirmationModal';
import EditPostModal from '../../../components/EditPostModal';
import toast from 'react-hot-toast';

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
    return <div className="flex justify-center items-center py-10"><LoadingState /></div>;
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

export default function MyProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState<(User & { email?: string; posts?: Post[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // State for current user ID

  // State for modals
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const [tabData, setTabData] = useState<{ 
    followers: { data: User[], isLoading: boolean, error: string | null };
    following: { data: User[], isLoading: boolean, error: string | null };
    posts: { data: Post[], isLoading: boolean, error: string | null };
  }> ({
      followers: { data: [], isLoading: false, error: null }, // Initialize with false
      following: { data: [], isLoading: false, error: null }, // Initialize with false
      posts: { data: [], isLoading: false, error: null },     // Initialize with false
  });

  const fetchFollowData = useCallback(async (type: 'followers' | 'following', userId: string) => {
    setTabData(prev => ({ ...prev, [type]: { ...prev[type], isLoading: true, error: null } }));

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

  const handlePostUpdated = (updatedPost: Post) => {
    setTabData(prev => ({
      ...prev,
      posts: {
        ...prev.posts,
        data: prev.posts.data.map(p => p.id === updatedPost.id ? updatedPost : p)
      }
    }));
    toast.success('Post updated successfully!');
  };

  const openDeleteModal = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Deleting post...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated.');

      const response = await fetch(`/api/posts?id=${postToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post.');
      }

      setTabData(prev => ({
        ...prev,
        posts: {
          ...prev.posts,
          data: prev.posts.data.filter(p => p.id !== postToDelete.id)
        }
      }));
      toast.success('Post deleted successfully!', { id: loadingToast });
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err: any) {
      console.error('Error deleting post:', err);
      toast.error(err.message || 'Failed to delete post.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleReportPost = () => {
    router.push('/settings'); // Example: navigating to settings page
    toast('You are being redirected to the report page.');
  };

  useEffect(() => {
    async function fetchMyProfileAndData() {
      setLoading(true);
      setError('');
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push('/auth/signin');
        return;
      }
      setCurrentUserId(currentUser.id);

      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) throw new Error('No access token found.');

        // Fetch current user's profile
        const profileResponse = await fetch('/api/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.message || 'Failed to fetch profile.');
        }

        const profileData = await profileResponse.json();
        setProfile({ ...profileData, email: currentUser.email });
        
        // Fetch followers, following, and posts concurrently for the current user
        const [followersResponse, followingResponse] = await Promise.all([
          fetch(`/api/followers?user_id=${profileData.id}`),
          fetch(`/api/following?user_id=${profileData.id}`),
        ]);

        const followersData = followersResponse.ok ? await followersResponse.json() : [];
        const followingData = followingResponse.ok ? await followingResponse.json() : [];

        setTabData({
          followers: { data: followersData === null ? [] : followersData, isLoading: false, error: null },
          following: { data: followingData === null ? [] : followingData, isLoading: false, error: null },
          posts: { data: (profileData.posts || []).sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), isLoading: false, error: null },
        });
        setLoading(false); // Set loading to false here

      } catch (err: any) {
        console.error('Error fetching my profile:', err);
        setError(err.message || 'Failed to load your profile.');
        setLoading(false); // Set loading to false here on error
      }
    }

    fetchMyProfileAndData();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  const handleTabChange = (tab: string) => {
      setActiveTab(tab);
  };

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-background-dark text-text-light">
        <LoadingState text="Loading your profile..." />
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
    <>
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
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-border-subtle">
                <Link href="/settings/profile" className="flex-1 text-center py-2 px-4 bg-accent-main hover:bg-accent-hover rounded-lg font-semibold text-text-light transition-colors duration-300 shadow-md flex items-center justify-center">
                  <Edit className="mr-2 h-5 w-5" /> Edit Profile
                </Link>
                <button onClick={handleSignOut} className="flex-1 text-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-text-light transition-colors duration-300 shadow-md flex items-center justify-center">
                  <LogOut className="mr-2 h-5 w-5" /> Sign Out
                </button>
              </div>
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
                  {activeTab === 'posts' && (
                    tabData.posts.isLoading ? (
                      <div className="flex justify-center items-center py-10"><LoadingState /></div>
                    ) : tabData.posts.error ? (
                      <p className="text-center text-red-400">{tabData.posts.error}</p>
                    ) : !tabData.posts.data || tabData.posts.data.length === 0 ? (
                      <div className="text-center text-text-muted py-10 bg-background-light rounded-lg">
                          <Rss className="mx-auto w-10 h-10 mb-4" />
                          <h3 className="text-lg font-semibold">No posts yet</h3>
                          <p>You have not posted anything yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {tabData.posts.data.map((post) => (
                          <motion.div
                            key={post.id}
                            variants={postVariants}
                            className="bg-background-medium/30 p-4 md:p-5 rounded-xl border border-border-subtle"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
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
                              <PostOptionsMenu
                                isOwner={currentUserId === post.user_id}
                                onEdit={() => openEditModal(post)}
                                onDelete={() => openDeleteModal(post)}
                                onReport={handleReportPost}
                              />
                            </div>
                            <p className="text-text-light text-sm md:text-base leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
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
                    )
                  )}
                  {activeTab === 'followers' && <UserList users={tabData.followers.data} isLoading={tabData.followers.isLoading} error={tabData.followers.error} listType="followers" />}
                  {activeTab === 'following' && <UserList users={tabData.following.data} isLoading={tabData.following.isLoading} error={tabData.following.error} listType="following" />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {selectedPost && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={selectedPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        description="Are you sure you want to permanently delete this post? This action cannot be undone."
        confirmText="Yes, Delete"
        isLoading={isSubmitting}
      />
    </>
  );
}