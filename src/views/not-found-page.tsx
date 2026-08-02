'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { useAppStore } from '@/store/app-store';
import { Home, Search, ArrowRight, Compass } from 'lucide-react';

export default function NotFoundPage() {
  const { navigate } = useAppStore();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.03, 0.98, 0.52, 0.99] }}
        className="text-center max-w-lg w-full"
      >
        <GlassCard className="p-8 sm:p-12" hover3d={false}>
          {/* Animated 404 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <h1 className="text-8xl sm:text-9xl font-black gradient-text leading-none select-none">
              404
            </h1>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-chart-3/10 mb-6"
          >
            <Compass className="w-10 h-10 text-chart-3" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-3"
          >
            Page not found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <AnimatedButton
              variant="gradient"
              onClick={() => navigate('landing')}
              icon={<Home className="w-4 h-4" />}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Go home
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              onClick={() => navigate('courses')}
              icon={<Search className="w-4 h-4" />}
            >
              Browse courses
            </AnimatedButton>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}