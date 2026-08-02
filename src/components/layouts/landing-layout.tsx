'use client';

import { useAppStore, type PageId } from '@/store/app-store';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

const navItems: { id: PageId; label: string }[] = [
  { id: 'landing', label: 'Home' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

interface LandingLayoutProps { children: ReactNode }

export function LandingLayout({ children }: LandingLayoutProps) {
  const { currentPage, navigate, setAuthenticated, setUser, addXP } = useAppStore();
  const { theme, setTheme } = useTheme();

  const handleLogin = () => {
    setUser({
      id: 'usr_1', name: 'Alex Johnson', email: 'alex@lumabela.com', avatar: '',
      level: 12, xp: 680, xpToNext: 1000, streak: 14,
      badges: ['fast-learner', 'quiz-master', 'week-streak', 'first-course', 'ai-explorer', 'social-butterfly'],
      enrolledCourses: 8, completedCourses: 3, totalHoursLearned: 127, rank: 42,
    });
    setAuthenticated(true);
    addXP(0);
    navigate('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('landing')} className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-chart-3 rotate-6" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <span className="text-lg font-bold gradient-text">Lumabela</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  currentPage === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={handleLogin} className="btn-3d inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                <LogIn className="w-3.5 h-3.5" /> Log in
              </button>
              <button onClick={() => navigate('register')} className="btn-3d inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-gradient-to-r from-primary via-chart-3 to-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <UserPlus className="w-3.5 h-3.5" /> Sign up free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pt-16 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-chart-3 rotate-6" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </div>
                <span className="font-bold gradient-text">Lumabela</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered learning for students worldwide. Transform your potential into expertise.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground grid grid-cols-2 sm:grid-cols-1 gap-x-4">
                {[
                  { label: 'Courses', page: 'courses' as PageId },
                  { label: 'FAQ', page: 'faq' as PageId },
                  { label: 'Contact', page: 'contact' as PageId },
                  { label: 'Premium', page: 'premium' as PageId },
                ].map((l) => (
                  <li key={l.label}>
                    <button onClick={() => navigate(l.page)} className="hover:text-foreground transition-colors">{l.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>&copy; 2025 Lumabela. All rights reserved.</p>
            <p>Made with <span className="text-chart-3">♥</span> for learners everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}