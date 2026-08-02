'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Send, Bot, User, BookOpen, Calendar, BarChart3, MessageSquare, ArrowRight, Zap } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition } from '@/components/shared/shared-components';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const suggestionChips = [
  'Explain React hooks',
  'Help me study',
  'Create a quiz',
  'Study plan',
];

const quickActions = [
  { icon: <BookOpen className="h-5 w-5 text-primary" />, label: 'Explain a concept', desc: 'Get clear explanations' },
  { icon: <Brain className="h-5 w-5 text-chart-3" />, label: 'Practice problems', desc: 'Test your knowledge' },
  { icon: <Calendar className="h-5 w-5 text-accent" />, label: 'Study plan', desc: 'Personalized path' },
  { icon: <BarChart3 className="h-5 w-5 text-chart-4" />, label: 'Review my progress', desc: 'Track your growth' },
];

const recentTopics = [
  'React Context API',
  'TypeScript Generics',
  'CSS Grid Layout',
  'State Machines',
  'Custom Hooks',
];

export default function LumiAIPage() {
  const { user } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm Lumi, your AI tutor. How can I help you learn today?`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'ai',
        content: data.reply,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 800);
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now() + 1}`,
            role: 'ai',
            content: "Sorry, I'm having trouble connecting. Please try again.",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        toast.error('Failed to get AI response');
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSuggestionClick = (chip: string) => {
    sendMessage(chip);
  };

  const handleQuickAction = (label: string) => {
    const actionMessages: Record<string, string> = {
      'Explain a concept': 'Can you explain compound components in React?',
      'Practice problems': 'Give me some practice problems on React hooks',
      'Study plan': 'Create a study plan for learning TypeScript',
      'Review my progress': 'Help me review my learning progress',
    };
    sendMessage(actionMessages[label] || label);
  };

  const showSuggestions = messages.length === 1;

  return (
    <PageTransition>
      <div className="h-full flex flex-col lg:flex-row gap-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0"
          >
            <div className="relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 md:p-5 overflow-hidden">
              {/* Animated gradient border top */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-chart-3 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-chart-3/20 border border-primary/20 flex items-center justify-center"
                >
                  <Brain className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
                    Lumi AI
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.span>
                  </h1>
                  <p className="text-xs text-muted-foreground">Your AI Learning Assistant</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 px-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--muted)) transparent' }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index > 1 ? 0.05 : 0 }}
                  className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'ai' && (
                    <div className="shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] md:max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-card/80 backdrop-blur-sm border border-border/50 rounded-tl-sm'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className={cn(
                      'text-[10px] mt-1.5',
                      msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="shrink-0 h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl rounded-tl-sm px-5 py-4">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                          }}
                          className="h-2 w-2 rounded-full bg-primary/50"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestion Chips */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="shrink-0 flex flex-wrap gap-2 px-1 pb-3"
              >
                {suggestionChips.map((chip) => (
                  <motion.button
                    key={chip}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSuggestionClick(chip)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <MessageSquare className="h-3 w-3" />
                    {chip}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="shrink-0"
          >
            <div className="relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl p-2 flex items-center gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Lumi anything..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm placeholder:text-muted-foreground/60"
                disabled={isTyping}
              />
              <AnimatedButton
                variant="primary"
                size="md"
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                icon={<Send className="h-4 w-4" />}
                className="shrink-0"
              />
            </div>
          </motion.div>
        </div>

        {/* Suggestion Sidebar - Desktop */}
        <div className="hidden lg:block w-72 xl:w-80 shrink-0">
          <div className="sticky top-4 space-y-4">
            {/* Quick Actions */}
            <GlassCard className="p-4" hover3d={false}>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action.label)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-card/40 hover:bg-card/70 transition-colors text-left group"
                  >
                    <div className="shrink-0">{action.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-[11px] text-muted-foreground">{action.desc}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            {/* Recent Topics */}
            <GlassCard className="p-4" hover3d={false}>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                Recent Topics
              </h3>
              <div className="space-y-1.5">
                {recentTopics.map((topic, i) => (
                  <motion.button
                    key={topic}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    whileHover={{ x: 4 }}
                    onClick={() => sendMessage(`Tell me about ${topic}`)}
                    className="w-full text-left text-sm text-muted-foreground hover:text-foreground py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

