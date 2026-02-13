import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKey {
    USER_GOALS = '@user_goals',
    DAILY_TASKS = '@daily_tasks',
    STREAK_COUNT = '@streak_count',
    LAST_COMPLETED_DATE = '@last_completed_date',
    SESSION_COUNTER = '@session_counter',
    EXECUTION_SCORE = '@execution_score',
    CREATOR_IDENTITY = '@creator_identity',
    LAST_SESSION_RESET = '@last_session_reset',
    DARK_MODE = '@dark_mode',
    ONBOARDING_COMPLETE = '@onboarding_complete',
    SUBSCRIPTION_STATUS = '@subscription_status',
    STRATEGIC_ASSESSMENT = '@strategic_assessment',
}

export const Storage = {
    async setItem<T>(key: StorageKey, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
        }
    },

    async getItem<T>(key: StorageKey): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
        }
    },

    async removeItem(key: StorageKey): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`Error removing ${key}:`, e);
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error('Error clearing storage:', e);
        }
    },
};
