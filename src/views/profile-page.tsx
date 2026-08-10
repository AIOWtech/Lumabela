'use client';

import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { StatBadge, XPBar, StreakDisplay, BadgeDisplay, WeeklyChart, PageTransition } from '@/components/shared/shared-components';
import { mockCourses } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, BookOpen, CheckCircle, Clock, Trophy, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.03, 0.98, 0.52, 0.99] } },
};

export default function ProfilePage() {
  const { user, selectCourse, navigate } = useAppStore();
  if (!user) return null;

  const enrolled = mockCourses.filter((c) => c.progress > 0 && c.progress < 100);
  const completed = mockCourses.filter((c) => c.progress === 100);
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <PageTransition>
      <motion.div className="space-y-6 max-w-5xl mx-auto" variants={container} initial="hidden" animate="show">
        {/* Profile Header */}
        <motion.div variants={item}>
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary via-chart-3 to-chart-4 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg shadow-primary/20">
                  {initials}
                </div>
                <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-5 w-5 text-white" />
                </button>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">{user.level}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{user.name}</h1>
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 mt-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since Jan 2024
                  </span>
                </div>
                <div className="mt-4 max-w-sm mx-auto sm:mx-0">
                  <XPBar xp={user.xp} xpToNext={user.xpToNext} level={user.level} />
                </div>
                <div className="mt-4">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    icon={<Pencil className="h-3.5 w-3.5" />}
                    onClick={() => navigate('settings')}
                  >
                    Edit Profile
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatBadge
            icon={<BookOpen className="h-4 w-4" />}
            label="Enrolled"
            value={user.enrolledCourses}
            color="text-primary"
          />
          <StatBadge
            icon={<CheckCircle className="h-4 w-4" />}
            label="Completed"
            value={user.completedCourses}
            color="text-emerald-500"
          />
          <StatBadge
            icon={<Clock className="h-4 w-4" />}
            label="Hours Learned"
            value={user.totalHoursLearned}
            color="text-chart-3"
          />
          <StatBadge
            icon={<Trophy className="h-4 w-4" />}
            label="Global Rank"
            value={`#${user.rank}`}
            color="text-chart-4"
          />
        </motion.div>

        {/* Streak */}
        <motion.div variants={item}>
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Learning Streak</h3>
            <StreakDisplay streak={user.streak} />
          </GlassCard>
        </motion.div>

        {/* Badges */}
        <motion.div variants={item}>
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Badges Earned</h3>
            <BadgeDisplay badges={user.badges} />
          </GlassCard>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div variants={item}>
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Learning Activity</h3>
            <WeeklyChart />
          </GlassCard>
        </motion.div>

        {/* Courses Tabs */}
        <motion.div variants={item}>
          <Tabs defaultValue="enrolled">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="enrolled" className="flex-1 sm:flex-none">
                Enrolled Courses
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 sm:flex-none">
                Completed Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enrolled" className="mt-4 space-y-3">
              {enrolled.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No enrolled courses yet.</p>
              ) : (
                enrolled.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => selectCourse(course.id)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 cursor-pointer hover:bg-card/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{course.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {course.instructor} · {course.lessons} lessons
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-chart-3"
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary shrink-0">{course.progress}%</div>
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4 space-y-3">
              {completed.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No completed courses yet. Keep learning!</p>
              ) : (
                completed.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => selectCourse(course.id)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 cursor-pointer hover:bg-card/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{course.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {course.instructor} · {course.lessons} lessons
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}