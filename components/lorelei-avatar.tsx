import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  type ImageStyle,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';

import { buildAvatarUrl, type LoreleiAvatarConfig } from '@/lib/lorelei-avatar';

export type LoreleiAvatarProps = {
  config: LoreleiAvatarConfig;
  /** Logical avatar diameter (image + inner padding). */
  size: number;
  /** Soft tint behind the portrait (matches app chrome). */
  softBackgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

/**
 * Rounded DiceBear v7 avatar (PNG). Keeps the previous image on screen while the next
 * URL is prefetched, then swaps — avoids an empty circle. Shows a small overlay spinner while loading.
 */
export function LoreleiAvatar({
  config,
  size,
  softBackgroundColor = '#FFF6F2',
  borderColor = 'rgba(255, 138, 122, 0.35)',
  borderWidth = 3,
  style,
  imageStyle,
}: LoreleiAvatarProps) {
  const innerPad = Math.round(size * 0.06);
  const imageSize = size - innerPad * 2;
  const pixelSize = imageSize * 2;
  const uri = buildAvatarUrl(config, pixelSize);

  const [displayedUri, setDisplayedUri] = useState(uri);
  const [loading, setLoading] = useState(false);
  const uriRef = useRef(uri);

  useEffect(() => {
    uriRef.current = uri;
  }, [uri]);

  useEffect(() => {
    if (uri === displayedUri) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const target = uri;

    Image.prefetch(target, 'memory-disk')
      .then(() => {
        if (cancelled) return;
        if (target !== uriRef.current) return;
        setDisplayedUri(target);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        if (target !== uriRef.current) return;
        setDisplayedUri(target);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [uri, displayedUri]);

  const cacheKey = `${config.gender}:${displayedUri}`;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: softBackgroundColor,
          borderWidth,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View style={{ width: imageSize, height: imageSize }}>
        <Image
          accessibilityLabel="Avatar preview"
          recyclingKey={cacheKey}
          source={{ uri: displayedUri, cacheKey }}
          style={[{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }, imageStyle]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={0}
        />
        {loading ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, styles.loadingOverlay]}
          >
            <ActivityIndicator color="#FF8A7A" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 246, 242, 0.55)',
  },
});
