'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, Sparkles, ArrowRight, Zap, BookOpen, Brain, Shield, Download, Users, BarChart3, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition } from '@/components/shared/shared-components';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PricingTier {
  name: string;
  price: number;
  annualPrice: number;
  description: string;
  features: { text: string; included: boolean }[];
  highlighted?: boolean;
  cta: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    annualPrice: 0,
    description: 'Get started with essential learning tools',
    features: [
      { text: 'Basic course library access', included: true },
      { text: '5 AI questions per day', included: true },
      { text: 'Community forum access', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Unlimited AI tutoring', included: false },
      { text: 'Certificates of completion', included: false },
      { text: 'Offline downloads', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Current Plan',
  },
  {
    name: 'Pro',
    price: 12.99,
    annualPrice: 7.79,
    description: 'Everything you need for serious learning',
    highlighted: true,
    features: [
      { text: 'All courses — unlimited access', included: true },
      { text: 'Unlimited AI tutoring', included: true },
      { text: 'Certificates of completion', included: true },
      { text: 'Priority support', included: true },
      { text: 'Offline downloads', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Team features', included: false },
    ],
    cta: 'Get Started',
  },
  {
    name: 'Team',
    price: 29.99,
    annualPrice: 17.99,
    description: 'For teams that learn together',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team analytics dashboard', included: true },
      { text: 'Admin management tools', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Bulk license management', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'API access', included: true },
      { text: 'SSO integration', included: true },
    ],
    cta: 'Get Started',
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your Lumabela Premium subscription at any time. You will continue to have access to premium features until the end of your current billing period. No questions asked.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Absolutely! New users get a 7-day free trial of Pro. You can explore all premium features risk-free. If you decide not to continue, you will automatically be moved to the Free plan.',
  },
  {
    question: 'How does team billing work?',
    answer: 'Team plans are billed per seat per month. You can add or remove team members at any time, and billing adjusts automatically. Annual team plans offer the same 40% savings as individual plans.',
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! We offer 50% off Pro for verified students with a valid .edu email address. Contact our support team to get your student discount activated.',
  },
];

export default function PremiumPage() {
  const { isPremium, setPremium, navigate } = useAppStore();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleSubscribe = (tierName: string) => {
    if (tierName === 'Free') return;
    setPremium(true);
    navigate('dashboard');
    toast.success('Welcome to Premium! 🎉');
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto py-6 px-4 md:px-0">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-3/20 border border-primary/20 mb-4 relative"
          >
            <Crown className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping opacity-20" />
          </motion.div>

          <h1 className="text-2xl md:text-4xl font-black mb-3">
            Unlock Your{' '}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-primary bg-clip-text text-transparent">
              Full Potential
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Get unlimited access to courses, AI tutoring, certificates, and more. Start your free trial today.
          </p>

          {/* Annual Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <span className={cn('text-sm font-medium', !annualBilling && 'text-foreground', annualBilling && 'text-muted-foreground')}>
              Monthly
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors duration-200',
                annualBilling ? 'bg-primary' : 'bg-muted',
              )}
            >
              <motion.div
                animate={{ x: annualBilling ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"
              />
            </button>
            <span className={cn('text-sm font-medium', annualBilling && 'text-foreground', !annualBilling && 'text-muted-foreground')}>
              Annual
            </span>
            {annualBilling && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent"
              >
                <Sparkles className="h-3 w-3" />
                Save 40%
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-12">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
              className={cn(
                'relative',
                tier.highlighted && 'md:-mt-3 md:mb-3',
              )}
            >
              {/* Most Popular Badge */}
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-chart-3 text-primary-foreground border-0 shadow-lg shadow-primary/25 px-3 py-0.5 text-[11px] font-bold">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <GlassCard
                className={cn(
                  'p-5 md:p-6 h-full flex flex-col',
                  tier.highlighted && 'ring-1 ring-primary/30',
                )}
                gradient={tier.highlighted}
                hover3d={!tier.highlighted}
                glow={tier.highlighted}
              >
                {/* Tier Header */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-base font-bold',
                      tier.highlighted ? 'text-primary' : 'text-foreground',
                    )}>
                      {tier.name}
                    </span>
                    {tier.highlighted && (
                      <Zap className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={annualBilling ? 'annual' : 'monthly'}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={cn(
                          'text-3xl md:text-4xl font-black',
                          tier.highlighted && 'bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent',
                        )}
                      >
                        ${tier.price === 0 ? '0' : (annualBilling ? tier.annualPrice : tier.price).toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  {annualBilling && tier.price > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] text-muted-foreground mt-0.5"
                    >
                      Billed ${(tier.annualPrice * 12).toFixed(2)} annually
                    </motion.p>
                  )}
                </div>

                <Separator className="mb-5" />

                {/* Features */}
                <div className="space-y-2.5 flex-1 mb-5">
                  {tier.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <div className="h-5 w-5 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={cn(
                        'text-sm',
                        feature.included ? 'text-foreground' : 'text-muted-foreground/60',
                      )}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {tier.name === 'Free' ? (
                  <AnimatedButton
                    variant="ghost"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    variant={tier.highlighted ? 'gradient' : 'primary'}
                    size="lg"
                    className="w-full"
                    onClick={() => handleSubscribe(tier.name)}
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    {tier.name === 'Pro' && isPremium ? 'Current Plan' : tier.cta}
                  </AnimatedButton>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <h2 className="text-lg font-bold text-center mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <GlassCard key={i} className="overflow-hidden" hover3d={false}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-semibold pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFAQ === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFAQ === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <Separator className="mb-3" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}