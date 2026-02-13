import { create } from 'zustand';
import { Storage, StorageKey } from '../services/storage';

export interface DailyTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    timeSpent: number; // in minutes
}

interface AppState {
    onboardingComplete: boolean;
    darkMode: boolean;
    tasks: DailyTask[];
    streak: number;
    sessionCount: number;
    executionScore: number;
    creatorIdentity: string;
    isPremium: boolean;
    strategicAssessment?: string;
    lastSessionReset: string | null;
    lastCompletedDate: string | null;

    // Actions
    setOnboardingComplete: (complete: boolean) => void;
    setCreatorIdentity: (identity: string) => void;
    toggleDarkMode: () => void;
    setTasks: (tasks: DailyTask[]) => void;
    setStrategicAssessment: (assessment: string) => void;
    updateTask: (taskId: string, updates: Partial<DailyTask>) => void;
    completeTask: (taskId: string, timeSpent: number) => void;
    setPremium: (isPremium: boolean) => void;
    togglePremiumOverride: () => void;
    resetDailyCounter: () => void;
    incrementStreak: () => void;
    loadState: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    onboardingComplete: false,
    darkMode: false,
    tasks: [],
    streak: 0,
    sessionCount: 0,
    executionScore: 0,
    creatorIdentity: 'General Creator',
    isPremium: false,
    strategicAssessment: undefined,
    lastSessionReset: null,
    lastCompletedDate: null,

    setOnboardingComplete: async (complete) => {
        set({ onboardingComplete: complete });
        await Storage.setItem(StorageKey.ONBOARDING_COMPLETE, complete);
    },

    setCreatorIdentity: async (identity) => {
        set({ creatorIdentity: identity });
        await Storage.setItem(StorageKey.CREATOR_IDENTITY, identity);
    },

    toggleDarkMode: async () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        await Storage.setItem(StorageKey.DARK_MODE, newMode);
    },

    setTasks: async (tasks) => {
        set({ tasks });
        await Storage.setItem(StorageKey.DAILY_TASKS, tasks);
    },

    setStrategicAssessment: async (assessment) => {
        set({ strategicAssessment: assessment });
        await Storage.setItem(StorageKey.STRATEGIC_ASSESSMENT as any, assessment);
    },

    updateTask: async (taskId, updates) => {
        const tasks = get().tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
        );
        set({ tasks });
        await Storage.setItem(StorageKey.DAILY_TASKS, tasks);
    },

    completeTask: async (taskId, timeSpent) => {
        const { tasks, sessionCount, isPremium } = get();

        // Check session limit for free users
        if (!isPremium && sessionCount >= 5) {
            console.warn('Session limit reached for free user');
            return;
        }

        const updatedTasks = tasks.map((t) =>
            t.id === taskId ? { ...t, completed: true, timeSpent } : t
        );

        set({
            tasks: updatedTasks,
            sessionCount: sessionCount + 1,
            executionScore: Math.min(100, get().executionScore + 33) // ~3 tasks to reach 100
        });

        await Storage.setItem(StorageKey.DAILY_TASKS, updatedTasks);
        await Storage.setItem(StorageKey.SESSION_COUNTER, sessionCount + 1);
        await Storage.setItem(StorageKey.EXECUTION_SCORE, get().executionScore);

        get().incrementStreak();
    },

    setPremium: async (isPremium) => {
        set({ isPremium });
        await Storage.setItem(StorageKey.SUBSCRIPTION_STATUS, isPremium);
    },

    togglePremiumOverride: async () => {
        const newState = !get().isPremium;
        set({ isPremium: newState });
        await Storage.setItem(StorageKey.SUBSCRIPTION_STATUS, newState);
        console.log('Premium status toggled via override:', newState);
    },

    resetDailyCounter: async () => {
        const today = new Date().toDateString();
        set({
            sessionCount: 0,
            lastSessionReset: today,
            tasks: [],
            strategicAssessment: undefined
        });
        await Storage.setItem(StorageKey.SESSION_COUNTER, 0);
        await Storage.setItem(StorageKey.LAST_SESSION_RESET, today);
        await Storage.setItem(StorageKey.DAILY_TASKS, []);
        await Storage.setItem(StorageKey.STRATEGIC_ASSESSMENT as any, undefined);
    },

    incrementStreak: async () => {
        const today = new Date().toDateString();
        const { lastCompletedDate, streak } = get();

        if (lastCompletedDate === today) return; // Already incremented today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = 1;
        if (lastCompletedDate === yesterdayStr) {
            newStreak = streak + 1;
        }

        set({ streak: newStreak, lastCompletedDate: today });
        await Storage.setItem(StorageKey.STREAK_COUNT, newStreak);
        await Storage.setItem(StorageKey.LAST_COMPLETED_DATE, today);
    },

    loadState: async () => {
        const [
            onboardingComplete,
            darkMode,
            tasks,
            streak,
            sessionCount,
            executionScore,
            creatorIdentity,
            isPremium,
            strategicAssessment,
            lastSessionReset,
            lastCompletedDate,
        ] = await Promise.all([
            Storage.getItem<boolean>(StorageKey.ONBOARDING_COMPLETE),
            Storage.getItem<boolean>(StorageKey.DARK_MODE),
            Storage.getItem<DailyTask[]>(StorageKey.DAILY_TASKS),
            Storage.getItem<number>(StorageKey.STREAK_COUNT),
            Storage.getItem<number>(StorageKey.SESSION_COUNTER),
            Storage.getItem<number>(StorageKey.EXECUTION_SCORE),
            Storage.getItem<string>(StorageKey.CREATOR_IDENTITY),
            Storage.getItem<boolean>(StorageKey.SUBSCRIPTION_STATUS),
            Storage.getItem<string>(StorageKey.STRATEGIC_ASSESSMENT as any),
            Storage.getItem<string>(StorageKey.LAST_SESSION_RESET),
            Storage.getItem<string>(StorageKey.LAST_COMPLETED_DATE),
        ]);

        const today = new Date().toDateString();

        // Check for daily reset
        if (lastSessionReset !== today) {
            set({
                onboardingComplete: onboardingComplete ?? false,
                darkMode: darkMode ?? false,
                tasks: [],
                streak: streak ?? 0,
                sessionCount: 0,
                executionScore: 0,
                creatorIdentity: creatorIdentity ?? 'General Creator',
                isPremium: isPremium ?? false,
                strategicAssessment: undefined,
                lastSessionReset: today,
                lastCompletedDate: lastCompletedDate ?? null,
            });
            await Storage.setItem(StorageKey.SESSION_COUNTER, 0);
            await Storage.setItem(StorageKey.EXECUTION_SCORE, 0);
            await Storage.setItem(StorageKey.LAST_SESSION_RESET, today);
            await Storage.setItem(StorageKey.DAILY_TASKS, []);
            await Storage.setItem(StorageKey.STRATEGIC_ASSESSMENT as any, undefined);
        } else {
            set({
                onboardingComplete: onboardingComplete ?? false,
                darkMode: darkMode ?? false,
                tasks: tasks ?? [],
                streak: streak ?? 0,
                sessionCount: sessionCount ?? 0,
                executionScore: executionScore ?? 0,
                creatorIdentity: creatorIdentity ?? 'General Creator',
                isPremium: isPremium ?? false,
                strategicAssessment: strategicAssessment ?? undefined,
                lastSessionReset: lastSessionReset ?? today,
                lastCompletedDate: lastCompletedDate ?? null,
            });
        }
    },
}));
