'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { mockFAQs } from '@/lib/mock-data';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.03, 0.98, 0.52, 0.99] } },
};

const categoryColors: Record<string, string> = {
  General: 'text-primary',
  'Courses & Learning': 'text-accent',
  'Premium & Billing': 'text-chart-3',
  Technical: 'text-chart-4',
};

const categoryBgs: Record<string, string> = {
  General: 'bg-primary/10',
  'Courses & Learning': 'bg-accent/10',
  'Premium & Billing': 'bg-chart-3/10',
  Technical: 'bg-chart-4/10',
};

export default function FAQPage() {
  const { navigate } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    let faqs = mockFAQs;

    if (activeCategory) {
      faqs = faqs.filter((f) => f.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      faqs = faqs
        .map((f) => ({
          ...f,
          questions: f.questions.filter(
            (question) =>
              question.q.toLowerCase().includes(q) || question.a.toLowerCase().includes(q)
          ),
        }))
        .filter((f) => f.questions.length > 0);
    }

    return faqs;
  }, [search, activeCategory]);

  const totalQuestions = filteredFAQs.reduce((acc, f) => acc + f.questions.length, 0);

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            FAQ
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Feel free to reach out to our support team.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-lg mx-auto mb-8"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          <AnimatedButton
            variant={activeCategory === null ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All
          </AnimatedButton>
          {mockFAQs.map((f) => (
            <AnimatedButton
              key={f.category}
              variant={activeCategory === f.category ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(activeCategory === f.category ? null : f.category)}
            >
              {f.category}
            </AnimatedButton>
          ))}
        </motion.div>

        {/* Results count */}
        {search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground text-center mb-8"
          >
            {totalQuestions} {totalQuestions === 1 ? 'result' : 'results'} found
          </motion.p>
        )}

        {/* FAQ Sections */}
        {filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <HelpCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try a different search term or browse by category.
            </p>
            <AnimatedButton variant="outline" onClick={() => { setSearch(''); setActiveCategory(null); }}>
              Clear filters
            </AnimatedButton>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {filteredFAQs.map((category) => (
              <motion.div key={category.category} variants={item}>
                <GlassCard className="p-6 sm:p-8" hover3d={false}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', categoryBgs[category.category])}>
                      <HelpCircle className={cn('w-5 h-5', categoryColors[category.category])} />
                    </div>
                    <h2 className="font-bold text-lg">{category.category}</h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {category.questions.length}
                    </span>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((q, i) => (
                      <AccordionItem key={i} value={`${category.category}-${i}`}>
                        <AccordionTrigger className="text-sm sm:text-base hover:no-underline">
                          {q.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                          {q.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <GlassCard className="p-8 sm:p-10 max-w-lg mx-auto text-center" hover3d={false} glow>
            <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Our support team is ready to help you with anything.
            </p>
            <AnimatedButton
              variant="gradient"
              onClick={() => navigate('contact')}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Contact support
            </AnimatedButton>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}