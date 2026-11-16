import React, { memo } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/useEntrance';

/**
 * The shared bento surface. Same radius, border, padding and shadow wherever a
 * card appears, so browsing, the builder, favourites and advice all read as one
 * system. A pressable card keeps the Pressable on the outside.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  tone?: 'cotton' | 'inset' | 'green';
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

function SurfaceCardBase({
  children,
  onPress,
  selected,
  tone,
  style,
  width,
  height,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const press = usePressScale(0.97);

  const toneStyle =
    tone === 'inset' ? styles.inset : tone === 'green' ? styles.green : styles.cotton;

  const body = (
    <View
      style={[
        styles.base,
        toneStyle,
        selected ? styles.selected : null,
        width ? { width } : null,
        height ? { height } : null,
        style,
      ]}>
      {children}
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: !!selected }}
      style={[width ? { width } : null, height ? { height } : null]}>
      <Animated.View pointerEvents="box-none" style={{ transform: [{ scale: press.scale }] }}>
        {body}
      </Animated.View>
    </Pressable>
  );
}

/** Small uppercase caption used above card groups. */
function SectionLabelBase({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  cotton: {
    backgroundColor: theme.colors.ui.surface,
  },
  inset: {
    backgroundColor: theme.colors.ui.inset,
    borderColor: theme.colors.ui.borderStrong,
    shadowOpacity: 0,
    elevation: 0,
  },
  green: {
    backgroundColor: theme.colors.brand.greenSoft,
    borderColor: theme.colors.ui.borderStrong,
  },
  selected: {
    borderWidth: 2,
    borderColor: theme.colors.brand.magenta,
  },
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
  },
});

export const SurfaceCard = memo(SurfaceCardBase);
export const SectionLabel = memo(SectionLabelBase);

export default SurfaceCard;
