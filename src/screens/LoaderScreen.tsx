import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { GUTTER, LOADER_DURATION_MS } from '../constants/config';
import { theme } from '../constants/theme';
import { assets } from '../assets';
import { ScreenBackground } from '../components/ScreenBackground';

/**
 * Branded splash. The darkest overlay in the app plus the brand label mark,
 * so it can never be mistaken for the Categories hub behind it.
 */

type Props = { onDone: () => void };

export function LoaderScreen({ onDone }: Props) {
  const markOpacity = useRef(new Animated.Value(0)).current;
  const markScale = useRef(new Animated.Value(0.94)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  // Width cannot run on the native driver, so the track fill animates on JS.
  const progress = useRef(new Animated.Value(0)).current;
  const finish = useRef(onDone);
  finish.current = onDone;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(markOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(markScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 250,
        delay: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const track = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    entrance.start();
    track.start();

    const timer = setTimeout(() => finish.current(), LOADER_DURATION_MS);

    return () => {
      entrance.stop();
      track.stop();
      clearTimeout(timer);
    };
  }, [markOpacity, markScale, progress, titleOpacity]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '100%'],
  });

  return (
    <ScreenBackground variant="loader">
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.markWrap,
            { opacity: markOpacity, transform: [{ scale: markScale }] },
          ]}>
          <View style={styles.mark}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.stitch} />
        </Animated.View>

        <Animated.View pointerEvents="none" style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>Laundry{'\n'}Symbol Reader</Text>
          <Text style={styles.subtitle}>Know the label. Care for your clothes.</Text>
        </Animated.View>

        <View style={styles.progressBlock}>
          <View style={styles.track}>
            <Animated.View pointerEvents="none" style={[styles.fillWrap, { width: fillWidth }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loadingLabel}>LOADING YOUR CARE GUIDE</Text>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GUTTER + 8,
    paddingTop: 64,
    paddingBottom: 72,
  },
  markWrap: {
    marginBottom: theme.spacing.huge,
  },
  mark: {
    width: 112,
    height: 112,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.cotton,
    borderWidth: 1,
    borderColor: 'rgba(67,171,42,0.35)',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 6,
  },
  logo: {
    width: 82,
    height: 82,
  },
  stitch: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.brand.magenta,
  },
  title: {
    maxWidth: 300,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    color: theme.colors.text.onDark,
  },
  subtitle: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    color: theme.colors.text.onDarkSoft,
  },
  progressBlock: {
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
  },
  track: {
    width: 220,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(176,221,189,0.25)',
  },
  fillWrap: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  loadingLabel: {
    marginTop: theme.spacing.md,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.onDarkSoft,
  },
});

export default LoaderScreen;
