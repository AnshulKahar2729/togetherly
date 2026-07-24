import { useEffect, useMemo, useRef, type SetStateAction } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LoreleiAvatar } from '@/components/lorelei-avatar';
import {
  createRandomSeed,
  type Gender,
  type HairStyle,
  type LoreleiAvatarConfig,
  type OutfitColorId,
  type SkinTone,
} from '@/lib/lorelei-avatar';

const CORAL = '#FF8A7A';
const LAVENDER = '#B79CFF';
const PEACH = '#FFB36B';

/** Minimum gap between Randomize taps (ms). */
const RANDOMIZE_THROTTLE_MS = 900;

const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: 'woman', label: 'Woman' },
  { id: 'man', label: 'Man' },
];

const SKIN_OPTIONS: { id: SkinTone; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'dark', label: 'Dark' },
];

const HAIR_OPTIONS: { id: HairStyle; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
];

const OUTFIT_OPTIONS: { id: OutfitColorId; label: string; accent: string }[] = [
  { id: 'coral', label: 'Coral', accent: CORAL },
  { id: 'lavender', label: 'Lavender', accent: LAVENDER },
  { id: 'peach', label: 'Peach', accent: PEACH },
];

type OptionRowProps<T extends string> = {
  title: string;
  options: { id: T; label: string; accent?: string }[];
  selected: T;
  onSelect: (id: T) => void;
  accentForSelected?: (id: T) => string | undefined;
  compact?: boolean;
};

function OptionRow<T extends string>({
  title,
  options,
  selected,
  onSelect,
  accentForSelected,
  compact = false,
}: OptionRowProps<T>) {
  const os = compact ? stylesCompact : null;
  return (
    <View style={[styles.optionBlock, os?.optionBlock]}>
      <Text style={[styles.optionTitle, os?.optionTitle]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.pillRow, os?.pillRow]}
      >
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const highlight =
            accentForSelected?.(opt.id) ?? opt.accent ?? CORAL;
          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(opt.id)}
              style={({ pressed }) => [
                styles.pill,
                os?.pill,
                {
                  borderColor: isSelected ? highlight : 'transparent',
                  borderWidth: isSelected ? 2 : 1,
                  backgroundColor: isSelected ? '#FFFFFF' : '#FFEDE8',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillLabel,
                  os?.pillLabel,
                  isSelected && { color: '#3D2E2A', fontWeight: '600' },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export type LoreleiAvatarEditorProps = {
  value: LoreleiAvatarConfig;
  onChange: (next: SetStateAction<LoreleiAvatarConfig>) => void;
  /** Main preview diameter */
  heroSize?: number;
  /** Tighter spacing and smaller type — fits more on one screen without scrolling */
  compact?: boolean;
  showCouplePreview?: boolean;
  showRandomize?: boolean;
};

export function LoreleiAvatarEditor({
  value,
  onChange,
  heroSize,
  compact = false,
  showCouplePreview = true,
  showRandomize = true,
}: LoreleiAvatarEditorProps) {
  /** Compact: smaller than default (220 / 72) but not minimal — balanced for one screen */
  const resolvedHeroSize = heroSize ?? (compact ? 160 : 220);
  const coupleSize = compact ? 56 : 72;
  const lastRandomizeAt = useRef(0);

  /** Normalize invalid gender + hair combos for preview until state updates. */
  const previewConfig = useMemo((): LoreleiAvatarConfig => {
    if (value.gender === 'woman' && value.hairStyle === 'short') {
      return { ...value, hairStyle: 'long' };
    }
    if (value.gender === 'man' && value.hairStyle === 'long') {
      return { ...value, hairStyle: 'short' };
    }
    return value;
  }, [value]);

  const partnerConfig = useMemo<LoreleiAvatarConfig>(
    () => ({
      ...previewConfig,
      seed: `${previewConfig.seed}-partner`,
    }),
    [previewConfig]
  );

  const hairOptions = useMemo(() => {
    if (value.gender === 'woman') {
      return HAIR_OPTIONS.filter((o) => o.id !== 'short');
    }
    if (value.gender === 'man') {
      return HAIR_OPTIONS.filter((o) => o.id !== 'long');
    }
    return HAIR_OPTIONS;
  }, [value.gender]);

  /** Map invalid stored combos to a visible pill selection. */
  const displayHairStyle: HairStyle =
    value.gender === 'woman' && value.hairStyle === 'short'
      ? 'long'
      : value.gender === 'man' && value.hairStyle === 'long'
        ? 'short'
        : value.hairStyle;

  useEffect(() => {
    if (value.gender === 'woman' && value.hairStyle === 'short') {
      onChange((prev) =>
        prev.gender === 'woman' && prev.hairStyle === 'short'
          ? { ...prev, hairStyle: 'long' }
          : prev
      );
    }
    if (value.gender === 'man' && value.hairStyle === 'long') {
      onChange((prev) =>
        prev.gender === 'man' && prev.hairStyle === 'long'
          ? { ...prev, hairStyle: 'short' }
          : prev
      );
    }
  }, [value.gender, value.hairStyle, onChange]);

  const set = (patch: Partial<LoreleiAvatarConfig>) => {
    onChange((prev) => {
      const next: LoreleiAvatarConfig = { ...prev, ...patch };
      if (patch.gender !== undefined && patch.gender !== prev.gender) {
        next.seed = createRandomSeed();
      }
      if (next.gender === 'woman' && next.hairStyle === 'short') {
        next.hairStyle = 'long';
      }
      if (next.gender === 'man' && next.hairStyle === 'long') {
        next.hairStyle = 'short';
      }
      return next;
    });
  };

  const handleRandomize = () => {
    const now = Date.now();
    if (now - lastRandomizeAt.current < RANDOMIZE_THROTTLE_MS) {
      return;
    }
    lastRandomizeAt.current = now;
    onChange((prev) => ({ ...prev, seed: createRandomSeed() }));
  };

  const cs = compact ? stylesCompact : null;

  return (
    <>
      <View style={[styles.hero, cs?.hero]}>
        <LoreleiAvatar config={previewConfig} size={resolvedHeroSize} />
        {showRandomize ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Randomize avatar"
            onPress={handleRandomize}
            style={({ pressed }) => [
              styles.randomizeBtn,
              cs?.randomizeBtn,
              pressed && styles.randomizeBtnPressed,
            ]}
          >
            <Text style={[styles.randomizeBtnText, cs?.randomizeBtnText]}>Randomize</Text>
          </Pressable>
        ) : null}
      </View>

      {showCouplePreview ? (
        <View style={[styles.coupleRow, cs?.coupleRow]}>
          <Text style={[styles.coupleLabel, cs?.coupleLabel]}>Together</Text>
          <View style={[styles.couplePair, cs?.couplePair]}>
            <View style={styles.coupleItem}>
              <LoreleiAvatar config={previewConfig} size={coupleSize} borderWidth={2} />
              <Text style={[styles.coupleCaption, cs?.coupleCaption]}>You</Text>
            </View>
            <Ionicons
              name="heart"
              size={compact ? 18 : 22}
              color={CORAL}
              style={[styles.heart, cs?.heart]}
            />
            <View style={styles.coupleItem}>
              <LoreleiAvatar
                config={partnerConfig}
                size={coupleSize}
                borderWidth={2}
                borderColor={`${LAVENDER}55`}
              />
              <Text style={[styles.coupleCaption, cs?.coupleCaption]}>Partner</Text>
            </View>
          </View>
        </View>
      ) : null}

      <OptionRow
        title="Gender"
        options={GENDER_OPTIONS}
        selected={value.gender}
        onSelect={(gender) => set({ gender })}
        compact={compact}
      />

      <OptionRow
        title="Skin tone"
        options={SKIN_OPTIONS}
        selected={value.skinTone}
        onSelect={(skinTone) => set({ skinTone })}
        compact={compact}
      />

      <OptionRow
        title="Hair style"
        options={hairOptions}
        selected={displayHairStyle}
        onSelect={(hairStyle) => set({ hairStyle })}
        compact={compact}
      />

      <OptionRow
        title="Outfit color"
        options={OUTFIT_OPTIONS}
        selected={value.outfitColor}
        onSelect={(outfitColor) => set({ outfitColor })}
        accentForSelected={(id) => OUTFIT_OPTIONS.find((o) => o.id === id)?.accent}
        compact={compact}
      />
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  randomizeBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#FFF5F1',
    borderWidth: 1.5,
    borderColor: CORAL,
  },
  randomizeBtnPressed: {
    opacity: 0.88,
    backgroundColor: '#FFEDE8',
  },
  randomizeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7A4036',
    letterSpacing: 0.2,
  },
  coupleRow: {
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFEDE8',
  },
  coupleLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    marginBottom: 12,
  },
  couplePair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  coupleItem: { alignItems: 'center' },
  coupleCaption: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B5344',
  },
  heart: {
    marginBottom: 20,
  },
  optionBlock: { marginBottom: 20 },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5344',
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 4,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  pillLabel: {
    fontSize: 15,
    color: '#5C4A42',
  },
});

/** Overrides when `compact` — tighter than default, still comfortable to read and tap */
const stylesCompact = StyleSheet.create({
  hero: {
    marginTop: 2,
    marginBottom: 10,
  },
  randomizeBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  randomizeBtnText: {
    fontSize: 13,
  },
  coupleRow: {
    marginBottom: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  coupleLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  couplePair: {
    gap: 12,
  },
  coupleCaption: {
    marginTop: 5,
    fontSize: 11,
  },
  heart: {
    marginBottom: 16,
  },
  optionBlock: {
    marginBottom: 11,
  },
  optionTitle: {
    fontSize: 12,
    marginBottom: 6,
  },
  pillRow: {
    gap: 8,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  pillLabel: {
    fontSize: 13,
  },
});
