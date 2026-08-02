import { NextResponse } from 'next/server';
import { weeklyProgress } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    weeklyXP: weeklyProgress,
    overallProgress: 68,
    coursesInProgress: 3,
    totalLessonsCompleted: 156,
    totalQuizScore: 92,
    studyGoal: { target: 300, current: 240, unit: 'minutes' },
  });
}