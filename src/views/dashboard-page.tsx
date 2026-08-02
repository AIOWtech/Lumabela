'use client';

import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { StatBadge, XPBar, StreakDisplay, BadgeDisplay, ContinueLearning, WeeklyChart, PageTransition, FloatingElements } from '@/components/shared/shared-components';
import { mockCourses, weeklyProgress } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Clock, Trophy, Target, ArrowRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.03, 0.98, 0.52, 0.99] } },
};

const categoryEmojis: Record<string, string> = {
  programming: '⚛️',
  design: '🎨',
  'data-science': '🤖',
  business: '📊',
  language: '🗣️',
  mathematics: '📐',
};

export default function DashboardPage() {
  const { user, selectCourse, navigate } = useAppStore();

  if (!user) return null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const recommended = mockCourses.filter((c) => c.progress === 0).slice(0, 3);
  const weeklyGoalMinutes = 300;
  const weeklyCurrentMinutes = weeklyProgress.reduce((a, b) => a + b.minutes, 0);
  const weeklyGoalPercent = Math.min(Math.round((weeklyCurrentMinutes / weeklyGoalMinutes) * 100), 100);

  return (
    <PageTransition>
      <FloatingElements />
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{today}</p>
            </div>
            <StreakDisplay streak={user.streak} />
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          <motion.div variants={item}>
            <StatBadge
              icon={<Zap className="h-4 w-4 text-primary" />}
              label="Total XP"
              value={user.xp.toLocaleString()}
              color="text-primary"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatBadge
              icon={<BookOpen className="h-4 w-4 text-chart-3" />}
              label="Courses"
              value={user.enrolledCourses}
              color="text-chart-3"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatBadge
              icon={<Clock className="h-4 w-4 text-chart-4" />}
              label="Hours Learned"
              value={user.totalHoursLearned}
              color="text-chart-4"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatBadge
              icon={<Trophy className="h-4 w-4 text-chart-5" />}
              label="Rank"
              value={`#${user.rank}`}
              color="text-chart-5"
            />
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main Area */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 space-y-6"
          >
            {/* Continue Learning */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-6" hover3d={false}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Continue Learning</h2>
                  <AnimatedButton variant="ghost" size="sm" onClick={() => navigate('courses')} iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
                    View All
                  </AnimatedButton>
                </div>
                <ContinueLearning />
              </GlassCard>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-6" hover3d={false}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Weekly Activity</h2>
                  <span className="text-xs text-muted-foreground font-medium">
                    {weeklyCurrentMinutes} / {weeklyGoalMinutes} min
                  </span>
                </div>
                <WeeklyChart />
              </GlassCard>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recommended for You</h2>
                <AnimatedButton variant="ghost" size="sm" onClick={() => navigate('courses')} iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
                  Browse All
                </AnimatedButton>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommended.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <GlassCard
                      className="p-4 h-full"
                      onClick={() => selectCourse(course.id)}
                    >
                      <div className="text-3xl mb-3">{categoryEmojis[course.category] || '📚'}</div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <StarIcon className="h-3 w-3 text-primary fill-primary" />
                          {course.rating}
                        </span>
                        <span>•</span>
                        <span>{course.lessons} lessons</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                          course.level === 'Beginner' && 'bg-chart-3/10 text-chart-3',
                          course.level === 'Intermediate' && 'bg-chart-4/10 text-chart-4',
                          course.level === 'Advanced' && 'bg-primary/10 text-primary',
                        )}>
                          {course.level}
                        </span>
                        {course.isPremium && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <Sparkles className="h-2.5 w-2.5" /> Premium
                          </span>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* XP Progress Card */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-5" hover3d={false}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Level Progress</h3>
                </div>
                <XPBar xp={user.xp} xpToNext={user.xpToNext} level={user.level} />
                <p className="text-xs text-muted-foreground mt-3">
                  {user.xpToNext - user.xp} XP to Level {user.level + 1}
                </p>
              </GlassCard>
            </motion.div>

            {/* Streak Card */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-5" hover3d={false}>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-chart-3" />
                  <h3 className="font-semibold">Current Streak</h3>
                </div>
                <div className="flex items-center justify-center py-2">
                  <StreakDisplay streak={user.streak} />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {user.streak >= 14 ? '🔥 Incredible consistency!' : user.streak >= 7 ? '🌟 Great momentum!' : 'Keep going!'}
                </p>
              </GlassCard>
            </motion.div>

            {/* Badges Card */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-5" hover3d={false}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-chart-4" />
                  <h3 className="font-semibold">Your Badges</h3>
                </div>
                <BadgeDisplay badges={user.badges} />
              </GlassCard>
            </motion.div>

            {/* Study Goal Card */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-5" hover3d={false}>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-chart-5" />
                  <h3 className="font-semibold">Weekly Study Goal</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{weeklyCurrentMinutes} min studied</span>
                    <span className="font-semibold">{weeklyGoalPercent}%</span>
                  </div>
                  <Progress value={weeklyGoalPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {weeklyGoalMinutes - weeklyCurrentMinutes > 0
                      ? `${weeklyGoalMinutes - weeklyCurrentMinutes} minutes to reach your goal`
                      : '🎉 Goal reached this week!'}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}