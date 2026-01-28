import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Ellipse, G } from 'react-native-svg';
import { useTheme } from '@/hooks/use-theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CloudDecoration() {
  const { palette } = useTheme();

  return (
    <View style={styles.container}>
      <Svg width={SCREEN_WIDTH} height={120} viewBox={`0 0 ${SCREEN_WIDTH} 120`}>
        {/* Background soft layer */}
        <Ellipse
          cx={SCREEN_WIDTH * 0.2}
          cy={90}
          rx={120}
          ry={50}
          fill={palette.softCream}
          opacity={0.6}
        />
        <Ellipse
          cx={SCREEN_WIDTH * 0.5}
          cy={100}
          rx={150}
          ry={60}
          fill={palette.softCream}
          opacity={0.5}
        />
        <Ellipse
          cx={SCREEN_WIDTH * 0.8}
          cy={85}
          rx={130}
          ry={55}
          fill={palette.softCream}
          opacity={0.6}
        />

        {/* Front layer - slightly more visible */}
        <G opacity={0.4}>
          <Ellipse
            cx={SCREEN_WIDTH * 0.1}
            cy={110}
            rx={80}
            ry={40}
            fill={palette.peach}
          />
          <Ellipse
            cx={SCREEN_WIDTH * 0.35}
            cy={105}
            rx={100}
            ry={45}
            fill={palette.softOrange}
          />
          <Ellipse
            cx={SCREEN_WIDTH * 0.65}
            cy={115}
            rx={90}
            ry={40}
            fill={palette.lavender}
          />
          <Ellipse
            cx={SCREEN_WIDTH * 0.9}
            cy={108}
            rx={85}
            ry={42}
            fill={palette.peach}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
