'use client';

import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { ArrowRight, Star, Check, Crown, Users, BookOpen } from 'lucide-react';

const features = [
  { emoji: '🧠', title: 'AI Tutor — Lumi', desc: 'Personalized explanations and adaptive quizzes that match your pace.', color: 'text-primary', bg: 'bg-primary/10' },
  { emoji: '📊', title: 'Progress Tracking', desc: 'Detailed analytics, streaks, and XP rewards keep you motivated.', color: 'text-chart-3', bg: 'bg-chart-3/10' },
  { emoji: '🏆', title: 'Certificates', desc: 'Earn verifiable digital certificates to showcase your achievements.', color: 'text-accent', bg: 'bg-accent/10' },
  { emoji: '🌐', title: 'Community', desc: 'Join learners worldwide with leaderboards and social features.', color: 'text-chart-4', bg: 'bg-chart-4/10' },
];

const courses = [
  { title: 'Advanced React Patterns', instructor: 'Sarah Chen', category: 'programming', rating: 4.9, enrolled: 15420, progress: 68, isPremium: false },
  { title: 'UI/UX Design Masterclass', instructor: 'Marcus Rivera', category: 'design', rating: 4.8, enrolled: 22150, progress: 35, isPremium: true },
  { title: 'Machine Learning Fundamentals', instructor: 'Dr. Priya Patel', category: 'data-science', rating: 4.7, enrolled: 31200, progress: 12, isPremium: false },
];

const pricing = [
  { name: 'Free', price: '$0', period: '/forever', features: ['10 free courses', 'Basic AI tutoring', 'Progress tracking', 'Community access'], cta: 'Get Started', popular: false, page: 'login' as const },
  { name: 'Pro', price: '$12.99', period: '/month', features: ['All 200+ courses', 'Advanced AI tutoring', 'Certificates & badges', 'Offline downloads', 'Priority support'], cta: 'Go Pro', popular: true, page: 'register' as const },
  { name: 'Team', price: '$29.99', period: '/month', features: ['Everything in Pro', 'Team analytics', 'Admin dashboard', 'Custom learning paths', 'Dedicated support'], cta: 'Contact Sales', popular: false, page: 'contact' as const },
];

export default function LandingPage() {
  const { navigate } = useAppStore();

  return (
    <div className="relative">
      {/* Hero */}
      <section className="mesh-gradient min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-16">
        <div className="animate-[fadeInUp_0.6s_ease-out] text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Learn Anything <br className="hidden sm:block" />with{' '}
            <span className="gradient-text">AI-Powered</span> Brilliance
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Lumabela uses adaptive AI to personalize your learning path, track your progress, and help you master any skill faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button onClick={() => navigate('register')} className="btn-3d inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-medium rounded-xl bg-gradient-to-r from-primary via-chart-3 to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200">
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('courses')} className="btn-3d inline-flex items-center justify-center h-12 px-7 text-base font-medium rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200">
              Explore Courses
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Users, label: '50K+ Learners' },
              { icon: BookOpen, label: '200+ Courses' },
              { icon: Star, label: '4.9★ Rating' },
            ].map((s) => (
              <span key={s.label} className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground">
                <s.icon className="w-4 h-4 text-primary" /> {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Why <span className="gradient-text">Lumabela</span>?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Everything you need to learn smarter, not harder.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={f.title} className="card-3d glass rounded-xl p-5" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3', f.bg)}>
                  {f.emoji}
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Popular <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Start with the most loved courses by our community.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.title} onClick={() => navigate('course-details')} className="card-3d glass rounded-xl p-5 cursor-pointer hover:bg-card/90 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">{c.category}</span>
                  {c.isPremium && <Crown className="w-3.5 h-3.5 text-chart-3" />}
                </div>
                <h3 className="font-semibold mb-1 line-clamp-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{c.instructor}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="font-medium">{c.rating}</span>
                    <span className="text-muted-foreground">({(c.enrolled / 1000).toFixed(1)}k)</span>
                  </div>
                  {c.progress > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-chart-3/10 text-chart-3 font-medium">{c.progress}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-chart-3/10 to-accent/20 border border-primary/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-3">
              Start Learning <span className="gradient-text">Today</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join 50,000+ learners mastering new skills with AI-powered personalized education.
            </p>
            <button onClick={() => navigate('register')} className="btn-3d inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-medium rounded-xl bg-gradient-to-r from-primary via-chart-3 to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Choose the plan that fits your learning goals.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {pricing.map((p) => (
              <div key={p.name} className={cn('card-3d glass rounded-xl p-6 flex flex-col', p.popular && 'border-primary/30 animate-pulse-glow')}>
                {p.popular && (
                  <span className="text-xs font-semibold bg-gradient-to-r from-primary to-chart-3 text-primary-foreground px-2.5 py-0.5 rounded-full self-start mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-3 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(p.page)}
                  className={cn(
                    'btn-3d w-full inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-xl transition-all duration-200',
                    p.popular
                      ? 'bg-gradient-to-r from-primary via-chart-3 to-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'border-2 border-primary/30 text-primary hover:bg-primary/10'
                  )}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}