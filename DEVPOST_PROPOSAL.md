# FocusForge AI – Devpost Submission Proposal

## Inspiration
Most AI productivity apps focus on *thinking* or *chatting*. Creators like Simon @ Better Creating have shown that the real barrier is *execution*. We built FocusForge to be the 'Zero-Friction' entry point into deep work.

## What it does
FocusForge AI is a minimalist execution OS for creators. It takes a broad goal, breaks it into 25-minute 'execution blocks' using xAI Grok API, and guides the user through a Pomodoro-inspired deep work sprint followed by a structured AI reflection.

## How we built it
- **Frontend**: React Native with Expo for rapid Android deployment.
- **Styling**: A custom design system following minimalist aesthetics (White background, Roboto, 16px grid).
- **Brain**: xAI Grok API (grok-beta) for intelligent task breaking and reflection.
- **Monetization**: RevenueCat SDK for handling Android subscriptions and entitlements.
- **State**: Zustand with AsyncStorage for local-first persistence.

## Challenges we ran into
Integrating AI reflections that don't feel like 'clunky chat' was a challenge. We opted for a dedicated reflection screen that triggers only after a sprint, keeping the interface clean and focused.

## Accomplishments that we're proud of
- Achieving a 'Zen' UI that feels premium and distraction-free.
- Implementing a robust session-limiting logic for free users that encourages upgrading without being intrusive.
- Seamless integration of RevenueCat for a production-ready monetization flow.

## What we learned
Productivity tools shouldn't add more tasks; they should subtract the friction of starting the next one.

## What's next for FocusForge AI
- Multi-coach modes (Habit, Creative, Focus).
- Notion/Google Calendar integration.
- Offline-first AI using local LLMs for basic task breaking.
