
'use client';

import { useState, useRef } from 'react';
import { MoreVertical, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface PostOptionsMenuProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({ isOwner, onEdit, onDelete, onReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-accent-subtle transition-colors">
        <MoreVertical size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full right-0 mt-2 w-48 bg-background-light border border-border-medium rounded-lg shadow-lg z-10 overflow-hidden"
          >
            <ul className="text-sm">
              {isOwner ? (
                <>
                  <li>
                    <button
                      onClick={() => { onEdit(); setIsOpen(false); }}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-accent-subtle transition-colors"
                    >
                      <Edit size={16} className="mr-3" />
                      Edit Post
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { onDelete(); setIsOpen(false); }}
                      className="w-full flex items-center px-4 py-3 text-left text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} className="mr-3" />
                      Delete Post
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => { onReport(); setIsOpen(false); }}
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-accent-subtle transition-colors"
                  >
                    <AlertTriangle size={16} className="mr-3" />
                    Report Post
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostOptionsMenu;
