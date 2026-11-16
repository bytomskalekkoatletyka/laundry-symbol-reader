import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import { CELL_W, GRID_COLS, GRID_GAP, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { CareSymbol, CATEGORY_BY_ID, CategoryId, SubSlot, SYMBOLS_BY_CATEGORY } from '../game/catalog';
import { LabelDraft, SUBSLOTS_BY_CATEGORY, SUBSLOT_LABEL } from '../game/labelRules';
import { SecondaryButton } from './ActionButtons';
import { SymbolCard } from './SymbolCard';

/**
 * Native modal picker scoped to one category. Only valid catalog records are
 * offered — there is no free-form temperature field — and "Not on this label"
 * removes the slot instead of claiming a treatment is allowed.
 */

const PICKER_CARD_H = 140;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  visible: boolean;
  category: CategoryId | null;
  draft: LabelDraft;
  onSelect: (symbolId: string) => void;
  onRemove: (subslot: SubSlot) => void;
  onClose: () => void;
};

function SymbolPickerSheetBase({ visible, category, draft, onSelect, onRemove, onClose }: Props) {
  const subslots = category ? SUBSLOTS_BY_CATEGORY[category] : [];
  const [activeSlot, setActiveSlot] = useState<SubSlot | null>(null);

  const slot: SubSlot | null = activeSlot && subslots.indexOf(activeSlot) >= 0
    ? activeSlot
    : subslots.length > 0
    ? subslots[0]
    : null;

  const options = useMemo<CareSymbol[]>(() => {
    if (!category || !slot) {
      return [];
    }
    return SYMBOLS_BY_CATEGORY[category].filter(s => s.subslot === slot);
  }, [category, slot]);

  const handleSelect = useCallback(
    (symbolId: string) => {
      onSelect(symbolId);
      onClose();
    },
    [onClose, onSelect],
  );

  const handleRemove = useCallback(() => {
    if (slot) {
      onRemove(slot);
    }
    onClose();
  }, [onClose, onRemove, slot]);

  const renderItem = useCallback(
    ({ item }: { item: CareSymbol }) => (
      <SymbolCard
        id={item.id}
        title={item.title}
        descriptor={item.descriptor}
        width={CELL_W}
        height={PICKER_CARD_H}
        selected={slot ? draft[slot] === item.id : false}
        onPress={handleSelect}
      />
    ),
    [draft, handleSelect, slot],
  );

  const keyExtractor = useCallback((item: CareSymbol) => item.id, []);

  const title = category ? CATEGORY_BY_ID[category].label : '';
  const selectedId = slot ? draft[slot] : null;

  return (
    <Modal
      visible={visible && category !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={styles.sheet}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              Choose a {title.toLowerCase()} symbol
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.close}>
              <X size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
            </Pressable>
          </View>

          {subslots.length > 1 ? (
            <View style={styles.tabs}>
              {subslots.map(s => {
                const active = s === slot;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setActiveSlot(s)}
                    hitSlop={HIT}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={SUBSLOT_LABEL[s]}
                    style={[styles.tab, active ? styles.tabActive : null]}>
                    <Text
                      style={[styles.tabLabel, active ? styles.tabLabelActive : null]}
                      numberOfLines={1}>
                      {SUBSLOT_LABEL[s]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={GRID_COLS}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={5}
            removeClippedSubviews
          />

          <View style={styles.footer}>
            <SecondaryButton
              label={selectedId ? 'NOT ON THIS LABEL' : 'CLOSE'}
              onPress={selectedId ? handleRemove : onClose}
              accessibilityHint={
                selectedId ? 'Removes this category from the label' : 'Closes the picker'
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: theme.colors.ui.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '86%',
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing.lg,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ui.divider,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  close: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  tabs: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  tab: {
    height: TOUCH_MIN,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  tabActive: {
    backgroundColor: theme.colors.brand.greenSoft,
    borderColor: theme.colors.brand.green,
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
  tabLabelActive: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: GRID_GAP,
  },
  column: {
    gap: GRID_GAP,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
});

export const SymbolPickerSheet = memo(SymbolPickerSheetBase);

export default SymbolPickerSheet;
