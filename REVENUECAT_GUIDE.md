# RevenueCat Configuration Guide: FocusForge AI

To connect your RevenueCat dashboard to FocusForge AI, follow these steps:

## 1. Project Setup
- Go to the [RevenueCat Dashboard](https://app.revenuecat.com/).
- Create a new Project named `FocusForge AI`.

## 2. Platform Configuration (Android)
- Add an Android App.
- **Package Name**: `com.focusforge.app`
- Upload your Google Play JSON credentials (required for real transactions).

## 3. Entitlements & Products
- **Entitlements**: Create one with ID `premium_access`.
- **Products**: Create two products in the Google Play Console, then link them in RevenueCat:
  - `focusforge_monthly` ($4.99/mo)
  - `focusforge_yearly` ($29.99/yr)
- **Offerings**: Create a `default` offering and add the two products as packages (`Monthly` and `Yearly`).

## 4. API Keys
- Copy the **Public Android API Key**.
- Paste it into your `.env` file as `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`.

## 5. Testing
- Go to 'Collaborators' in RevenueCat and add yourself as a test user.
- Use a Google Play Sandbox account to test the purchase flow without real charges.
