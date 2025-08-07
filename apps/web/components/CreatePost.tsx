'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface CreatePostProps {
  onPostCreated: (newPost: any) => void; // Callback to update the timeline
  onClose: () => void; // Callback to close the modal/bottom sheet
  isMobile?: boolean; // New prop to determine if it's mobile view
}

export default function CreatePost({ onPostCreated, onClose, isMobile }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null); // Ref for click outside

  useOnClickOutside(modalRef, onClose); // Apply click outside hook

  const MAX_CHARS = 280;
  const charCount = content.length;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'; // Reset height
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('User not authenticated. Please sign in.');
      }

      const token = session.access_token;

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post.');
      }

      const newPost = await response.json();
      onPostCreated(newPost);
      setContent(''); // Clear content after successful post
      onClose(); // Close the modal/bottom sheet
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={modalRef} // Attach ref to the modal div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative bg-background-light p-6 rounded-2xl shadow-2xl border border-border-medium w-full max-w-xl md:max-w-2xl mx-auto z-50" // Adjusted width
    >
      <h2 className="text-2xl font-bold text-text-light mb-4">Create New Post</h2>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={isMobile ? 5 : 10} // Conditional rows
        maxLength={MAX_CHARS}
        className="w-full p-3 bg-background-medium rounded-lg border border-border-subtle text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-main resize-none overflow-hidden"
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
          className="flex items-center px-5 py-2 bg-accent-main text-text-light font-semibold rounded-full shadow-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          {isSubmitting ? 'Posting...' : 'Post'}
        </motion.button>
      </div>
    </motion.div>
  );
}
