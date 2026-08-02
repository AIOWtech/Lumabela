'use client';

import { useState } from 'react';
import { useAppStore, type CourseCategory } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { EmptyState, PageTransition, FloatingElements } from '@/components/shared/shared-components';
import { mockCourses } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Star, Users, Clock, Crown, ChevronDown, BookOpen } from 'lucide-react';

const categoryEmojis: Record<string, string> = {
  programming: '⚛️',
  design: '🎨',
  'data-science': '🤖',
  business: '📊',
  language: '🗣️',
  mathematics: '📐',
};

const categories: { id: CourseCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'programming', label: 'Programming' },
  { id: 'design', label: 'Design' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'business', label: 'Business' },
  { id: 'language', label: 'Language' },
  { id: 'mathematics', label: 'Mathematics' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.03, 0.98, 0.52, 0.99] } },
};

export default function CoursesPage() {
  const { searchQuery, setSearchQuery, courseCategory, setCourseCategory, selectCourse } = useAppStore();
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = mockCourses.filter((course) => {
    const matchesCategory = courseCategory === 'all' || course.category === courseCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      course.instructor.toLowerCase().includes(q) ||
      course.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Explore Courses</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, instructors, topics..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
              className="pl-10 bg-card/60 backdrop-blur-sm border-border/50"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 overflow-x-auto pb-2 -mx-2 px-2"
        >
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCourseCategory(cat.id); setVisibleCount(6); }}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  courseCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card/60 backdrop-blur-sm border border-border/30 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-muted-foreground mb-4"
        >
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
        </motion.p>

        {/* Course Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No courses found"
            description="Try adjusting your search or filter to find what you're looking for."
          />
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              key={`${searchQuery}-${courseCategory}-${visibleCount}`}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
            >
              {visible.map((course) => (
                <motion.div key={course.id} variants={item}>
                  <GlassCard
                    className="p-4 sm:p-5 h-full flex flex-col"
                    onClick={() => selectCourse(course.id)}
                  >
                    {/* Top row: emoji + premium */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{categoryEmojis[course.category] || '📚'}</div>
                      {course.isPremium && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                          <Crown className="h-3 w-3" /> Premium
                        </span>
                      )}
                    </div>

                    {/* Title & Instructor */}
                    <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                        <span className="font-semibold text-foreground">{course.rating}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {(course.enrolled / 1000).toFixed(1)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 h-5 font-medium">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Level badge */}
                    <div className="mt-auto">
                      <span className={cn(
                        'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                        course.level === 'Beginner' && 'bg-chart-3/10 text-chart-3',
                        course.level === 'Intermediate' && 'bg-chart-4/10 text-chart-4',
                        course.level === 'Advanced' && 'bg-primary/10 text-primary',
                      )}>
                        {course.level}
                      </span>
                    </div>

                    {/* Progress bar (if enrolled) */}
                    {course.progress > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-primary">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <AnimatedButton
                  variant="outline"
                  icon={<ChevronDown className="h-4 w-4" />}
                  onClick={() => setVisibleCount((v) => v + 6)}
                >
                  Load More
                </AnimatedButton>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}