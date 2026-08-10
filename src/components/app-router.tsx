'use client';

import { useAppStore, type PageId } from '@/store/app-store';
import { LandingLayout } from '@/components/layouts/landing-layout';
import { AppLayout } from '@/components/layouts/app-layout';
import { useState, useEffect, type ComponentType } from 'react';
import LandingPage from '@/views/landing-page';

const publicPages: PageId[] = ['landing', 'login', 'register', 'contact', 'faq', 'not-found', 'server-error'];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  const { currentPage, isAuthenticated } = useAppStore();
  const [PageComponent, setPageComponent] = useState<ComponentType | null>(null);
  
  const isPublicPage = publicPages.includes(currentPage);
  const showLandingLayout = isPublicPage || !isAuthenticated;

  useEffect(() => {
    let cancelled = false;
    
    if (currentPage === 'landing') {
      setPageComponent(() => LandingPage);
      return;
    }

    setPageComponent(null);
    const pageImports: Record<string, () => Promise<any>> = {
      'login': () => import('@/views/login-page'),
      'register': () => import('@/views/register-page'),
      'contact': () => import('@/views/contact-page'),
      'faq': () => import('@/views/faq-page'),
      'dashboard': () => import('@/views/dashboard-page'),
      'courses': () => import('@/views/courses-page'),
      'course-details': () => import('@/views/course-details-page'),
      'lesson-player': () => import('@/views/lesson-player-page'),
      'lumi-ai': () => import('@/views/lumi-ai-page'),
      'quiz': () => import('@/views/quiz-page'),
      'leaderboard': () => import('@/views/leaderboard-page'),
      'premium': () => import('@/views/premium-page'),
      'profile': () => import('@/views/profile-page'),
      'certificates': () => import('@/views/certificates-page'),
      'notifications': () => import('@/views/notifications-page'),
      'settings': () => import('@/views/settings-page'),
      'not-found': () => import('@/views/not-found-page'),
      'server-error': () => import('@/views/server-error-page'),
    };

    const loader = pageImports[currentPage] || pageImports['not-found'];
    loader().then((m) => {
      if (!cancelled) setPageComponent(() => m.default);
    }).catch(() => {
      if (!cancelled) setPageComponent(() => LandingPage);
    });

    return () => { cancelled = true; };
  }, [currentPage]);

  const content = PageComponent ? <PageComponent /> : <LoadingFallback />;

  return showLandingLayout ? (
    <LandingLayout>{content}</LandingLayout>
  ) : (
    <AppLayout>{content}</AppLayout>
  );
}