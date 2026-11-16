import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

import { SCREEN_H, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { assets } from '../assets';

/**
 * One background image for the whole app (the factory ships a single bg).
 * Screens are told apart by their gradient overlay, its direction and the
 * decorative cotton-loop layer — the loader uses the darkest overlay of all.
 */

export type BackgroundVariant =
  | 'loader'
  | 'menu'
  | 'browser'
  | 'detail'
  | 'builder'
  | 'result'
  | 'favorites'
  | 'tips'
  | 'settings';

type Decor = 'loops' | 'arc' | 'rings' | 'stitch' | 'none';

const VARIANTS: Record<
  BackgroundVariant,
  {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
    decor: Decor;
    decorColor: string;
    decorOpacity: number;
  }
> = {
  loader: {
    colors: theme.gradients.loaderScrim,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    decor: 'loops',
    decorColor: '#B0DDBD',
    decorOpacity: 0.1,
  },
  menu: {
    colors: theme.gradients.menu,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    decor: 'loops',
    decorColor: '#43AB2A',
    decorOpacity: 0.06,
  },
  browser: {
    colors: theme.gradients.browser,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    decor: 'stitch',
    decorColor: '#00558B',
    decorOpacity: 0.05,
  },
  detail: {
    colors: theme.gradients.detail,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    decor: 'arc',
    decorColor: '#00558B',
    decorOpacity: 0.06,
  },
  builder: {
    colors: theme.gradients.builder,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    decor: 'stitch',
    decorColor: '#FFFFFF',
    decorOpacity: 0.3,
  },
  result: {
    colors: theme.gradients.result,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    decor: 'loops',
    decorColor: '#1A2418',
    decorOpacity: 0.05,
  },
  favorites: {
    colors: theme.gradients.favorites,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    decor: 'rings',
    decorColor: '#43AB2A',
    decorOpacity: 0.06,
  },
  tips: {
    colors: theme.gradients.tips,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    decor: 'rings',
    decorColor: '#00558B',
    decorOpacity: 0.06,
  },
  settings: {
    colors: theme.gradients.settings,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    decor: 'stitch',
    decorColor: '#43AB2A',
    decorOpacity: 0.07,
  },
};

function DecorLayer({ kind, color, opacity }: { kind: Decor; color: string; opacity: number }) {
  if (kind === 'none') {
    return null;
  }
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={SCREEN_W} height={SCREEN_H} opacity={opacity}>
        {kind === 'loops' ? (
          <>
            <Circle
              cx={SCREEN_W * 0.86}
              cy={SCREEN_H * 0.16}
              r={SCREEN_W * 0.42}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
            <Circle
              cx={SCREEN_W * 0.1}
              cy={SCREEN_H * 0.56}
              r={SCREEN_W * 0.34}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
            <Circle
              cx={SCREEN_W * 0.72}
              cy={SCREEN_H * 0.92}
              r={SCREEN_W * 0.3}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
          </>
        ) : null}
        {kind === 'arc' ? (
          <Path
            d={
              'M' +
              -SCREEN_W * 0.2 +
              ' ' +
              SCREEN_H * 0.42 +
              ' Q ' +
              SCREEN_W * 0.5 +
              ' ' +
              SCREEN_H * 0.1 +
              ' ' +
              SCREEN_W * 1.2 +
              ' ' +
              SCREEN_H * 0.42
            }
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        ) : null}
        {kind === 'rings' ? (
          <>
            <Circle
              cx={SCREEN_W * 0.2}
              cy={SCREEN_H * 0.12}
              r={54}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
            <Circle
              cx={SCREEN_W * 0.78}
              cy={SCREEN_H * 0.08}
              r={38}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
            <Circle
              cx={SCREEN_W * 0.9}
              cy={SCREEN_H * 0.68}
              r={66}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
          </>
        ) : null}
        {kind === 'stitch' ? (
          <>
            <Path
              d={'M0 ' + SCREEN_H * 0.3 + ' H' + SCREEN_W}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="10,12"
              fill="none"
            />
            <Path
              d={'M0 ' + SCREEN_H * 0.74 + ' H' + SCREEN_W}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="10,12"
              fill="none"
            />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

function ScreenBackgroundBase({ variant, children }: Props) {
  const config = VARIANTS[variant];
  return (
    <ImageBackground source={assets.bgGame} resizeMode="cover" style={styles.root}>
      <LinearGradient
        colors={config.colors}
        start={config.start}
        end={config.end}
        style={StyleSheet.absoluteFill}
      />
      <DecorLayer kind={config.decor} color={config.decorColor} opacity={config.decorOpacity} />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  content: {
    flex: 1,
  },
});

export const ScreenBackground = memo(ScreenBackgroundBase);

export default ScreenBackground;
