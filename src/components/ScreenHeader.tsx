import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { GUTTER, HEADER_ROW_H, TOP_INSET, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { assets } from '../assets';

/**
 * The one header every screen uses. Menu, browser, detail, builder, result,
 * favorites, tips and settings differ only by their slots — the padding,
 * backing and 48dp targets never drift between screens.
 */

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  showLogo?: boolean;
  compact?: boolean;
};

function ScreenHeaderBase({ title, subtitle, leftSlot, rightSlot, showLogo, compact }: Props) {
  return (
    <LinearGradient
      colors={theme.gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.root, theme.shadows.header]}>
      <View style={[styles.row, { height: compact ? 64 : HEADER_ROW_H }]}>
        <View style={styles.side}>{leftSlot}</View>

        <View style={styles.center}>
          <View style={styles.titleRow}>
            {showLogo ? (
              <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
            ) : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.side}>{rightSlot}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: TOP_INSET,
    paddingHorizontal: GUTTER,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);

export default ScreenHeader;
