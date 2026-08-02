'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3d?: boolean;
  gradient?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover3d = true, gradient = false, glow = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover3d ? { y: -4, rotateX: 1, rotateY: -1 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20',
        hover3d && 'card-3d',
        gradient && 'gradient-border',
        glow && 'animate-pulse-glow',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}