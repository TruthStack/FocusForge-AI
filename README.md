# FocusForge AI – Creator Execution OS

FocusForge AI is a minimalist, AI-powered execution system built specifically for creators and solopreneurs. It replaces generic AI chat with a structured workflow: Generate tasks, select one, execute for 25 minutes, and reflect.

## 🚀 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and add your API keys:
   - `EXPO_PUBLIC_XAI_API_KEY`: Your xAI Grok API key.
   - `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`: Your RevenueCat Public API key for Android.
4. **Run the app**:
   ```bash
   npx expo start --android
   ```

## 🛠️ Tech Stack
- **Framework**: Expo (React Native) + TypeScript
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **AI**: xAI Grok (grok-beta)
- **Monetization**: RevenueCat

## 💰 Monetization Strategy (Psychologically Dominant)
FocusForge uses a "pain-killer" monetization approach rather than a "vitamin" one. We restrict access to the features that provide the most dopamine and social validation, driving high conversion.

| Feature | Psychological Trigger | Plan |
| :--- | :--- | :--- |
| **Execution Timer** | Immediate utility (Hook) | **Free** |
| **3 Daily AI Tasks** | Scarcity (Fear of Missing Out) | **Free** |
| **Unlimited AI** | Removal of friction | **Premium** |
| **Weekly Analytics** | Validation & Progress Tracking | **Premium** |
| **Shareable Reports** | Social Status & Signaling | **Premium** |
| **Creator Identity** | Personalization & Ego Investment | **Premium** |

**Why this wins:** The free tier is useful enough to build a habit, but the "Execution Score" and "Weekly Report" are locked behind a paywall, creating a strong desire to unlock the full "Quantified Self" experience.

## 🏆 Judging Criteria Alignment
| Criteria | Implementation |
| :--- | :--- |
| **Creativity/Originality** | Moves away from generic "chat with PDF" or "content generation" to **Creator Execution Management**. It's an OS, not a tool. |
| **Problem Solving** | Solves "Analysis Paralysis" and "Creator Burnout" by forcing small, timed execution blocks. |
| **Technical Difficulty** | Custom AI prompting architecture, local state persistence (Zustand), RevenueCat integration, and complex specific-purpose UI. |
| **Design/UX** | Minimalist, distraction-free "Monk Mode" aesthetic. Swipe gestures, haptics, and instant transitions. |
| **Mobile Best Practices** | Offline-first support, native haptics, deep linking support (ready), and performant animations. |

## 📊 Project Structure
- `/src/services`: xAI, RevenueCat, and Storage logic.
- `/src/store`: Zustand global state and persistence.
- `/src/screens`: Core product flow (Dashboard, Timer, Reflection, etc.).
- `/src/theme`: Minimalist design tokens.

## 📅 Submission Details
- **Package Name**: `com.focusforge.app`
- **Contest**: RevenueCat Shipyard: Creator Contest
- **Target Audience**: Creators who prefer minimalist, anti-bloat tools.
