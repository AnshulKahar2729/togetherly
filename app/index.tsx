import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import Animated, { FadeOut } from 'react-native-reanimated';
import { SplashScreen } from '@/components/splash-screen';
import { WelcomeScreen } from '@/components/welcome-screen';
import { restoreSession } from '@/lib/auth/restore-session';

type OnboardingStep = 'splash' | 'welcome';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await restoreSession();
      if (!cancelled) {
        setHasSession(ok);
        setSessionChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSplashFinish = useCallback(() => {
    setStep('welcome');
  }, []);

  const handleGetStarted = useCallback(() => {
    if (!sessionChecked) return;
    if (hasSession) {
      router.replace('/couple-space');
    } else {
      router.push('/sign-in' as Href);
    }
  }, [router, hasSession, sessionChecked]);

  return (
    <View style={styles.container}>
      {step === 'splash' && (
        <Animated.View style={StyleSheet.absoluteFill} exiting={FadeOut.duration(400)}>
          <SplashScreen onFinish={handleSplashFinish} />
        </Animated.View>
      )}

      {step === 'welcome' && (
        <WelcomeScreen
          onGetStarted={handleGetStarted}
          getStartedEnabled={sessionChecked}
          getStartedLabel={sessionChecked ? 'Get Started' : 'Loading…'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
