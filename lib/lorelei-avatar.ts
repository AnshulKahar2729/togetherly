/**
 * DiceBear HTTP API v7
 * - Woman: Lorelei (feminine illustrated style)
 * - Man: Micah (short `fonze`, curly `dannyPhantom`; no long option in UI)
 * @see https://api.dicebear.com/7.x/lorelei/schema.json
 * @see https://api.dicebear.com/7.x/micah/schema.json
 */

export const DICEBEAR_LORELEI_V7_PNG = 'https://api.dicebear.com/7.x/lorelei/png';
export const DICEBEAR_MICAH_V7_PNG = 'https://api.dicebear.com/7.x/micah/png';

export type Gender = 'woman' | 'man';
export type SkinTone = 'light' | 'medium' | 'dark';
export type HairStyle = 'short' | 'long' | 'curly';
export type OutfitColorId = 'coral' | 'lavender' | 'peach';

export type LoreleiAvatarConfig = {
  seed: string;
  gender: Gender;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  outfitColor: OutfitColorId;
};

/** Maps UI labels to DiceBear `skinColor` / Micah `baseColor` (hex without #). */
const SKIN_COLOR: Record<SkinTone, string> = {
  light: 'FFDBAC',
  medium: 'C68642',
  dark: '4A3728',
};

const LORELEI_HAIR: Record<HairStyle, string> = {
  short: 'variant08',
  long: 'variant24',
  curly: 'variant35',
};

/**
 * Micah hair ids — men only use **Short** and **Curly** in the UI (`long` is legacy → short).
 * - `fonze`: short slick / greaser (clearly masc)
 * - `dannyPhantom`: spiky / textured (masc cartoon vs softer curls)
 */
const MICAH_HAIR = {
  short: 'fonze',
  curly: 'dannyPhantom',
} as const;

function micahHairId(hairStyle: HairStyle): string {
  if (hairStyle === 'curly') return MICAH_HAIR.curly;
  return MICAH_HAIR.short;
}

const OUTFIT_BACKGROUND_HEX: Record<OutfitColorId, string> = {
  coral: 'FF8A7A',
  lavender: 'B79CFF',
  peach: 'FFB36B',
};

function buildLoreleiParams(config: LoreleiAvatarConfig, size: string): URLSearchParams {
  return new URLSearchParams({
    seed: config.seed,
    size,
    skinColor: SKIN_COLOR[config.skinTone],
    hair: LORELEI_HAIR[config.hairStyle],
    backgroundColor: OUTFIT_BACKGROUND_HEX[config.outfitColor],
    backgroundType: 'solid',
    beardProbability: '0',
    earringsProbability: '45',
  });
}

function buildMicahParams(config: LoreleiAvatarConfig, size: string): URLSearchParams {
  const outfit = OUTFIT_BACKGROUND_HEX[config.outfitColor];
  return new URLSearchParams({
    seed: config.seed,
    size,
    baseColor: SKIN_COLOR[config.skinTone],
    hair: micahHairId(config.hairStyle),
    hairProbability: '100',
    backgroundColor: outfit,
    backgroundType: 'solid',
    shirt: 'crew',
    shirtColor: outfit,
    facialHair: 'scruff',
    facialHairProbability: '42',
  });
}

export function buildAvatarUrl(config: LoreleiAvatarConfig, size: number): string {
  const px = String(Math.max(1, Math.round(size)));
  if (config.gender === 'man') {
    const params = buildMicahParams(config, px);
    return `${DICEBEAR_MICAH_V7_PNG}?${params.toString()}`;
  }
  const params = buildLoreleiParams(config, px);
  return `${DICEBEAR_LORELEI_V7_PNG}?${params.toString()}`;
}

export function createRandomSeed(): string {
  return `togetherly-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const DEFAULT_LORELEI_AVATAR_CONFIG: LoreleiAvatarConfig = {
  seed: 'togetherly-couple',
  gender: 'woman',
  skinTone: 'medium',
  hairStyle: 'long',
  outfitColor: 'coral',
};

export function buildAvatarFromProfile(
  profile: { avatarSeed: string; gender: Gender }
): LoreleiAvatarConfig {
  return {
    ...DEFAULT_LORELEI_AVATAR_CONFIG,
    seed: profile.avatarSeed,
    gender: profile.gender,
    hairStyle: profile.gender === 'man' ? 'short' : DEFAULT_LORELEI_AVATAR_CONFIG.hairStyle,
  };
}
