'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, ArrowRight, RotateCcw, Trophy, Zap, Star, BookOpen } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { PageTransition } from '@/components/shared/shared-components';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockQuizQuestions } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function QuizPage() {
  const { addXP, navigate } = useAppStore();
  const questions = mockQuizQuestions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Timer
  useEffect(() => {
    if (quizCompleted) return;
    const timer = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizCompleted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const q = questions[currentQuestion];
  const isCorrect = selectedAnswer === q.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = index;
      return next;
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      // Calculate score
      const correctCount = answers.reduce((acc, ans, i) => {
        return acc + (ans === questions[i].correctAnswer ? 1 : 0);
      }, 0) + (selectedAnswer === q.correctAnswer ? 1 : 0);
      const totalCorrect = correctCount;
      const xpEarned = totalCorrect * 50 + 25; // 50 XP per correct + 25 bonus for completion
      addXP(xpEarned);
      toast.success(`+${xpEarned} XP earned!`);
    }
  };

  // Animated score counter
  useEffect(() => {
    if (!quizCompleted) return;
    const correctCount = answers.reduce((acc, ans, i) => {
      return acc + (ans === questions[i].correctAnswer ? 1 : 0);
    }, 0) + (selectedAnswer === q.correctAnswer ? 1 : 0);
    const target = Math.round((correctCount / questions.length) * 100);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current > target) {
        clearInterval(interval);
        setAnimatedScore(target);
        return;
      }
      setAnimatedScore(current);
    }, 20);
    return () => clearInterval(interval);
  }, [quizCompleted, answers, selectedAnswer, q.correctAnswer, questions.length]);

  const getGrade = (percentage: number) => {
    if (percentage >= 97) return { grade: 'A+', color: 'text-chart-3' };
    if (percentage >= 93) return { grade: 'A', color: 'text-accent' };
    if (percentage >= 90) return { grade: 'A-', color: 'text-accent' };
    if (percentage >= 87) return { grade: 'B+', color: 'text-primary' };
    if (percentage >= 83) return { grade: 'B', color: 'text-primary' };
    if (percentage >= 80) return { grade: 'B-', color: 'text-primary' };
    if (percentage >= 77) return { grade: 'C+', color: 'text-chart-4' };
    if (percentage >= 73) return { grade: 'C', color: 'text-chart-4' };
    if (percentage >= 70) return { grade: 'C-', color: 'text-chart-4' };
    if (percentage >= 67) return { grade: 'D+', color: 'text-chart-3' };
    if (percentage >= 60) return { grade: 'D', color: 'text-chart-3' };
    return { grade: 'F', color: 'text-destructive' };
  };

  const correctCount = answers.reduce((acc, ans, i) => {
    return acc + (ans === questions[i].correctAnswer ? 1 : 0);
  }, 0) + (selectedAnswer === q.correctAnswer ? 1 : 0);
  const percentage = Math.round((correctCount / questions.length) * 100);
  const { grade, color: gradeColor } = getGrade(percentage);
  const xpEarned = correctCount * 50 + 25;

  // Completion screen
  if (quizCompleted) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-3/20 border border-primary/30 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            Quiz Complete!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-sm mb-8"
          >
            {formatTime(timeElapsed)} · {questions.length} questions
          </motion.p>

          <GlassCard className="w-full max-w-md p-6 md:p-8 mb-8" hover3d={false}>
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="text-6xl md:text-7xl font-black mb-2"
              >
                <span className={cn('bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent', gradeColor)}>
                  {animatedScore}%
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={cn('text-3xl font-bold', gradeColor)}
              >
                Grade: {grade}
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-center">
                <Check className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-xl font-bold">{correctCount}</div>
                <div className="text-[11px] text-muted-foreground">Correct</div>
              </div>
              <div className="rounded-lg bg-chart-3/10 border border-chart-3/20 p-3 text-center">
                <X className="h-5 w-5 text-chart-3 mx-auto mb-1" />
                <div className="text-xl font-bold">{questions.length - correctCount}</div>
                <div className="text-[11px] text-muted-foreground">Incorrect</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 p-3 mb-6"
            >
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">+{xpEarned} XP Earned</span>
              <Star className="h-4 w-4 text-primary" />
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton
                variant="outline"
                size="md"
                onClick={() => {
                  setQuizCompleted(false);
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setAnswers(new Array(questions.length).fill(null));
                  setShowExplanation(false);
                  setTimeElapsed(0);
                }}
                icon={<RotateCcw className="h-4 w-4" />}
                className="flex-1"
              >
                Review Answers
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                size="md"
                onClick={() => navigate('dashboard')}
                iconRight={<ArrowRight className="h-4 w-4" />}
                className="flex-1"
              >
                Back to Course
              </AnimatedButton>
            </div>
          </GlassCard>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto py-4 px-4 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div>
            <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Quiz: Advanced React Patterns
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 rounded-lg bg-card/80 border border-border/50 px-3 py-1.5"
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono font-semibold">{formatTime(timeElapsed)}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Progress
            value={((currentQuestion + (showExplanation ? 1 : 0)) / questions.length) * 100}
            className="h-2"
          />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-5 md:p-7" hover3d={false}>
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    {currentQuestion + 1}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Multiple Choice
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-semibold leading-relaxed">
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {q.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption = index === q.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <motion.button
                      key={index}
                      whileHover={!showExplanation ? { scale: 1.01, x: 4 } : undefined}
                      whileTap={!showExplanation ? { scale: 0.99 } : undefined}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showExplanation}
                      className={cn(
                        'w-full flex items-center gap-3 p-3.5 md:p-4 rounded-xl border-2 text-left transition-all duration-200',
                        !showExplanation && !isSelected && 'border-border/50 bg-card/40 hover:border-primary/30 hover:bg-primary/5',
                        !showExplanation && isSelected && 'border-primary bg-primary/10',
                        showExplanation && isCorrectOption && 'border-accent bg-accent/10',
                        showExplanation && isSelected && !isCorrectOption && 'border-chart-3 bg-chart-3/10',
                        showExplanation && !isSelected && !isCorrectOption && 'border-border/30 bg-card/20 opacity-60',
                      )}
                    >
                      {/* Option Letter */}
                      <div
                        className={cn(
                          'shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                          !showExplanation && !isSelected && 'bg-muted text-muted-foreground',
                          !showExplanation && isSelected && 'bg-primary text-primary-foreground',
                          showExplanation && isCorrectOption && 'bg-accent text-accent-foreground',
                          showExplanation && isSelected && !isCorrectOption && 'bg-chart-3 text-chart-3-foreground',
                          showExplanation && !isSelected && !isCorrectOption && 'bg-muted/50 text-muted-foreground/60',
                        )}
                      >
                        {showExplanation && isCorrectOption ? (
                          <Check className="h-4 w-4" />
                        ) : showExplanation && isSelected && !isCorrectOption ? (
                          <X className="h-4 w-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className={cn(
                        'text-sm font-medium flex-1',
                        showExplanation && !isSelected && !isCorrectOption && 'text-muted-foreground',
                      )}>
                        {option}
                      </span>
                      {showExplanation && isCorrectOption && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs font-semibold text-accent"
                        >
                          Correct!
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={cn(
                      'rounded-xl border p-4 mb-5',
                      isCorrect
                        ? 'border-accent/30 bg-accent/5'
                        : 'border-chart-3/30 bg-chart-3/5',
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <>
                            <Check className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold text-accent">Correct!</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-chart-3" />
                            <span className="text-sm font-semibold text-chart-3">Incorrect</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>

                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      onClick={handleNext}
                      iconRight={currentQuestion < questions.length - 1 ? <ArrowRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                      className="w-full"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </AnimatedButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}