'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition } from '@/components/shared/shared-components';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Settings, User, Palette, Bell, Shield, Camera, Save, Sun, Moon, Monitor,
  Type, Minimize2, Sparkles, Mail, Smartphone, BookOpen, Trophy, Flame, Megaphone,
  Globe, Eye, BarChart3, Lock, Trash2, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.03, 0.98, 0.52, 0.99] } },
};

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div className="min-w-0">
          <Label className="text-sm font-medium cursor-default">{label}</Label>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, setUser } = useAppStore();

  // Account
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [bio, setBio] = useState('Passionate learner exploring the world of technology and design.');

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [showActivity, setShowActivity] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name, email });
    }
    toast.success('Profile updated!');
  };

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy settings saved!');
  };

  const handleEnable2FA = () => {
    setTwoFactor(true);
    toast.success('Two-factor authentication enabled!');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available in demo mode.');
    setShowDeleteConfirm(false);
  };

  return (
    <PageTransition>
      <motion.div className="space-y-6 max-w-4xl mx-auto" variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item}>
          <Tabs defaultValue="account" className="space-y-6">
            {/* Mobile: horizontal, Desktop: vertical */}
            <div className="flex flex-col md:flex-row gap-4">
              <TabsList className="flex md:flex-col h-auto md:w-48 md:gap-0.5 overflow-x-auto">
                <TabsTrigger value="account" className="gap-2 w-full justify-start">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2 w-full justify-start">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2 w-full justify-start">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="gap-2 w-full justify-start">
                  <Shield className="h-4 w-4" />
                  <span>Privacy</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-w-0 space-y-6">
                {/* ===== ACCOUNT TAB ===== */}
                <TabsContent value="account" className="mt-0 space-y-4">
                  <GlassCard className="p-5 sm:p-6 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profile Information
                    </h3>

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-chart-3 to-chart-4 flex items-center justify-center text-xl font-bold text-white">
                          {initials}
                        </div>
                        <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile Photo</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Fields */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="settings-name">Full Name</Label>
                        <Input
                          id="settings-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="settings-email">Email</Label>
                        <Input
                          id="settings-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="settings-bio">Bio</Label>
                        <Textarea
                          id="settings-bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        icon={<Save className="h-4 w-4" />}
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </AnimatedButton>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ===== APPEARANCE TAB ===== */}
                <TabsContent value="appearance" className="mt-0 space-y-4">
                  <GlassCard className="p-5 sm:p-6 space-y-1">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      Appearance
                    </h3>

                    <SettingRow
                      icon={<Sun className="h-4 w-4" />}
                      label="Theme"
                      description="Choose your preferred color theme"
                    >
                      <div className="flex gap-1 bg-muted/60 rounded-lg p-1">
                        {(['light', 'dark', 'system'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                              theme === t
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {t === 'light' && <Sun className="h-3 w-3" />}
                            {t === 'dark' && <Moon className="h-3 w-3" />}
                            {t === 'system' && <Monitor className="h-3 w-3" />}
                            <span className="capitalize">{t}</span>
                          </button>
                        ))}
                      </div>
                    </SettingRow>

                    <Separator />

                    <SettingRow
                      icon={<Type className="h-4 w-4" />}
                      label="Font Size"
                      description="Adjust text size across the platform"
                    >
                      <Select value={fontSize} onValueChange={(v) => setFontSize(v as typeof fontSize)}>
                        <SelectTrigger className="w-28 h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingRow>

                    <Separator />

                    <SettingRow
                      icon={<Minimize2 className="h-4 w-4" />}
                      label="Compact Mode"
                      description="Reduce spacing for more content on screen"
                    >
                      <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                    </SettingRow>

                    <Separator />

                    <SettingRow
                      icon={<Sparkles className="h-4 w-4" />}
                      label="Animations"
                      description="Enable smooth transitions and effects"
                    >
                      <Switch checked={animations} onCheckedChange={setAnimations} />
                    </SettingRow>

                    <div className="flex justify-end pt-2">
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        icon={<Save className="h-4 w-4" />}
                        onClick={handleSaveAppearance}
                      >
                        Save
                      </AnimatedButton>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ===== NOTIFICATIONS TAB ===== */}
                <TabsContent value="notifications" className="mt-0 space-y-4">
                  <GlassCard className="p-5 sm:p-6 space-y-1">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      Notification Preferences
                    </h3>

                    <SettingRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email Notifications"
                      description="Receive updates via email"
                    >
                      <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </SettingRow>
                    <Separator />
                    <SettingRow
                      icon={<Smartphone className="h-4 w-4" />}
                      label="Push Notifications"
                      description="Get push notifications in your browser"
                    >
                      <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                    </SettingRow>
                    <Separator />
                    <SettingRow
                      icon={<BookOpen className="h-4 w-4" />}
                      label="Course Updates"
                      description="New lessons and course content"
                    >
                      <Switch checked={courseUpdates} onCheckedChange={setCourseUpdates} />
                    </SettingRow>
                    <Separator />
                    <SettingRow
                      icon={<Trophy className="h-4 w-4" />}
                      label="Achievement Alerts"
                      description="Badges, streaks, and level-ups"
                    >
                      <Switch checked={achievementAlerts} onCheckedChange={setAchievementAlerts} />
                    </SettingRow>
                    <Separator />
                    <SettingRow
                      icon={<Flame className="h-4 w-4" />}
                      label="Weekly Digest"
                      description="Summary of your weekly progress"
                    >
                      <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                    </SettingRow>
                    <Separator />
                    <SettingRow
                      icon={<Megaphone className="h-4 w-4" />}
                      label="Marketing Emails"
                      description="Promotions and new feature announcements"
                    >
                      <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </SettingRow>

                    <div className="flex justify-end pt-2">
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        icon={<Save className="h-4 w-4" />}
                        onClick={handleSaveNotifications}
                      >
                        Save
                      </AnimatedButton>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ===== PRIVACY TAB ===== */}
                <TabsContent value="privacy" className="mt-0 space-y-4">
                  <GlassCard className="p-5 sm:p-6 space-y-1">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Privacy & Security
                    </h3>

                    <SettingRow
                      icon={<Globe className="h-4 w-4" />}
                      label="Profile Visibility"
                      description="Control who can see your profile"
                    >
                      <Select value={profileVisibility} onValueChange={(v) => setProfileVisibility(v as typeof profileVisibility)}>
                        <SelectTrigger className="w-32 h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingRow>

                    <Separator />

                    <SettingRow
                      icon={<Eye className="h-4 w-4" />}
                      label="Show Activity Status"
                      description="Let others see when you're online"
                    >
                      <Switch checked={showActivity} onCheckedChange={setShowActivity} />
                    </SettingRow>

                    <Separator />

                    <SettingRow
                      icon={<BarChart3 className="h-4 w-4" />}
                      label="Show on Leaderboard"
                      description="Appear on the public leaderboard"
                    >
                      <Switch checked={showLeaderboard} onCheckedChange={setShowLeaderboard} />
                    </SettingRow>

                    <Separator />

                    <div className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Add an extra layer of security to your account
                          </p>
                          <div className="mt-2">
                            {twoFactor ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                Enabled
                              </span>
                            ) : (
                              <AnimatedButton
                                variant="outline"
                                size="sm"
                                icon={<Shield className="h-3.5 w-3.5" />}
                                onClick={handleEnable2FA}
                              >
                                Enable
                              </AnimatedButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        icon={<Save className="h-4 w-4" />}
                        onClick={handleSavePrivacy}
                      >
                        Save
                      </AnimatedButton>
                    </div>
                  </GlassCard>

                  {/* Danger Zone */}
                  <GlassCard className="p-5 sm:p-6 border-destructive/30 hover:border-destructive/50 transition-colors">
                    <h3 className="font-semibold flex items-center gap-2 text-destructive mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>

                    {!showDeleteConfirm ? (
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => setShowDeleteConfirm(true)}
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                      >
                        Delete my account
                      </AnimatedButton>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-sm font-medium text-destructive">
                            Are you absolutely sure? This action cannot be undone.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(false)}
                          >
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton
                            variant="primary"
                            size="sm"
                            icon={<Trash2 className="h-3.5 w-3.5" />}
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                          >
                            Yes, delete my account
                          </AnimatedButton>
                        </div>
                      </motion.div>
                    )}
                  </GlassCard>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}