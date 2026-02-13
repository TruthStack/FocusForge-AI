import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { registerRootComponent } from 'expo';
import { Layout } from './src/components/Layout';
import { Typography } from './src/components/Typography';
import { useStore } from './src/store/useStore';
import { Onboarding } from './src/screens/Onboarding';
import { Dashboard } from './src/screens/Dashboard';
import { Timer } from './src/screens/Timer';
import { Reflection } from './src/screens/Reflection';
import { Paywall } from './src/screens/Paywall';
import { Settings } from './src/screens/Settings';
import { WeeklySummary } from './src/screens/WeeklySummary';
import { RevenueCat } from './src/services/revenuecat';

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("Uncaught error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Typography variant="xl" weight="bold">Something went wrong.</Typography>
            <Typography variant="md" style={{ textAlign: 'center', marginTop: 10 }}>
              Our minimalist systems encountered a hiccup. Please restart.
            </Typography>
          </View>
        </Layout>
      );
    }
    return this.props.children;
  }
}

function App() {
  const {
    onboardingComplete,
    loadState,
    setPremium
  } = useStore();

  const [currentScreen, setCurrentScreen] = useState('Home');
  const [navigationParams, setNavigationParams] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      await loadState();

      // Force entitlement sync
      try {
        await RevenueCat.initialize();

        // Listen for updates
        RevenueCat.setCustomerInfoUpdateListener((info) => {
          const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT || 'premium_access';
          const isPro = typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
          setPremium(isPro);
        });

        // Initial check
        const isPro = await RevenueCat.checkEntitlement();
        setPremium(isPro);
      } catch (e) {
        console.log('RevenueCat init skipped in dev or failed', e);
      }
    };
    init();
  }, []);

  const navigate = (screen: string, params?: any) => {
    setCurrentScreen(screen);
    setNavigationParams(params);
  };

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  // Simple router
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
      case 'Home':
        return <Dashboard onNavigate={navigate} />;
      case 'Timer':
        return <Timer route={{ params: navigationParams }} onNavigate={navigate} />;
      case 'Reflection':
        return <Reflection route={{ params: navigationParams }} onNavigate={navigate} />;
      case 'Paywall':
        return <Paywall onNavigate={navigate} />;
      case 'Settings':
        return <Settings onNavigate={navigate} />;
      case 'WeeklySummary':
        return <WeeklySummary onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
