'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition } from '@/components/shared/shared-components';
import { mockCourseDetails } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Play, CheckCircle2,
  PlayCircle, FileText, HelpCircle, Clock, MessageSquare,
  BookOpen, Send, CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';

const typeIcons: Record<string, typeof PlayCircle> = {
  video: PlayCircle,
  exercise: FileText,
  quiz: HelpCircle,
};

const discussionComments = [
  {
    id: 'd1',
    author: 'Sarah L.',
    avatar: 'SL',
    time: '2 days ago',
    text: 'This explanation of compound components finally made it click for me. The way the context sharing works between parent and children is so elegant!',
  },
  {
    id: 'd2',
    author: 'Mike R.',
    avatar: 'MR',
    time: '1 day ago',
    text: 'Great lesson! I have a question though — how does this pattern compare to using render props in terms of performance?',
  },
  {
    id: 'd3',
    author: 'Elena K.',
    avatar: 'EK',
    time: '5 hours ago',
    text: 'I used this pattern in my project and it reduced my component code by 40%. Highly recommend trying it out in a real project.',
  },
];

export default function LessonPlayerPage() {
  const { selectedLessonId, selectLesson, addXP, navigate } = useAppStore();
  const [activeTab, setActiveTab] = useState('content');
  const [isCompleted, setIsCompleted] = useState(false);
  const [noteText, setNoteText] = useState('');

  const details = mockCourseDetails;

  // Flatten all lessons to build navigation
  const allLessons = useMemo(
    () => details.modules.flatMap((mod) => mod.lessons.map((l) => ({ ...l, moduleId: mod.id, moduleTitle: mod.title }))),
    []
  );

  const currentIdx = allLessons.findIndex((l) => l.id === selectedLessonId);
  const currentLesson = currentIdx >= 0 ? allLessons[currentIdx] : allLessons[0];
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const completedCount = allLessons.filter((l) => l.completed || l.id === currentLesson?.id && isCompleted).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const handleComplete = () => {
    if (isCompleted) return;
    setIsCompleted(true);
    addXP(25);
    toast.success('Lesson completed! +25 XP');
  };

  const handleNext = () => {
    if (nextLesson) selectLesson(nextLesson.id);
  };

  const handlePrev = () => {
    if (prevLesson) selectLesson(prevLesson.id);
  };

  if (!currentLesson) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Lesson not found</h2>
          <AnimatedButton variant="outline" onClick={() => navigate('courses')} icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Courses
          </AnimatedButton>
        </div>
      </PageTransition>
    );
  }

  const TypeIcon = typeIcons[currentLesson.type] || PlayCircle;

  return (
    <PageTransition>
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress indicator at top */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {completedCount}/{allLessons.length} lessons
            </span>
            <Progress value={progressPercent} className="h-1.5 flex-1" />
            <span className="text-xs font-semibold text-primary">{progressPercent}%</span>
          </div>
        </motion.div>

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-4"
        >
          <AnimatedButton variant="ghost" size="sm" onClick={() => navigate('course-details')} icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </AnimatedButton>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{details.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentLesson.moduleTitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <AnimatedButton variant="ghost" size="sm" onClick={handlePrev} disabled={!prevLesson} icon={<ChevronLeft className="h-4 w-4" />}>
              Prev
            </AnimatedButton>
            <AnimatedButton variant="ghost" size="sm" onClick={handleNext} disabled={!nextLesson} iconRight={<ChevronRight className="h-4 w-4" />}>
              Next
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 flex-1 min-h-0">
          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-4 min-h-0"
          >
            {/* Video Placeholder */}
            <div className="relative w-full aspect-video rounded-xl bg-zinc-900 dark:bg-zinc-950 overflow-hidden shadow-2xl shadow-black/30 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-3/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors"
                >
                  <Play className="h-7 w-7 text-white ml-1" fill="white" />
                </motion.div>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/60">
                <Clock className="h-3.5 w-3.5" />
                {currentLesson.duration}
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-white/70 capitalize flex items-center gap-1">
                  <TypeIcon className="h-3 w-3" />
                  {currentLesson.type}
                </span>
              </div>
            </div>

            {/* Lesson title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1">{currentLesson.title}</h1>
              <p className="text-sm text-muted-foreground">
                {currentLesson.moduleTitle} • {currentLesson.duration}
              </p>
            </div>

            {/* Tabs: Content | Notes | Discussion */}
            <GlassCard className="overflow-hidden" hover3d={false}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent h-11 p-0">
                  <TabsTrigger
                    value="content"
                    className="flex-1 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="flex-1 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="discussion"
                    className="flex-1 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Discussion
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="p-4 sm:p-5 mt-0">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      In this lesson, we explore the fundamental concepts behind {currentLesson.title.toLowerCase()} and how they apply to real-world scenarios. Understanding these patterns will help you write more maintainable and scalable code.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      The key insight is that by structuring our components in a specific way, we can achieve a level of flexibility that would be difficult to accomplish with prop-drilling alone. This approach leverages React&apos;s implicit state sharing through Context.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Let&apos;s start by examining a simple example. Consider a scenario where you need a set of related components that share some internal state, but you want to keep the API clean and declarative for consumers of your component library.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      By the end of this lesson, you&apos;ll be able to identify when this pattern is appropriate and implement it confidently in your own projects. The exercise that follows will give you hands-on practice.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="p-4 sm:p-5 mt-0">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Take notes for this lesson..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[180px] bg-card/40 resize-y"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{noteText.length} characters</span>
                      <AnimatedButton variant="outline" size="sm" icon={<Send className="h-3.5 w-3.5" />}>
                        Save Notes
                      </AnimatedButton>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="p-4 sm:p-5 mt-0">
                  <div className="space-y-4">
                    {discussionComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-chart-3/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2 border-t border-border/30">
                      <Input
                        placeholder="Add a comment..."
                        className="bg-card/40"
                      />
                      <AnimatedButton variant="primary" size="sm" icon={<Send className="h-3.5 w-3.5" />}>
                        Post
                      </AnimatedButton>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </motion.div>

          {/* Right Sidebar - Lesson List (desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="hidden lg:block"
          >
            <GlassCard className="p-4 h-[calc(100vh-180px)] flex flex-col" hover3d={false}>
              <h3 className="font-semibold text-sm mb-3">Course Content</h3>
              <ScrollArea className="flex-1 -mx-1">
                <div className="space-y-4 px-1">
                  {details.modules.map((mod, modIdx) => (
                    <div key={mod.id}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Module {modIdx + 1}: {mod.title}
                      </p>
                      <div className="space-y-0.5">
                        {mod.lessons.map((lesson) => {
                          const isCurrent = lesson.id === currentLesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(lesson.id)}
                              className={cn(
                                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-colors',
                                isCurrent
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-card/60 text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {lesson.completed || (isCurrent && isCompleted) ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-chart-3 shrink-0" />
                              ) : isCurrent ? (
                                <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                              ) : (
                                <span className="h-3.5 w-3.5 rounded-full border border-border/60 shrink-0" />
                              )}
                              <span className="truncate flex-1">{lesson.title}</span>
                              <span className="text-[10px] text-muted-foreground shrink-0">{lesson.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </GlassCard>
          </motion.aside>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 pb-6 pt-4 border-t border-border/30"
        >
          <AnimatedButton
            variant={isCompleted ? 'secondary' : 'gradient'}
            size="lg"
            className="flex-1 sm:flex-none"
            onClick={handleComplete}
            disabled={isCompleted}
            icon={isCompleted ? <CheckCheck className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          >
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </AnimatedButton>
          <AnimatedButton
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
            onClick={handleNext}
            disabled={!nextLesson}
            iconRight={<ChevronRight className="h-5 w-5" />}
          >
            {nextLesson ? 'Next Lesson' : 'Course Complete 🎉'}
          </AnimatedButton>
        </motion.div>
      </div>
    </PageTransition>
  );
}