'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingState from '../../components/LoadingState';
import NotificationItem from '../../components/NotificationItem';
import { BellRing, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface NotificationProps {
  id: string;
  recipient_user_id: string;
  sender_user_id: string;
  type: string;
  post_id?: string;
  is_read: boolean;
  created_at: string;
  sender_username: string;
  sender_full_name: string;
  sender_avatar_url: string;
}

export default function NotificationsPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUserId() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    }
    getUserId();
  }, [supabase]);

  const { data: notifications, isLoading, error } = useQuery<NotificationProps[]> ({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    },
    enabled: !!currentUserId, // Only fetch if currentUserId is available
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch('/api/mark-notifications-as-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read!');
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  if (isLoading || !currentUserId) {
    return <LoadingState text="Loading notifications..." />;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error.message}</div>;
  }

  const unreadNotificationsCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-text-light p-4"
    >
      <div className="w-full max-w-2xl bg-background-medium rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-accent-main flex items-center">
            <BellRing className="w-8 h-8 mr-3" />
            Notifications
          </h1>
          {unreadNotificationsCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="px-4 py-2 bg-accent-main text-text-light rounded-full flex items-center space-x-2 hover:bg-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {markAllAsReadMutation.isPending ? (
                <LoadingState type="dots" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark All as Read</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-text-muted py-10">
            <p className="text-lg">No notifications yet.</p>
            <p className="text-sm mt-2">Start following people to see updates here!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
