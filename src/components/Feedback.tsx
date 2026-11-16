import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { FADE_MS, GUTTER, SAVE_CHECK_MS, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** A check that scales from 0.9 to 1 and fades in once a write has succeeded. */
function SaveCheckBase({ visible, message }: { visible: boolean; message: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: SAVE_CHECK_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: visible ? 1 : 0.9,
        duration: SAVE_CHECK_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [opacity, scale, visible]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[styles.check, { opacity, transform: [{ scale }] }]}>
      <View style={styles.checkIcon}>
        <Check size={20} color={theme.colors.text.onDark} strokeWidth={3} />
      </View>
      <Text style={styles.checkLabel} numberOfLines={1}>
        {message}
      </Text>
    </Animated.View>
  );
}

type SnackProps = {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Footer snackbar. The Animated wrapper is `box-none` so the Undo target below
 * it still receives the tap on an Android release build.
 */
function UndoSnackbarBase({ visible, message, actionLabel, onAction }: SnackProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 12,
        duration: FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [opacity, translateY, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={[styles.snack, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.snackText} numberOfLines={2}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.snackAction}>
          <Text style={styles.snackActionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(67,171,42,0.14)',
    borderWidth: 1,
    borderColor: theme.colors.brand.green,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.green,
  },
  checkLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  snack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginHorizontal: GUTTER,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.sm,
    paddingVertical: 6,
    minHeight: TOUCH_MIN + 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand.ink,
  },
  snackText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.onDarkSoft,
  },
  snackAction: {
    height: TOUCH_MIN,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackActionLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.brand.magentaSoft,
  },
});

export const SaveCheck = memo(SaveCheckBase);
export const UndoSnackbar = memo(UndoSnackbarBase);
