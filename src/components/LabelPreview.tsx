import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LABEL_CELL_W, LABEL_GAP } from '../constants/config';
import { theme } from '../constants/theme';
import { CATEGORIES, CategoryId } from '../game/catalog';
import { LabelDraft, selectedIn } from '../game/labelRules';
import { CareSymbolGlyph } from './CareSymbolGlyph';

/**
 * The garment-label strip: five ordered cells, one per care family.
 * A cell with no selection is an outlined empty shape that reads "Not set" to a
 * screen reader — an absent symbol is never shown as a permission.
 */

const CELL_H = 74;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type CellProps = {
  categoryId: CategoryId;
  label: string;
  ids: string[];
  onSelectCategory: (id: CategoryId) => void;
};

function LabelCell({ categoryId, label, ids, onSelectCategory }: CellProps) {
  const handlePress = useCallback(
    () => onSelectCategory(categoryId),
    [categoryId, onSelectCategory],
  );
  const filled = ids.length > 0;
  const glyphSize = ids.length > 1 ? 24 : 32;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label + ', ' + (filled ? ids.length + ' selected' : 'Not set')}
      accessibilityHint="Choose a symbol for this category"
      style={[styles.cell, { width: LABEL_CELL_W, height: CELL_H }]}>
      <View style={[styles.canvas, filled ? styles.canvasFilled : styles.canvasEmpty]}>
        {filled ? (
          <View style={styles.glyphRow}>
            {ids.map(id => (
              <CareSymbolGlyph key={id} symbolId={id} size={glyphSize} />
            ))}
          </View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={styles.cellLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

type Props = {
  draft: LabelDraft;
  onSelectCategory: (id: CategoryId) => void;
};

function LabelPreviewBase({ draft, onSelectCategory }: Props) {
  return (
    <View style={styles.strip}>
      {CATEGORIES.map(category => (
        <LabelCell
          key={category.id}
          categoryId={category.id}
          label={category.label}
          ids={selectedIn(draft, category.id)}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: LABEL_GAP,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  canvas: {
    width: '100%',
    height: 50,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  canvasFilled: {
    backgroundColor: theme.colors.ui.inset,
    borderColor: theme.colors.ui.borderStrong,
  },
  canvasEmpty: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: theme.colors.ui.border,
    borderStyle: 'dashed',
  },
  glyphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  placeholder: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.divider,
  },
  cellLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
});

export const LabelPreview = memo(LabelPreviewBase);

export default LabelPreview;
