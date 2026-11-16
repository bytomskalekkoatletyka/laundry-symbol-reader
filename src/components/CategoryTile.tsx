import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CATEGORY_TILE_H } from '../constants/config';
import { theme } from '../constants/theme';
import { Category, CategoryId } from '../game/catalog';
import { CareSymbolGlyph } from './CareSymbolGlyph';
import { SurfaceCard } from './SurfaceCard';

type Props = {
  category: Category;
  count: number;
  width: number;
  selected?: boolean;
  onPress: (id: CategoryId) => void;
};

/**
 * One care family. The tile shows the family's own technical base symbol —
 * never a decorative pictogram — so a user can match it against a real label.
 */
function CategoryTileBase({ category, count, width, selected, onPress }: Props) {
  const handlePress = useCallback(() => onPress(category.id), [category.id, onPress]);

  return (
    <SurfaceCard
      width={width}
      height={CATEGORY_TILE_H}
      onPress={handlePress}
      selected={selected}
      style={styles.card}
      accessibilityLabel={category.label + ' symbols, ' + count + ' entries'}
      accessibilityHint="Opens this category">
      <View style={styles.top}>
        <View style={styles.glyphWrap}>
          <CareSymbolGlyph glyph={category.glyph} size={34} />
        </View>
        {selected ? (
          <View style={styles.check}>
            <Text style={styles.checkMark}>{'✓'}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {category.label}
      </Text>
      <Text style={styles.count} numberOfLines={1}>
        {count} symbols
      </Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glyphWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.magenta,
  },
  checkMark: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.text.onDark,
  },
  label: {
    marginTop: theme.spacing.sm,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  count: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.muted,
  },
});

export const CategoryTile = memo(CategoryTileBase);

export default CategoryTile;
