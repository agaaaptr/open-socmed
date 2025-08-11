'use client';

import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Added import
import { formatDistanceToNow } from 'date-fns';
import FollowButton from './FollowButton';
import { useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

interface NotificationItemProps {
  notification: NotificationProps;
  currentUserId: string;
}

export default function NotificationItem({ notification, currentUserId }: NotificationItemProps) {
  const queryClient = useQueryClient();
  const supabase = createClientComponentClient();

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  const handleMarkAsRead = async () => {
    // Optimistically update the UI
    queryClient.setQueryData(['notifications'], (oldData: NotificationProps[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(n => n.id === notification.id ? { ...n, is_read: true } : n);
    });

    // Call API to mark as read (individual notification, if needed, or rely on mark all as read)
    // For now, we'll assume mark all as read handles this.
    // If individual mark as read is needed, uncomment and implement below:
    /*
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`/api/notifications/${notification.id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert optimistic update if API call fails
      queryClient.setQueryData(['notifications'], (oldData: NotificationProps[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(n => n.id === notification.id ? { ...n, is_read: false } : n);
      });
    }
    */
  };

  let notificationContent;
  let actionButton = null;

  switch (notification.type) {
    case 'follow':
      notificationContent = (
        <p className="text-text-light">
          <Link href={`/profile/${notification.sender_username}`} className="font-semibold hover:underline">
            @{notification.sender_username}
          </Link>{' '}
          started following you.
        </p>
      );
      actionButton = (
        <FollowButton
          targetUserId={notification.sender_user_id}
          currentUserId={currentUserId}
          initialIsFollowing={false} // This will be updated by FollowButton's internal logic
          onFollowSuccess={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })} // Invalidate to potentially update follow status
          onUnfollowSuccess={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })}
        />
      );
      break;
    // Add other notification types here (e.g., 'like', 'comment')
    default:
      notificationContent = (
        <p className="text-text-light">New activity from{' '}
          <Link href={`/profile/${notification.sender_username}`} className="font-semibold hover:underline">
            @{notification.sender_username}
          </Link>
        </p>
      );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center p-4 rounded-lg mb-3 shadow-md transition-colors duration-200
        ${notification.is_read ? 'bg-background-medium' : 'bg-accent-subtle border border-accent-main/50'}
      `}
    >
      <div className="flex-shrink-0 mr-4">
        {notification.sender_avatar_url ? (
          <Image
            src={notification.sender_avatar_url}
            alt={notification.sender_username}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-accent-main"
            unoptimized
          />
        ) : (
          <UserCircle className="w-10 h-10 text-text-muted border-2 border-accent-main rounded-full" />
        )}
      </div>
      <div className="flex-grow">
        {notificationContent}
        <p className="text-sm text-text-muted mt-1">{timeAgo}</p>
      </div>
      {actionButton && <div className="flex-shrink-0 ml-4">{actionButton}</div>}
    </motion.div>
  );
}
