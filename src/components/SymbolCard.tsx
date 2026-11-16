import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SYMBOL_CARD_H } from '../constants/config';
import { theme } from '../constants/theme';
import { CareSymbolGlyph } from './CareSymbolGlyph';
import { SurfaceCard } from './SurfaceCard';

type Props = {
  /** Primitives only, so the memoised card does not re-render with the list. */
  id: string;
  title: string;
  descriptor: string;
  width: number;
  height?: number;
  selected?: boolean;
  onPress: (id: string) => void;
};

function SymbolCardBase({ id, title, descriptor, width, height, selected, onPress }: Props) {
  const handlePress = useCallback(() => onPress(id), [id, onPress]);

  return (
    <SurfaceCard
      width={width}
      height={height || SYMBOL_CARD_H}
      onPress={handlePress}
      selected={selected}
      style={styles.card}
      accessibilityLabel={title + ', ' + descriptor}
      accessibilityHint="Opens the symbol meaning">
      <View style={styles.canvas}>
        <CareSymbolGlyph symbolId={id} size={44} />
        {selected ? (
          <View style={styles.check}>
            <Text style={styles.checkMark}>{'✓'}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.descriptor} numberOfLines={1}>
        {descriptor}
      </Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  canvas: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  check: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.magenta,
  },
  checkMark: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: theme.colors.text.onDark,
  },
  title: {
    marginTop: theme.spacing.sm,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  descriptor: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

export const SymbolCard = memo(SymbolCardBase);

export default SymbolCard;
