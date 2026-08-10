'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Zap, Star, Users, TrendingUp, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition, StreakDisplay } from '@/components/shared/shared-components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockLeaderboard, mockUser } from '@/lib/mock-data';

const podiumMedals = ['🥇', '🥈', '🥉'];

const podiumColors = [
  'from-yellow-400/20 to-amber-500/20 border-yellow-400/30',
  'from-slate-300/20 to-gray-400/20 border-slate-400/30',
  'from-orange-300/20 to-amber-600/20 border-orange-400/30',
];

function AvatarCircle({ name, size = 'md', highlight }: { name: string; size?: 'sm' | 'md' | 'lg'; highlight?: boolean }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-11 w-11 text-sm', lg: 'h-14 w-14 text-lg' };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold shrink-0',
        sizes[size],
        highlight
          ? 'bg-gradient-to-br from-primary to-chart-3 text-primary-foreground ring-2 ring-primary/50'
          : 'bg-gradient-to-br from-muted to-muted-foreground/20 text-foreground',
      )}
    >
      {initials}
    </div>
  );
}

function MiniXPBar({ xp, maxXP }: { xp: number; maxXP: number }) {
  const percent = Math.round((xp / maxXP) * 100);
  return (
    <div className="w-20 md:w-28 h-1.5 rounded-full bg-muted overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-chart-3"
      />
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState('week');
  const data = mockLeaderboard;
  const maxXP = data[0].xp;
  const currentUserEntry = data.find((d) => d.isCurrentUser);
  const top3 = data.slice(0, 3);

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto py-4 px-4 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-chart-3/20 border border-primary/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Global Leaderboard</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.length.toLocaleString()} active learners
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full max-w-xs mx-auto grid grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          {/* This Week */}
          <TabsContent value="week">
            {/* Podium - Top 3 (Desktop) */}
            <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-end"
              >
                <GlassCard className={cn('w-full p-5 text-center', podiumColors[1])} hover3d={false}>
                  <div className="text-3xl mb-2">{podiumMedals[1]}</div>
                  <AvatarCircle name={top3[1].name} highlight={top3[1].isCurrentUser} />
                  <h3 className="font-bold text-sm mt-2 truncate">{top3[1].name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-bold text-primary">{top3[1].xp.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground">XP</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5">Lv.{top3[1].level}</Badge>
                    <div className="flex items-center gap-0.5 text-chart-3">
                      <Flame className="h-3 w-3" />
                      <span className="text-[11px] font-semibold">{top3[1].streak}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="flex flex-col items-center justify-end"
              >
                <div className="mb-2">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Crown className="h-6 w-6 text-yellow-500 mx-auto" />
                  </motion.div>
                </div>
                <GlassCard className={cn('w-full p-6 text-center glow-gold', podiumColors[0])} hover3d={false} glow>
                  <div className="text-4xl mb-2">{podiumMedals[0]}</div>
                  <AvatarCircle name={top3[0].name} size="lg" highlight={top3[0].isCurrentUser} />
                  <h3 className="font-bold mt-2 truncate">{top3[0].name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-base font-bold text-primary">{top3[0].xp.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground">XP</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5">Lv.{top3[0].level}</Badge>
                    <div className="flex items-center gap-0.5 text-chart-3">
                      <Flame className="h-3 w-3" />
                      <span className="text-[11px] font-semibold">{top3[0].streak}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-end"
              >
                <GlassCard className={cn('w-full p-5 text-center', podiumColors[2])} hover3d={false}>
                  <div className="text-3xl mb-2">{podiumMedals[2]}</div>
                  <AvatarCircle name={top3[2].name} highlight={top3[2].isCurrentUser} />
                  <h3 className="font-bold text-sm mt-2 truncate">{top3[2].name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-bold text-primary">{top3[2].xp.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground">XP</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5">Lv.{top3[2].level}</Badge>
                    <div className="flex items-center gap-0.5 text-chart-3">
                      <Flame className="h-3 w-3" />
                      <span className="text-[11px] font-semibold">{top3[2].streak}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Mobile: Top 3 Cards */}
            <div className="md:hidden space-y-3 mb-6">
              {top3.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard
                    className={cn(
                      'p-4',
                      podiumColors[i],
                      entry.isCurrentUser && 'ring-2 ring-primary/50',
                    )}
                    hover3d={false}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{podiumMedals[i]}</div>
                      <AvatarCircle name={entry.name} highlight={entry.isCurrentUser} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{entry.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-primary">{entry.xp.toLocaleString()} XP</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1">Lv.{entry.level}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-chart-3">
                        <Flame className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">{entry.streak}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Full Leaderboard Table */}
            <GlassCard className="overflow-hidden" hover3d={false}>
              <div className="px-4 py-3 border-b border-border/30">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Full Rankings
                </h3>
              </div>
              <div className="divide-y divide-border/20">
                {data.map((entry, i) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 transition-colors',
                      entry.isCurrentUser && 'bg-primary/5 border-l-2 border-l-primary',
                    )}
                  >
                    {/* Rank */}
                    <div className="w-8 shrink-0 text-center">
                      {entry.rank <= 3 ? (
                        <span className="text-lg">{podiumMedals[entry.rank - 1]}</span>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>
                      )}
                    </div>

                    {/* Avatar + Name */}
                    <AvatarCircle name={entry.name} size="sm" highlight={entry.isCurrentUser} />
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'text-sm font-medium truncate',
                        entry.isCurrentUser && 'text-primary',
                      )}>
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(You)</span>
                        )}
                      </div>
                      <MiniXPBar xp={entry.xp} maxXP={maxXP} />
                    </div>

                    {/* Level */}
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 shrink-0 hidden sm:inline-flex">
                      Lv.{entry.level}
                    </Badge>

                    {/* Streak */}
                    <div className="flex items-center gap-0.5 text-chart-3 shrink-0">
                      <Flame className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">{entry.streak}</span>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-1 shrink-0 w-16 justify-end">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-xs font-bold">{(entry.xp / 1000).toFixed(1)}k</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Your Rank Card */}
            {currentUserEntry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <GlassCard className="p-4" hover3d={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Your Rank</div>
                        <div className="text-2xl font-black text-primary">#{currentUserEntry.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">XP to next rank</div>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <ChevronUp className="h-4 w-4 text-accent" />
                        <span className="text-sm font-bold text-accent">
                          {data[currentUserEntry.rank - 2] ? (data[currentUserEntry.rank - 2].xp - currentUserEntry.xp).toLocaleString() : 0} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </TabsContent>

          {/* All Time */}
          <TabsContent value="alltime">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
              >
                <Trophy className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-lg font-bold mb-1">All Time Rankings</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Cumulative rankings are calculated at the end of each season. Complete more courses and quizzes to climb the all-time ladder!
              </p>
            </div>
          </TabsContent>

          {/* Friends */}
          <TabsContent value="friends">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4"
              >
                <Users className="h-8 w-8 text-accent" />
              </motion.div>
              <h3 className="text-lg font-bold mb-1">Friends Leaderboard</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Connect with friends to see how you compare! Invite friends from your profile settings.
              </p>
              <AnimatedButton
                variant="outline"
                size="md"
                className="mt-4"
                onClick={() => useAppStore.getState().navigate('settings')}
              >
                Invite Friends
              </AnimatedButton>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}