import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type HelloWaveProps = {
  color?: string;
};

export function HelloWave({ color = '#666' }: HelloWaveProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(withTiming(22, { duration: 280 }), withTiming(0, { duration: 280 })),
      4,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[{ marginTop: -6 }, animatedStyle]}>
      <Ionicons name="hand-left-outline" size={28} color={color} />
    </Animated.View>
  );
}
