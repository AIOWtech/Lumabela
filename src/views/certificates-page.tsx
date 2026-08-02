'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition, EmptyState } from '@/components/shared/shared-components';
import { mockCertificates } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Share2, ExternalLink, Star, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

type Filter = 'all' | 'completed' | 'in-progress';

const gradeColors: Record<string, string> = {
  'A+': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'A': 'bg-primary/15 text-primary border-primary/30',
  'B+': 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  'B': 'bg-chart-4/15 text-chart-4 border-chart-4/30',
};

const gradients = [
  'from-primary/20 via-chart-3/10 to-chart-4/20',
  'from-chart-3/20 via-chart-4/10 to-primary/20',
  'from-chart-4/20 via-primary/10 to-chart-3/20',
];

export default function CertificatesPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = mockCertificates.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return true; // All mock certs are completed
    return false;
  });

  const filters: { label: string; value: Filter; count: number }[] = [
    { label: 'All', value: 'all', count: mockCertificates.length },
    { label: 'Completed', value: 'completed', count: mockCertificates.length },
    { label: 'In Progress', value: 'in-progress', count: 0 },
  ];

  return (
    <PageTransition>
      <motion.div className="space-y-6 max-w-5xl mx-auto" variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Certificates</h1>
              <p className="text-sm text-muted-foreground">
                {mockCertificates.length} certificate{mockCertificates.length !== 1 ? 's' : ''} earned
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={item} className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === f.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/80'
              )}
            >
              {f.label}
              <span className={cn('ml-1.5 text-xs', filter === f.value ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                {f.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        {filtered.length === 0 ? (
          <motion.div variants={item}>
            <GlassCard className="p-6">
              <EmptyState
                icon="📜"
                title="No Certificates Yet"
                description="Complete a course and pass the final assessment to earn your first certificate."
              />
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  variants={item}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard
                    className={cn(
                      'p-0 overflow-hidden',
                      'border border-border/50',
                    )}
                    gradient
                  >
                    {/* Decorative Top */}
                    <div className={cn('relative h-28 bg-gradient-to-br flex items-center justify-center', gradients[i % gradients.length])}>
                      {/* Decorative circles */}
                      <div className="absolute top-3 right-3 w-16 h-16 rounded-full border border-white/10" />
                      <div className="absolute bottom-2 left-4 w-10 h-10 rounded-full border border-white/10" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Award className="h-12 w-12 text-primary/60" />
                      </div>
                      {/* Grade Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full border', gradeColors[cert.grade] || gradeColors['B'])}>
                          {cert.grade}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Title & Instructor */}
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">by {cert.instructor}</p>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-primary" />
                        <span>Completed {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          icon={<ExternalLink className="h-3.5 w-3.5" />}
                          onClick={() => toast.info('Certificate viewer would open here')}
                          className="w-full"
                        >
                          View Certificate
                        </AnimatedButton>
                        <div className="flex gap-2">
                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            icon={<Download className="h-3.5 w-3.5" />}
                            onClick={() => toast.success('Certificate downloaded!')}
                            className="flex-1"
                          >
                            Download
                          </AnimatedButton>
                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            icon={<Share2 className="h-3.5 w-3.5" />}
                            onClick={() => toast.success('Share link copied for LinkedIn!')}
                            className="flex-1"
                          >
                            LinkedIn
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  );
}