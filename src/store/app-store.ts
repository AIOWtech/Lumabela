import { create } from 'zustand';

export type PageId = 
  | 'landing' | 'login' | 'register' | 'contact' | 'faq'
  | 'dashboard' | 'courses' | 'course-details' | 'lesson-player'
  | 'lumi-ai' | 'quiz' | 'leaderboard' | 'premium'
  | 'profile' | 'certificates' | 'notifications' | 'settings'
  | 'not-found' | 'server-error';

export type CourseCategory = 'all' | 'programming' | 'design' | 'data-science' | 'business' | 'language' | 'mathematics';

interface AppState {
  currentPage: PageId;
  previousPage: PageId | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  selectedCourseId: string | null;
  selectedLessonId: string | null;
  selectedQuizId: string | null;
  sidebarOpen: boolean;
  searchQuery: string;
  courseCategory: CourseCategory;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    xpToNext: number;
    streak: number;
    badges: string[];
    enrolledCourses: number;
    completedCourses: number;
    totalHoursLearned: number;
    rank: number;
  } | null;
  
  navigate: (page: PageId) => void;
  goBack: () => void;
  setAuthenticated: (auth: boolean) => void;
  setPremium: (premium: boolean) => void;
  selectCourse: (id: string) => void;
  selectLesson: (id: string) => void;
  selectQuiz: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCourseCategory: (cat: CourseCategory) => void;
  setUser: (user: AppState['user']) => void;
  addXP: (amount: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'landing',
  previousPage: null,
  isAuthenticated: false,
  isPremium: false,
  selectedCourseId: null,
  selectedLessonId: null,
  selectedQuizId: null,
  sidebarOpen: false,
  searchQuery: '',
  courseCategory: 'all',
  user: null,

  navigate: (page) => set((state) => ({
    previousPage: state.currentPage,
    currentPage: page,
    sidebarOpen: false,
  })),

  goBack: () => set((state) => {
    if (state.previousPage) {
      return { currentPage: state.previousPage, previousPage: null };
    }
    return {};
  }),

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setPremium: (premium) => set({ isPremium: premium }),

  selectCourse: (id) => set({ selectedCourseId: id, currentPage: 'course-details' }),

  selectLesson: (id) => set({ selectedLessonId: id, currentPage: 'lesson-player' }),

  selectQuiz: (id) => set({ selectedQuizId: id, currentPage: 'quiz' }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setCourseCategory: (cat) => set({ courseCategory: cat }),

  setUser: (user) => set({ user }),

  addXP: (amount) => set((state) => {
    if (!state.user) return {};
    const newXP = state.user.xp + amount;
    const newLevel = newXP >= state.user.xpToNext ? state.user.level + 1 : state.user.level;
    const newXpToNext = newXP >= state.user.xpToNext ? Math.floor(state.user.xpToNext * 1.2) : state.user.xpToNext;
    const currentXP = newXP >= state.user.xpToNext ? newXP - state.user.xpToNext : newXP;
    return {
      user: { ...state.user, xp: currentXP, level: newLevel, xpToNext: newXpToNext }
    };
  }),
}));