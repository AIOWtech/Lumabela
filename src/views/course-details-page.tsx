'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition, FloatingElements } from '@/components/shared/shared-components';
import { mockCourseDetails, mockCourses } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft, Star, Users, Clock, PlayCircle, FileText, HelpCircle,
  CheckCircle2, ChevronDown, ChevronRight, Award, BookOpen, Layers,
  BarChart3, ShieldCheck
} from 'lucide-react';

const typeIcons: Record<string, typeof PlayCircle> = {
  video: PlayCircle,
  exercise: FileText,
  quiz: HelpCircle,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.03, 0.98, 0.52, 0.99] } },
};

export default function CourseDetailsPage() {
  const { selectedCourseId, navigate, selectLesson, selectCourse } = useAppStore();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => new Set(['mod_1', 'mod_2']));

  // Use selectedCourseId to look up, fallback to mockCourseDetails
  const course = selectedCourseId
    ? mockCourses.find((c) => c.id === selectedCourseId)
    : null;
  const details = selectedCourseId === 'cs_1' ? mockCourseDetails : mockCourseDetails;

  if (!course) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <AnimatedButton variant="outline" onClick={() => navigate('courses')} icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Courses
          </AnimatedButton>
        </div>
      </PageTransition>
    );
  }

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const completedLessons = details.modules.reduce(
    (acc, mod) => acc + mod.lessons.filter((l) => l.completed).length,
    0
  );
  const totalLessons = details.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  const handleStartContinue = () => {
    // Find first incomplete lesson
    for (const mod of details.modules) {
      const nextLesson = mod.lessons.find((l) => !l.completed);
      if (nextLesson) {
        selectLesson(nextLesson.id);
        return;
      }
    }
    // All complete, go to first lesson
    selectLesson(details.modules[0].lessons[0].id);
  };

  return (
    <PageTransition>
      <FloatingElements />
      <div className="relative z-10 min-h-screen">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <AnimatedButton variant="ghost" size="sm" onClick={() => navigate('courses')} icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Courses
          </AnimatedButton>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 space-y-6"
          >
            {/* Course Header */}
            <motion.div variants={item}>
              <GlassCard className="p-5 sm:p-6" hover3d={false}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{details.category}</Badge>
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                    details.level === 'Beginner' && 'bg-chart-3/10 text-chart-3',
                    details.level === 'Intermediate' && 'bg-chart-4/10 text-chart-4',
                    details.level === 'Advanced' && 'bg-primary/10 text-primary',
                  )}>
                    {details.level}
                  </span>
                  {details.isPremium && (
                    <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-0 text-[10px]">
                      <Award className="h-3 w-3 mr-1" /> Premium
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{details.title}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{details.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="font-semibold text-foreground">{details.rating}</span>
                    <span>({details.ratingCount?.toLocaleString()})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {details.enrolled.toLocaleString()} enrolled
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {details.duration}
                  </span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Instructor */}
            <motion.div variants={item}>
              <GlassCard className="p-4 sm:p-5" hover3d={false}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center text-white font-bold text-sm">
                    {details.instructor.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{details.instructor}</p>
                    <p className="text-xs text-muted-foreground">Course Instructor</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* What You'll Learn */}
            <motion.div variants={item}>
              <GlassCard className="p-5 sm:p-6" hover3d={false}>
                <h2 className="text-lg font-semibold mb-4">What you&apos;ll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details.whatYouLearn.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-chart-3 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Course Content */}
            <motion.div variants={item}>
              <GlassCard className="p-5 sm:p-6" hover3d={false}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <span className="text-sm text-muted-foreground">
                    {completedLessons}/{totalLessons} lessons completed
                  </span>
                </div>

                {/* Overall Progress */}
                <div className="mb-5">
                  <Progress value={details.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{details.progress}% complete</p>
                </div>

                <Separator className="mb-4" />

                {/* Modules */}
                <div className="space-y-2">
                  {details.modules.map((mod, modIdx) => {
                    const isExpanded = expandedModules.has(mod.id);
                    const modCompleted = mod.lessons.filter((l) => l.completed).length;
                    const Icon = isExpanded ? ChevronDown : ChevronRight;

                    return (
                      <div key={mod.id} className="border border-border/40 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="w-full flex items-center justify-between p-3.5 hover:bg-card/60 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Module {modIdx + 1}: {mod.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {mod.lessons.length} lessons • {modCompleted}/{mod.lessons.length} completed
                              </p>
                            </div>
                          </div>
                          {modCompleted === mod.lessons.length && (
                            <CheckCircle2 className="h-4 w-4 text-chart-3" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border/30">
                                {mod.lessons.map((lesson) => {
                                  const TypeIcon = typeIcons[lesson.type] || PlayCircle;
                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => selectLesson(lesson.id)}
                                      className={cn(
                                        'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-card/60 transition-colors border-b border-border/20 last:border-b-0',
                                        lesson.completed && 'opacity-70'
                                      )}
                                    >
                                      {lesson.completed ? (
                                        <CheckCircle2 className="h-4 w-4 text-chart-3 shrink-0" />
                                      ) : (
                                        <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className={cn('text-sm', lesson.completed && 'line-through text-muted-foreground')}>
                                          {lesson.title}
                                        </p>
                                      </div>
                                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* CTA */}
            <motion.div variants={item} className="pb-6">
              <AnimatedButton
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleStartContinue}
                icon={details.progress > 0 ? <PlayCircle className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              >
                {details.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </AnimatedButton>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Course Info Card */}
            <motion.div variants={item}>
              <GlassCard className="p-5" hover3d={false}>
                <h3 className="font-semibold mb-4">Course Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Duration
                    </span>
                    <span className="font-medium">{details.duration}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Lessons
                    </span>
                    <span className="font-medium">{details.totalLessons}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Level
                    </span>
                    <span className="font-medium">{details.level}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Certificate
                    </span>
                    <span className="font-medium text-chart-3">Included</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Requirements */}
            <motion.div variants={item}>
              <GlassCard className="p-5" hover3d={false}>
                <h3 className="font-semibold mb-4">Requirements</h3>
                <ul className="space-y-2.5">
                  {details.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}