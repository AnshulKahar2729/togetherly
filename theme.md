# Theme Guidelines

## Quick Start

```tsx
import { useTheme } from '@/hooks/use-theme';

function MyComponent() {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
    }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

---

## Color Palette

### Primary Colors

| Name        | Value     | Usage                          |
|-------------|-----------|--------------------------------|
| Peach       | `#FF8A7A` | Primary actions, highlights    |
| Soft Orange | `#FFB36B` | Secondary actions, warmth      |
| Lavender    | `#B79CFF` | Accents, special elements      |

### Backgrounds

| Name        | Value     | Usage                          |
|-------------|-----------|--------------------------------|
| Warm White  | `#FFF6F2` | Main background                |
| Soft Cream  | `#FFF1EA` | Cards, surfaces                |

### Text

| Name           | Value     | Usage                          |
|----------------|-----------|--------------------------------|
| Primary Text   | `#3D3A3A` | Main content                   |
| Secondary Text | `#8A7F7A` | Descriptions, labels           |

### Rules

- **Never use pure white (`#FFFFFF`)** for backgrounds
- **Never use pure black (`#000000`)** for text
- This keeps everything soft and warm

---

## Using Colors

### Option 1: useTheme hook (recommended)

```tsx
const { colors } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Primary text</Text>
  <Text style={{ color: colors.textSecondary }}>Secondary text</Text>
</View>
```

### Option 2: Single color

```tsx
import { useThemeColor } from '@/hooks/use-theme';

const backgroundColor = useThemeColor('background');
```

### Option 3: Multiple colors

```tsx
import { useThemeColors } from '@/hooks/use-theme';

const { background, text, primary } = useThemeColors('background', 'text', 'primary');
```

### Available Color Keys

```
background, surface, card
text, textSecondary, textMuted
primary, primaryText
secondary, secondaryText
accent, accentText
tint, icon, iconActive
border, borderFocused
tabIconDefault, tabIconSelected, tabBackground
success, warning, error
```

---

## Spacing

Use consistent spacing throughout the app:

```tsx
const { spacing } = useTheme();

<View style={{ padding: spacing.md, marginBottom: spacing.lg }}>
```

| Name  | Value | Usage                    |
|-------|-------|--------------------------|
| `xs`  | 4     | Tight spacing            |
| `sm`  | 8     | Small gaps               |
| `md`  | 16    | Standard padding         |
| `lg`  | 24    | Section spacing          |
| `xl`  | 32    | Large gaps               |
| `xxl` | 48    | Major sections           |

---

## Border Radius

Keep corners soft and rounded:

```tsx
const { borderRadius } = useTheme();

<View style={{ borderRadius: borderRadius.md }}>
```

| Name   | Value | Usage                    |
|--------|-------|--------------------------|
| `sm`   | 8     | Subtle rounding          |
| `md`   | 12    | Buttons, inputs          |
| `lg`   | 16    | Cards                    |
| `xl`   | 24    | Large cards, modals      |
| `full` | 9999  | Pills, avatars           |

---

## Typography

The app uses rounded, friendly fonts:
- iOS: SF Rounded (system)
- Android: System default (Nunito when loaded)
- Web: Nunito

### Font Weights

```tsx
const { fontWeights } = useTheme();

// Titles: slightly bold
<Text style={{ fontWeight: fontWeights.semibold }}>Title</Text>

// Body: regular
<Text style={{ fontWeight: fontWeights.regular }}>Body text</Text>
```

| Name       | Value | Usage           |
|------------|-------|-----------------|
| `regular`  | 400   | Body text       |
| `medium`   | 500   | Emphasis        |
| `semibold` | 600   | Titles, buttons |
| `bold`     | 700   | Strong emphasis |

### Using ThemedText

```tsx
import { ThemedText } from '@/components/themed-text';

<ThemedText type="title">Page Title</ThemedText>
<ThemedText type="subtitle">Section Header</ThemedText>
<ThemedText>Regular body text</ThemedText>
<ThemedText type="muted">Subtle helper text</ThemedText>
<ThemedText type="link">Clickable link</ThemedText>
```

---

## Gradients

For components that support gradients:

```tsx
import { gradients } from '@/constants/theme';

// Primary gradient: Peach -> Soft Orange
gradients.primary  // ['#FF8A7A', '#FFB36B']

// Accent gradient: Lavender -> Peach
gradients.accent   // ['#B79CFF', '#FF8A7A']

// Warm gradient: Soft Cream -> Warm White
gradients.warm     // ['#FFF1EA', '#FFF6F2']
```

---

## Icons

Icons should follow these guidelines:

```tsx
const { iconStyle } = useTheme();

// Stroke width: 2px
// Style: Rounded, no sharp corners
// Mostly outlines, not filled
```

| Size | Value | Usage           |
|------|-------|-----------------|
| `sm` | 16    | Inline icons    |
| `md` | 24    | Standard icons  |
| `lg` | 32    | Feature icons   |

---

## Animation

Animations should feel gentle and smooth:

```tsx
const { animation } = useTheme();

// Timings
animation.fast    // 150ms - Quick feedback
animation.normal  // 250ms - Standard transitions
animation.slow    // 400ms - Emphasis, reveals

// Easing
animation.easing.default    // 'ease-out'
animation.easing.overshoot  // Slight bounce for delight
```

### Animation Guidelines

- Slow in, soft out
- Slight overshoot for playfulness
- No bounce spam
- Goal completed: gentle scale + fade
- Memory open: slight zoom-in
- Map pin tap: soft pulse

---

## Dark Mode

Dark mode is automatically handled. The hook returns colors for the current scheme:

```tsx
const { colors, isDark, colorScheme } = useTheme();

// colors - Already resolved for current scheme
// isDark - Boolean for conditional logic
// colorScheme - 'light' | 'dark'
```

Dark mode uses soft, warm darks (not pure black):
- Background: `#1A1918`
- Surface: `#252322`
- Text: `#F5F0ED`

---

## Complete Example

```tsx
import { View, Pressable } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

function GoalCard({ title, description, onPress }) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText type="muted" style={{ marginTop: spacing.xs }}>
        {description}
      </ThemedText>
    </Pressable>
  );
}
```
