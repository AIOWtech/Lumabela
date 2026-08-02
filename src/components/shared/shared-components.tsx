'use client';

import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Zap, Trophy, BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import { type ReactNode } from 'react';

interface StatBadgeProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

export function StatBadge({ icon, label, value, color = 'text-primary' }: StatBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 rounded-lg bg-card/60 backdrop-blur-sm border border-border/30 px-3 py-2"
    >
      <span className={cn(color)}>{icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-none">{label}</span>
        <span className="text-sm font-bold leading-tight">{value}</span>
      </div>
    </motion.div>
  );
}

interface XPBarProps {
  xp: number;
  xpToNext: number;
  level: number;
  showLabel?: boolean;
  compact?: boolean;
}

export function XPBar({ xp, xpToNext, level, showLabel = true, compact = false }: XPBarProps) {
  const percent = Math.round((xp / xpToNext) * 100);
  return (
    <div className={cn('flex items-center gap-2', compact ? 'gap-1.5' : 'gap-3')}>
      <div className="flex items-center gap-1.5 shrink-0">
        <Zap className="h-4 w-4 text-primary" />
        {!compact && <span className="text-sm font-bold">Lv.{level}</span>}
      </div>
      <div className="flex-1">
        {showLabel && (
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">XP</span>
            <span className="text-xs font-semibold">{xp}/{xpToNext}</span>
          </div>
        )}
        <div className={cn('h-2 rounded-full bg-muted overflow-hidden', compact && 'h-1.5')}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-chart-3"
          />
        </div>
      </div>
    </div>
  );
}

interface StreakDisplayProps {
  streak: number;
  compact?: boolean;
}

export function StreakDisplay({ streak, compact = false }: StreakDisplayProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-gradient-to-r from-chart-3/10 to-primary/10 border border-chart-3/20',
        compact ? 'px-2.5 py-1.5' : 'px-4 py-2.5'
      )}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Flame className={cn('text-chart-3', compact ? 'h-4 w-4' : 'h-5 w-5')} />
      </motion.div>
      <div>
        <div className={cn('font-bold text-chart-3', compact ? 'text-sm' : 'text-lg leading-tight')}>{streak}</div>
        {!compact && <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Day Streak</div>}
      </div>
    </motion.div>
  );
}

interface BadgeDisplayProps {
  badges: string[];
  compact?: boolean;
}

export function BadgeDisplay({ badges, compact = false }: BadgeDisplayProps) {
  const badgeIcons: Record<string, { icon: ReactNode; label: string; color: string }> = {
    'fast-learner': { icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Fast Learner', color: 'text-chart-3' },
    'quiz-master': { icon: <Trophy className="h-3.5 w-3.5" />, label: 'Quiz Master', color: 'text-primary' },
    'week-streak': { icon: <Flame className="h-3.5 w-3.5" />, label: '7-Day Streak', color: 'text-chart-3' },
    'first-course': { icon: <BookOpen className="h-3.5 w-3.5" />, label: 'First Course', color: 'text-accent' },
    'ai-explorer': { icon: <Star className="h-3.5 w-3.5" />, label: 'AI Explorer', color: 'text-chart-4' },
    'social-butterfly': { icon: <Award className="h-3.5 w-3.5" />, label: 'Social Star', color: 'text-chart-5' },
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const b = badgeIcons[badge] || { icon: <Star className="h-3.5 w-3.5" />, label: badge, color: 'text-muted-foreground' };
        return (
          <motion.div
            key={badge}
            whileHover={{ scale: 1.1, y: -2 }}
            className={cn(
              'flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm',
              compact ? 'px-2 py-1' : 'px-3 py-1.5'
            )}
            title={b.label}
          >
            <span className={b.color}>{b.icon}</span>
            {!compact && <span className="text-xs font-medium">{b.label}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}

interface ContinueLearningProps {
  compact?: boolean;
}

export function ContinueLearning({ compact = false }: ContinueLearningProps) {
  const { user, navigate, selectCourse } = useAppStore();
  const recentCourses = [
    { id: 'cs_1', title: 'Advanced React Patterns', progress: 68, lesson: 'Building a Tabs Component', icon: '⚛️' },
    { id: 'cs_2', title: 'UI/UX Design Masterclass', progress: 35, lesson: 'Color Theory Deep Dive', icon: '🎨' },
    { id: 'cs_3', title: 'Machine Learning Fundamentals', progress: 12, lesson: 'Introduction to Neural Networks', icon: '🤖' },
  ];

  return (
    <div className="space-y-3">
      {recentCourses.map((course, i) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ x: 4, scale: 1.01 }}
          onClick={() => selectCourse(course.id)}
          className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 cursor-pointer hover:bg-card/80 transition-colors"
        >
          <div className="text-2xl shrink-0">{course.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{course.title}</div>
            {!compact && <div className="text-xs text-muted-foreground truncate">{course.lesson}</div>}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-bold text-primary">{course.progress}%</span>
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface WeeklyChartProps {
  compact?: boolean;
}

export function WeeklyChart({ compact = false }: WeeklyChartProps) {
  const data = [120, 85, 200, 150, 180, 250, 95];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...data);
  
  return (
    <div className="flex items-end justify-between gap-1.5 h-24">
      {data.map((value, i) => (
        <div key={days[i]} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40 min-h-[4px] relative group"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {value} XP
            </div>
          </motion.div>
          {!compact && <span className="text-[10px] text-muted-foreground">{days[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse space-y-4', className)}>
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-32 bg-muted rounded-lg" />
    </div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={useAppStore.getState().currentPage}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.03, 0.98, 0.52, 0.99] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">{description}</p>
      {action}
    </motion.div>
  );
}

export function FloatingElements() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-40 right-[15%] w-48 h-48 rounded-full bg-accent/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-40 left-[20%] w-56 h-56 rounded-full bg-chart-3/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-[25%] w-40 h-40 rounded-full bg-chart-4/5 blur-3xl"
      />
    </div>
  );
}