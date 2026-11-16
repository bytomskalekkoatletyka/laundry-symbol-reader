import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import { GlyphSpec, SYMBOL_BY_ID } from '../game/catalog';
import { theme } from '../constants/theme';

/**
 * Technical care symbols, drawn as vectors on a stable 100x100 canvas.
 *
 * Dots, bars, diagonal marks, embedded letters and prohibitions all survive
 * down to a 24dp display size because every stroke is expressed in canvas
 * units and scaled with the viewBox — never as a raster asset or a font glyph.
 */

type Props = {
  /** A catalog ID; takes precedence over `glyph`. */
  symbolId?: string;
  glyph?: GlyphSpec;
  size: number;
  color?: string;
  accessibilityLabel?: string;
};

const INK = theme.colors.brand.ink;

// Stroke widths in canvas units; the viewBox scales them with the symbol.
const STROKE = 5.5;
const THIN = 4;

function Tub({ spec, color }: { spec: GlyphSpec; color: string }) {
  const body =
    'M12 34 C22 26 30 42 40 34 C50 26 58 42 68 34 C76 28 82 32 88 34 L79 84 L21 84 Z';
  return (
    <G>
      <Path d={body} stroke={color} strokeWidth={STROKE} fill="none" strokeLinejoin="round" />
      {spec.hand ? (
        <G>
          <Rect x={36} y={38} width={6} height={20} rx={3} fill={color} />
          <Rect x={45} y={34} width={6} height={24} rx={3} fill={color} />
          <Rect x={54} y={36} width={6} height={22} rx={3} fill={color} />
          <Rect x={63} y={42} width={6} height={16} rx={3} fill={color} />
          <Rect x={34} y={54} width={36} height={18} rx={6} fill={color} />
        </G>
      ) : null}
      {spec.text ? (
        <SvgText
          x={50}
          y={spec.hand ? 82 : 74}
          fill={color}
          fontSize={spec.hand ? 20 : 34}
          fontWeight="bold"
          textAnchor="middle">
          {spec.text}
        </SvgText>
      ) : null}
    </G>
  );
}

let clipSeq = 0;

function Triangle({ spec, color }: { spec: GlyphSpec; color: string }) {
  const outline = 'M50 12 L90 86 L10 86 Z';
  // Unique per instance: several glyphs can share one screen.
  const clipId = React.useMemo(() => {
    clipSeq += 1;
    return 'triClip' + clipSeq;
  }, []);
  return (
    <G>
      <Defs>
        <ClipPath id={clipId}>
          <Path d={outline} />
        </ClipPath>
      </Defs>
      <Path d={outline} stroke={color} strokeWidth={STROKE} fill="none" strokeLinejoin="round" />
      {spec.stripes ? (
        <G clipPath={'url(#' + clipId + ')'}>
          <Line x1={26} y1={92} x2={62} y2={22} stroke={color} strokeWidth={THIN} />
          <Line x1={44} y1={96} x2={80} y2={26} stroke={color} strokeWidth={THIN} />
        </G>
      ) : null}
    </G>
  );
}

function TumbleBox({ spec, color }: { spec: GlyphSpec; color: string }) {
  const dots = spec.dots || 0;
  return (
    <G>
      <Rect
        x={13}
        y={15}
        width={74}
        height={74}
        rx={6}
        stroke={color}
        strokeWidth={STROKE}
        fill="none"
      />
      <Circle cx={50} cy={52} r={25} stroke={color} strokeWidth={THIN} fill="none" />
      {dots === 1 ? <Circle cx={50} cy={52} r={5} fill={color} /> : null}
      {dots === 2 ? (
        <G>
          <Circle cx={39} cy={52} r={5} fill={color} />
          <Circle cx={61} cy={52} r={5} fill={color} />
        </G>
      ) : null}
    </G>
  );
}

function NaturalBox({ spec, color }: { spec: GlyphSpec; color: string }) {
  const lines = spec.lines;
  return (
    <G>
      <Rect
        x={13}
        y={15}
        width={74}
        height={74}
        rx={6}
        stroke={color}
        strokeWidth={STROKE}
        fill="none"
      />
      {lines === 'line' ? (
        <Line x1={50} y1={28} x2={50} y2={76} stroke={color} strokeWidth={THIN} />
      ) : null}
      {lines === 'drip' ? (
        <G>
          <Line x1={40} y1={28} x2={40} y2={76} stroke={color} strokeWidth={THIN} />
          <Line x1={60} y1={28} x2={60} y2={76} stroke={color} strokeWidth={THIN} />
        </G>
      ) : null}
      {lines === 'flat' ? (
        <Line x1={28} y1={52} x2={72} y2={52} stroke={color} strokeWidth={THIN} />
      ) : null}
      {lines === 'dripFlat' ? (
        <G>
          <Line x1={28} y1={42} x2={72} y2={42} stroke={color} strokeWidth={THIN} />
          <Line x1={28} y1={62} x2={72} y2={62} stroke={color} strokeWidth={THIN} />
        </G>
      ) : null}
      {spec.shade ? (
        <Line x1={16} y1={18} x2={40} y2={42} stroke={color} strokeWidth={THIN} />
      ) : null}
    </G>
  );
}

function Iron({ spec, color }: { spec: GlyphSpec; color: string }) {
  const dots = spec.dots || 0;
  const sole =
    'M8 74 L26 46 C30 40 36 37 44 37 L76 37 C85 37 90 44 88 52 L85 74 Z';
  return (
    <G>
      <Path d={sole} stroke={color} strokeWidth={STROKE} fill="none" strokeLinejoin="round" />
      {dots === 1 ? <Circle cx={55} cy={58} r={4.6} fill={color} /> : null}
      {dots === 2 ? (
        <G>
          <Circle cx={45} cy={58} r={4.6} fill={color} />
          <Circle cx={65} cy={58} r={4.6} fill={color} />
        </G>
      ) : null}
      {dots === 3 ? (
        <G>
          <Circle cx={38} cy={58} r={4.6} fill={color} />
          <Circle cx={55} cy={58} r={4.6} fill={color} />
          <Circle cx={72} cy={58} r={4.6} fill={color} />
        </G>
      ) : null}
      {spec.noSteam ? (
        <G>
          <Line x1={38} y1={80} x2={38} y2={94} stroke={color} strokeWidth={THIN} />
          <Line x1={54} y1={80} x2={54} y2={94} stroke={color} strokeWidth={THIN} />
          <Line x1={70} y1={80} x2={70} y2={94} stroke={color} strokeWidth={THIN} />
          <Line x1={28} y1={96} x2={80} y2={78} stroke={color} strokeWidth={THIN} />
        </G>
      ) : null}
    </G>
  );
}

function LetterCircle({ spec, color }: { spec: GlyphSpec; color: string }) {
  return (
    <G>
      <Circle cx={50} cy={50} r={36} stroke={color} strokeWidth={STROKE} fill="none" />
      {spec.text ? (
        <SvgText x={50} y={65} fill={color} fontSize={44} fontWeight="bold" textAnchor="middle">
          {spec.text}
        </SvgText>
      ) : null}
    </G>
  );
}

function BaseShape({ spec, color }: { spec: GlyphSpec; color: string }) {
  if (spec.base === 'tub') {
    return <Tub spec={spec} color={color} />;
  }
  if (spec.base === 'triangle') {
    return <Triangle spec={spec} color={color} />;
  }
  if (spec.base === 'tumble') {
    return <TumbleBox spec={spec} color={color} />;
  }
  if (spec.base === 'natural') {
    return <NaturalBox spec={spec} color={color} />;
  }
  if (spec.base === 'iron') {
    return <Iron spec={spec} color={color} />;
  }
  return <LetterCircle spec={spec} color={color} />;
}

function CareSymbolGlyphBase({ symbolId, glyph, size, color, accessibilityLabel }: Props) {
  const resolved: GlyphSpec | undefined = symbolId
    ? SYMBOL_BY_ID[symbolId] && SYMBOL_BY_ID[symbolId].glyph
    : glyph;

  if (!resolved) {
    return <View style={{ width: size, height: size }} />;
  }

  const ink = color || INK;
  const bars = resolved.bars || 0;
  // Mild bars live below the symbol, so the shape shrinks to keep the canvas square.
  const scale = bars === 0 ? 1 : bars === 1 ? 0.84 : 0.74;
  const offsetX = 50 * (1 - scale);
  const transform =
    bars === 0 ? undefined : 'translate(' + offsetX + ', 2) scale(' + scale + ')';

  return (
    <View
      style={{ width: size, height: size }}
      accessible={accessibilityLabel ? true : false}
      accessibilityLabel={accessibilityLabel}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G transform={transform}>
          <BaseShape spec={resolved} color={ink} />
          {resolved.crossed ? (
            <G>
              <Line x1={13} y1={13} x2={87} y2={87} stroke={ink} strokeWidth={STROKE} />
              <Line x1={87} y1={13} x2={13} y2={87} stroke={ink} strokeWidth={STROKE} />
            </G>
          ) : null}
        </G>
        {bars >= 1 ? (
          <Line x1={28} y1={88} x2={72} y2={88} stroke={ink} strokeWidth={THIN} />
        ) : null}
        {bars >= 2 ? (
          <Line x1={28} y1={97} x2={72} y2={97} stroke={ink} strokeWidth={THIN} />
        ) : null}
      </Svg>
    </View>
  );
}

export const CareSymbolGlyph = memo(CareSymbolGlyphBase);

export default CareSymbolGlyph;
