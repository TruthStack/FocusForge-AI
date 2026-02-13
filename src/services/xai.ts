import { Storage, StorageKey } from './storage';

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export interface AIResponse {
    tasks: Array<{
        title: string;
        description: string;
    }>;
    strategicAssessment: string; // New: Professional assessment of the goal
}

export const AIService = {
    async generateDailyTasks(goalContext: string, identity: string = 'General Creator'): Promise<AIResponse> {
        // 1. Check Cache
        const cacheKey = `cache_tasks_v2_${goalContext.substring(0, 30)}`; // Versioned cache for new schema
        const cachedResponse = await Storage.getItem<AIResponse>(cacheKey as any);
        if (cachedResponse && cachedResponse.strategicAssessment) {
            console.log('Returning cached AI response');
            return cachedResponse;
        }

        // 2. Fallback if no API Key
        if (!API_KEY || API_KEY === 'placeholder_until_set') {
            return this.getFallbackTasks();
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a Principal Executive Coach for a ${identity}. 
                            Convert goals into 3 actionable 25-minute execution blocks. 
                            Also provide a "strategicAssessment" (20 words max) analyzing the goal's leverage.
                            Return ONLY a JSON object with: 
                            1. "tasks": array of {title, description}
                            2. "strategicAssessment": string assessment.`,
                        },
                        {
                            role: 'user',
                            content: `Goal: ${goalContext}`,
                        },
                    ],
                    max_tokens: 600,
                    temperature: 0.6,
                    response_format: { type: 'json_object' },
                }),
            });

            if (!response.ok) {
                throw new Error(`AI API error: ${response.status}`);
            }

            const data = await response.json();
            const aiContent = JSON.parse(data.choices[0].message.content) as AIResponse;

            // Cache the response
            await Storage.setItem(cacheKey as any, aiContent);

            return aiContent;
        } catch (e) {
            console.error('AI Service Error:', e);
            return this.getFallbackTasks();
        }
    },

    async generateExecutiveCoaching(stats: { sessions: number, score: number, identity: string, streak: number }): Promise<string> {
        if (!API_KEY || API_KEY === 'placeholder_until_set') {
            return "You're building momentum. Focus on consistent 25-minute sprints to maximize your creative output.";
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a Neuro-Performance Coach for an elite ${stats.identity}. 
                            Analyze their stats and provide one "Pro Insight" (max 30 words) on how to improve their execution loop. 
                            Be direct, analytical, and high-status.`,
                        },
                        {
                            role: 'user',
                            content: `Session Data: ${stats.sessions} sessions this week, Execution Score: ${stats.score}, Streak: ${stats.streak} days.`,
                        },
                    ],
                    max_tokens: 200,
                    temperature: 0.8,
                }),
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (e) {
            return "Strong execution pattern detected. Maintain this velocity to reach your creator milestones.";
        }
    },

    async generateReflection(taskTitle: string, identity: string = 'General Creator'): Promise<string> {
        if (!API_KEY || API_KEY === 'placeholder_until_set') {
            return 'Great job completing this task. How do you feel about your progress today?';
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a minimalist execution coach for a ${identity}. Provide a single, short reflection question (max 12 words) for a user who just finished a 25-minute sprint.`,
                        },
                        {
                            role: 'user',
                            content: `Reflection for task: ${taskTitle}`,
                        },
                    ],
                    max_tokens: 100,
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (e) {
            return 'Sprint complete. What is one thing you learned during this session?';
        }
    },

    getFallbackTasks(): AIResponse {
        return {
            tasks: [
                {
                    title: 'Strategic Onboarding',
                    description: 'Analyze your mission-critical constraints for the next 25 minutes.',
                },
                {
                    title: 'System Optimization',
                    description: 'Refine your execution environment for maximum cognitive flow.',
                },
                {
                    title: 'Feedback Loop Analysis',
                    description: 'Review your session output and identify the primary bottleneck.',
                },
            ],
            strategicAssessment: 'Standard execution pattern. Focus on high-leverage tasks to maximize ROI.'
        };
    },
};
