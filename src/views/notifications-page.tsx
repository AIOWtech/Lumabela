'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition, EmptyState } from '@/components/shared/shared-components';
import { mockNotifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trophy, BookOpen, Users, Flame, Info, CheckCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.03, 0.98, 0.52, 0.99] } },
};

type NotificationType = 'achievement' | 'course' | 'social' | 'streak' | 'system';
type FilterTab = 'all' | 'unread' | 'achievements' | 'courses' | 'social';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const typeIcons: Record<NotificationType, typeof Trophy> = {
  achievement: Trophy,
  course: BookOpen,
  social: Users,
  streak: Flame,
  system: Info,
};

const typeColors: Record<NotificationType, string> = {
  achievement: 'bg-primary/15 text-primary',
  course: 'bg-chart-3/15 text-chart-3',
  social: 'bg-chart-4/15 text-chart-4',
  streak: 'bg-orange-500/15 text-orange-500',
  system: 'bg-muted text-muted-foreground',
};

const typeToFilter: Record<NotificationType, FilterTab> = {
  achievement: 'achievements',
  course: 'courses',
  social: 'social',
  streak: 'all',
  system: 'all',
};

function groupByTime(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  notifications.forEach((n) => {
    if (n.time.includes('min') || n.time.includes('hour')) {
      today.push(n);
    } else if (n.time.includes('1 day') || n.time.includes('day ago') && !n.time.includes('2') && !n.time.includes('3')) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  if (today.length > 0) groups.push({ label: 'Today', items: today });
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', items: yesterday });
  if (earlier.length > 0) groups.push({ label: 'Earlier', items: earlier });

  return groups;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications as Notification[]);
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'achievements') return n.type === 'achievement';
    if (filter === 'courses') return n.type === 'course';
    if (filter === 'social') return n.type === 'social';
    return true;
  });

  const groups = groupByTime(filtered);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const filterTabs: { label: string; value: FilterTab; count: number }[] = [
    { label: 'All', value: 'all', count: notifications.length },
    { label: 'Unread', value: 'unread', count: unreadCount },
    { label: 'Achievements', value: 'achievements', count: notifications.filter((n) => n.type === 'achievement').length },
    { label: 'Courses', value: 'courses', count: notifications.filter((n) => n.type === 'course').length },
    { label: 'Social', value: 'social', count: notifications.filter((n) => n.type === 'social').length },
  ];

  return (
    <PageTransition>
      <motion.div className="space-y-6 max-w-3xl mx-auto" variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <AnimatedButton
              variant="ghost"
              size="sm"
              icon={<CheckCheck className="h-4 w-4" />}
              onClick={markAllRead}
            >
              Mark all as read
            </AnimatedButton>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {filterTabs.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0',
                filter === f.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/80'
              )}
            >
              {f.label}
              {f.count > 0 && (
                <span className={cn('ml-1.5 text-xs', filter === f.value ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Notification Groups */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div variants={item}>
              <GlassCard className="p-6">
                <EmptyState
                  icon="🔔"
                  title="No Notifications"
                  description={filter !== 'all' ? `No ${filter} notifications found.` : "You're all caught up! Check back later."}
                />
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div variants={container} className="space-y-6">
              {groups.map((group) => (
                <motion.div key={group.label} variants={item} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    {group.label}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((notification) => {
                      const Icon = typeIcons[notification.type];
                      return (
                        <motion.div
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <GlassCard
                            hover3d={false}
                            className={cn(
                              'p-4 cursor-pointer transition-colors hover:bg-primary/5',
                              !notification.read && 'bg-primary/5 border-primary/20'
                            )}
                            onClick={() => markRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', typeColors[notification.type])}>
                                <Icon className="h-4 w-4" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={cn('text-sm leading-tight', !notification.read ? 'font-bold' : 'font-medium')}>
                                    {notification.title}
                                  </h4>
                                  {/* Unread Dot */}
                                  {!notification.read && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-sm shadow-primary/50" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                                <span className="text-[11px] text-muted-foreground/70 mt-1.5 block">{notification.time}</span>
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear All */}
        {notifications.length > 0 && (
          <motion.div variants={item} className="flex justify-center pt-2">
            <AnimatedButton
              variant="ghost"
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear all notifications
            </AnimatedButton>
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  );
}