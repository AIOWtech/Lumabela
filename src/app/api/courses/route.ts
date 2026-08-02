import { NextResponse } from 'next/server';
import { mockCourses } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let courses = [...mockCourses];
  if (category && category !== 'all') {
    courses = courses.filter(c => c.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    courses = courses.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ courses, total: courses.length });
}