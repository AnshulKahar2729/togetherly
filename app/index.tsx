import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeOut } from 'react-native-reanimated';
import { SplashScreen } from '@/components/splash-screen';
import { WelcomeScreen } from '@/components/welcome-screen';

type OnboardingStep = 'splash' | 'welcome';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('splash');

  const handleSplashFinish = useCallback(() => {
    setStep('welcome');
  }, []);

  const handleGetStarted = useCallback(() => {
    router.replace('/create-avatar');
  }, [router]);

  return (
    <View style={styles.container}>
      {step === 'splash' && (
        <Animated.View style={StyleSheet.absoluteFill} exiting={FadeOut.duration(400)}>
          <SplashScreen onFinish={handleSplashFinish} />
        </Animated.View>
      )}

      {step === 'welcome' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
