import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

/**
 * The one count presentation used everywhere a reference number appears.
 *
 * No raster icon: colour carries the meaning and the number is the message, so
 * a row of these stays visually even whatever the values are. The card takes
 * the full width of its slot and its own intrinsic height — never `flex: 1`
 * inside a `flex: 1` parent, which would collapse the text away.
 */

type Props = {
  value: string;
  label: string;
  tone?: 'green' | 'magenta' | 'blue';
};

const TONES = {
  green: theme.colors.brand.green,
  magenta: theme.colors.brand.magenta,
  blue: theme.colors.brand.deep,
};

function ReferenceCountCardBase({ value, label, tone }: Props) {
  const accent = TONES[tone || 'green'];

  return (
    <View
      style={[styles.card, { borderColor: accent + '55' }]}
      accessible
      accessibilityLabel={value + ' ' + label}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadows.card,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
});

export const ReferenceCountCard = memo(ReferenceCountCardBase);

export default ReferenceCountCard;
