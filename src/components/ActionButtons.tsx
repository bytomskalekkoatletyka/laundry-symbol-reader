import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ACTION_H, GUTTER, SCREEN_W, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/useEntrance';

/**
 * The two button classes used across the app.
 *
 * Every interactive element is a Pressable with an explicit width and height;
 * the Animated.View that carries the press scale is its CHILD, so the touch
 * never gets swallowed on an Android release build. Icons sit in a centered
 * row at a fixed 24x24 with a 10dp gap and a matching 24dp label line height.
 */

/** Any lucide icon component. Kept loose so icon props stay variance-free. */
export type GlyphIcon = React.ComponentType<any>;

export const ICON_SIZE = 24;
export const FULL_W = SCREEN_W - 2 * GUTTER;

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type ButtonProps = {
  label: string;
  onPress: () => void;
  Icon?: GlyphIcon;
  disabled?: boolean;
  width?: number;
  accessibilityHint?: string;
  testID?: string;
};

function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  disabled,
  width,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const press = usePressScale(0.98);
  const w = width || FULL_W;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.primaryPress, { width: w, height: ACTION_H }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          theme.shadows.action,
          { transform: [{ scale: press.scale }], opacity: disabled ? 0.55 : 1 },
        ]}>
        <LinearGradient
          colors={disabled ? ['#B0DDBD', '#A2CFAF'] : theme.gradients.action}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryFill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON_SIZE} color={theme.colors.text.onDark} strokeWidth={2.2} /> : null}
            <Text style={styles.primaryLabel} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  disabled,
  width,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const press = usePressScale(0.98);
  const w = width || FULL_W;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.secondaryPress, { width: w, height: TOUCH_MIN }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          styles.secondaryFill,
          { transform: [{ scale: press.scale }], opacity: disabled ? 0.5 : 1 },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON_SIZE} color={theme.colors.text.primary} strokeWidth={2} /> : null}
          <Text style={styles.secondaryLabel} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

type IconButtonProps = {
  Icon: GlyphIcon;
  onPress: () => void;
  label: string;
  tone?: 'ink' | 'magenta';
  testID?: string;
};

/** 48x48 square target used for Back, Settings, Clear and overflow controls. */
function IconButtonBase({ Icon, onPress, label, tone, testID }: IconButtonProps) {
  const press = usePressScale(0.92);
  const color = tone === 'magenta' ? theme.colors.brand.magenta : theme.colors.text.primary;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.iconPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.iconFill, { transform: [{ scale: press.scale }] }]}>
        <Icon size={ICON_SIZE} color={color} strokeWidth={2} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryPress: {
    borderRadius: theme.radius.md,
  },
  secondaryPress: {
    borderRadius: theme.radius.md,
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
  },
  primaryFill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  secondaryFill: {
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryLabel: {
    fontSize: 17,
    lineHeight: ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.onDark,
  },
  secondaryLabel: {
    fontSize: 15,
    lineHeight: ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  iconPress: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: theme.radius.md,
  },
  iconFill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export const SecondaryButton = memo(SecondaryButtonBase);
export const IconButton = memo(IconButtonBase);
