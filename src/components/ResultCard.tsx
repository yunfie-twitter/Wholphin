import React from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { cn } from '../utils';

export const SkeletonCard: React.FC<{ type?: string }> = ({ type = 'web' }) => (
  <div className={cn(
    "shimmer-effect rounded-2xl",
    type === 'web' ? "h-32 w-full" : 
    type === 'image' ? "aspect-square" : 
    "aspect-video"
  )} />
);

export const EmptyState: React.FC<{ message?: string }> = ({ message = "結果が見つかりませんでした。別のキーワードで試すか、より一般的な言葉を使用してみてください。" }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
      <Globe className="w-10 h-10 text-[#86868B]" />
    </div>
    <h3 className="text-2xl font-semibold mb-2 text-[#1D1D1F] dark:text-[#F5F5F7]">結果が見つかりませんでした</h3>
    <p className="text-[#86868B] max-w-md">
      {message}
    </p>
  </motion.div>
);
