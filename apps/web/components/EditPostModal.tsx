'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Save } from 'lucide-react';
import LoadingState from './LoadingState';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface Post {
    id: string;
    content: string;
}

interface EditPostModalProps {
  isOpen: boolean;
  post: Post;
  onPostUpdated: (updatedPost: any) => void;
  onClose: () => void;
}

export default function EditPostModal({ isOpen, post, onPostUpdated, onClose }: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalWrapperRef = useRef<HTMLDivElement>(null);

  // This is tricky. We want to close when clicking the backdrop, but not the modal content.
  // The main motion.div is the backdrop. We attach the click handler to it.
  // The inner div is the modal content. We stop propagation on its click handler.
  // The useOnClickOutside hook is better for closing when clicking *anywhere* outside.
  // Let's use that for a more robust solution.
  useOnClickOutside(modalWrapperRef, onClose);


  const MAX_CHARS = 280;
  const charCount = content.length;

  useEffect(() => {
    // Update content in state if the post prop changes
    setContent(post.content);
  }, [post]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSubmit = async () => {
    if (charCount === 0 || charCount > MAX_CHARS || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated.');
      }

      const response = await fetch(`/api/posts?id=${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post.');
      }

      const updatedPost = await response.json();
      onPostUpdated(updatedPost);
      onClose();
    } catch (err: any) {
      console.error('Error updating post:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            ref={modalWrapperRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative bg-background-light p-6 rounded-2xl shadow-2xl border border-border-medium w-full max-w-xl md:max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-text-light mb-4">Edit Post</h2>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={10}
              maxLength={MAX_CHARS}
              className="w-full p-3 bg-background-medium rounded-lg border border-border-subtle text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-main resize-none overflow-hidden min-h-[200px]"
            />
            <div className="flex justify-between items-center mt-4">
              <span className={`text-sm ${charCount > MAX_CHARS ? 'text-red-400' : 'text-text-muted'}`}>
                {charCount}/{MAX_CHARS}
              </span>
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={charCount === 0 || charCount > MAX_CHARS || isSubmitting}
                className="flex items-center justify-center px-5 py-2 bg-accent-main text-text-light font-semibold rounded-full shadow-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoadingState type="dots" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? 'Saving...' : <span>Save Changes</span>}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}