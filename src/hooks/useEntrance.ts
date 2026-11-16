import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { FADE_MS, STAGGER_CAP_MS, STAGGER_MS } from '../constants/config';
import { theme } from '../constants/theme';

/**
 * Entrance and press animation helpers.
 *
 * Every animation here drives opacity or transform only, so `useNativeDriver`
 * stays safe. Handles live in refs, never in state.
 */

/** Fade + 6dp rise, optionally staggered by index (capped at 200ms total). */
export function useEntrance(index: number = 0, enabled: boolean = true) {
  const opacity = useRef(new Animated.Value(enabled ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(enabled ? 6 : 0)).current;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const delay = Math.min(index * STAGGER_MS, STAGGER_CAP_MS);
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_MS,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: FADE_MS,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [enabled, index, opacity, translateY]);

  return { opacity, transform: [{ translateY }] };
}

/** Plain crossfade used when a screen's content is swapped. */
export function useFadeIn(key: string | number) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [key, opacity]);

  return opacity;
}

/**
 * Press feedback. The Pressable owns the event and the Animated.View is its
 * CHILD — never the other way round, which would swallow onPress on Android.
 */
export function usePressScale(to: number = 0.98) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: to,
      duration: 80,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
}
