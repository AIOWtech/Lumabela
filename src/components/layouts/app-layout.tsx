'use client';

import { useAppStore, type PageId } from '@/store/app-store';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { XPBar, StreakDisplay } from '@/components/shared/shared-components';
import { 
  LayoutDashboard, BookOpen, Brain, Trophy, Crown, User, Award, 
  Bell, Settings, LogOut, Search, X, ChevronLeft, Sparkles,
  Home, GraduationCap, MessageSquare, Sun, Moon
} from 'lucide-react';
import { type ReactNode, useState, useRef, useEffect } from 'react';

const navItems: { id: PageId; label: string; icon: ReactNode; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, section: 'main' },
  { id: 'courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" />, section: 'main' },
  { id: 'lumi-ai', label: 'Lumi AI', icon: <Brain className="w-5 h-5" />, section: 'main' },
  { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" />, section: 'community' },
  { id: 'premium', label: 'Premium', icon: <Crown className="w-5 h-5" />, section: 'community' },
];

const personalItems: { id: PageId; label: string; icon: ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'certificates', label: 'Certificates', icon: <Award className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { currentPage, navigate, user, sidebarOpen, setSidebarOpen, toggleSidebar, searchQuery, setSearchQuery, setAuthenticated, setUser } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setAuthenticated(false);
    navigate('landing');
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-card/95 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50 shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-chart-3 rotate-6" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <span className="text-lg font-bold gradient-text">Lumabela</span>
          </motion.div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-accent/50">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="p-4 border-b border-border/50 space-y-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground">Level {user.level} Learner</div>
              </div>
            </div>
            <XPBar xp={user.xp} xpToNext={user.xpToNext} level={user.level} compact />
            <StreakDisplay streak={user.streak} compact />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3">
          <div className="mb-2">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Learn</span>
          </div>
          <div className="space-y-0.5 mb-6">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate(item.id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                  currentPage === item.id
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {item.icon}
                {item.label}
                {item.id === 'lumi-ai' && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-chart-4/10 text-chart-4">AI</span>
                )}
                {item.id === 'premium' && !useAppStore.getState().isPremium && (
                  <Crown className="ml-auto w-3.5 h-3.5 text-primary" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="mb-2">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Personal</span>
          </div>
          <div className="space-y-0.5">
            {personalItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate(item.id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative',
                  currentPage === item.id
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {item.icon}
                {item.label}
                {item.id === 'notifications' && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-chart-3 text-[10px] font-bold text-white">3</span>
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/50 shrink-0">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border/50 flex items-center px-4 sm:px-6 gap-3 shrink-0">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent/50" aria-label="Toggle sidebar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <motion.div
              animate={searchOpen ? { width: '100%' } : {}}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search courses, lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                className="w-full h-9 pl-10 pr-4 text-sm rounded-xl bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </motion.div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('notifications')}
              className="relative p-2 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-chart-3" />
            </motion.button>

            {/* User Avatar */}
            <div ref={userMenuRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-xs">
                  {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name.split(' ')[0] || 'User'}</span>
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border/50">
                      <div className="font-semibold text-sm">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <div className="p-1.5">
                      {[
                        { id: 'profile' as PageId, label: 'Profile', icon: <User className="w-4 h-4" /> },
                        { id: 'certificates' as PageId, label: 'Certificates', icon: <Award className="w-4 h-4" /> },
                        { id: 'settings' as PageId, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { navigate(item.id); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-border/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}