import React, { memo, useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Eraser, FileText, LayoutGrid, Pencil } from 'lucide-react-native';

import { GUTTER, LABEL_CARD_PAD, SPAN_W, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { CATEGORIES, Category, CategoryId, SubSlot, SYMBOL_BY_ID } from '../game/catalog';
import { LabelDraft, selectedIn, setCategoryCount } from '../game/labelRules';
import { IconButton, PrimaryButton, SecondaryButton } from '../components/ActionButtons';
import { BottomNavigation, TabId } from '../components/BottomNavigation';
import { CareSymbolGlyph } from '../components/CareSymbolGlyph';
import { LabelPreview } from '../components/LabelPreview';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { SymbolPickerSheet } from '../components/SymbolPickerSheet';

/**
 * Combine the symbols from one garment label.
 *
 * Every selection comes from the catalog: nothing is inferred from a garment
 * name or a fabric, and a category left untouched stays explicitly unset.
 */


type RowProps = {
  category: Category;
  ids: string[];
  onEdit: (id: CategoryId) => void;
};

const BuilderCategoryRow = memo(function BuilderCategoryRow({ category, ids, onEdit }: RowProps) {
  const handlePress = useCallback(() => onEdit(category.id), [category.id, onEdit]);

  const summary =
    ids.length > 0
      ? ids
          .map(id => (SYMBOL_BY_ID[id] ? SYMBOL_BY_ID[id].title : ''))
          .filter(Boolean)
          .join(' · ')
      : 'Choose a symbol';

  return (
    <SurfaceCard
      onPress={handlePress}
      style={styles.row}
      accessibilityLabel={category.label + ', ' + summary}
      accessibilityHint="Opens the symbol picker for this category">
      <View style={styles.rowGlyph}>
        <CareSymbolGlyph
          glyph={ids.length > 0 && SYMBOL_BY_ID[ids[0]] ? SYMBOL_BY_ID[ids[0]].glyph : category.glyph}
          size={30}
          color={ids.length > 0 ? theme.colors.brand.ink : theme.colors.text.muted}
        />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {category.label}
        </Text>
        <Text
          style={[styles.rowSummary, ids.length === 0 ? styles.rowSummaryEmpty : null]}
          numberOfLines={2}>
          {summary}
        </Text>
      </View>

      <View style={styles.rowEdit}>
        <Pencil size={20} color={theme.colors.brand.magenta} strokeWidth={2} />
      </View>
    </SurfaceCard>
  );
});

type Props = {
  draft: LabelDraft;
  canGoBack: boolean;
  onBack: () => void;
  onAddSymbol: (symbolId: string) => void;
  onRemoveSubslot: (subslot: SubSlot) => void;
  onClear: () => void;
  onShowInstruction: () => void;
  onBrowse: () => void;
  onTab: (tab: TabId) => void;
};

export function LabelBuilderScreen({
  draft,
  canGoBack,
  onBack,
  onAddSymbol,
  onRemoveSubslot,
  onClear,
  onShowInstruction,
  onBrowse,
  onTab,
}: Props) {
  const [pickerCategory, setPickerCategory] = useState<CategoryId | null>(null);

  const openPicker = useCallback((id: CategoryId) => setPickerCategory(id), []);
  const closePicker = useCallback(() => setPickerCategory(null), []);

  const count = setCategoryCount(draft);
  const anySelected = count > 0;

  const handleClear = useCallback(() => {
    if (!anySelected) {
      return;
    }
    Alert.alert('Clear this label?', 'The symbols you chose will be removed.', [
      { text: 'Keep label', style: 'cancel' },
      { text: 'Clear label', style: 'destructive', onPress: onClear },
    ]);
  }, [anySelected, onClear]);

  const renderRow = useCallback(
    ({ item }: { item: Category }) => (
      <BuilderCategoryRow category={item} ids={selectedIn(draft, item.id)} onEdit={openPicker} />
    ),
    [draft, openPicker],
  );

  const keyExtractor = useCallback((item: Category) => item.id, []);

  const listHeader = (
    <View style={styles.header}>
      <SurfaceCard style={styles.previewCard}>
        <Text style={styles.previewTitle}>Garment label</Text>
        <LabelPreview draft={draft} onSelectCategory={openPicker} />
      </SurfaceCard>

      <Text style={styles.progress}>
        {count} of {CATEGORIES.length} categories set
      </Text>
      {!anySelected ? (
        <Text style={styles.helper}>Choose a symbol to see its meaning.</Text>
      ) : null}
    </View>
  );

  return (
    <ScreenBackground variant="builder">
      <ScreenHeader
        title="Label builder"
        leftSlot={
          canGoBack ? <IconButton Icon={ArrowLeft} onPress={onBack} label="Back" /> : undefined
        }
        rightSlot={
          anySelected ? (
            <IconButton Icon={Eraser} onPress={handleClear} label="Clear label" tone="magenta" />
          ) : undefined
        }
      />

      <View style={styles.listRegion}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderRow}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          windowSize={5}
        />
      </View>

      <View style={styles.actionPanel}>
        <PrimaryButton
          label="SHOW CARE INSTRUCTION"
          onPress={onShowInstruction}
          Icon={FileText}
          width={SPAN_W}
          accessibilityHint="Turns the chosen symbols into a readable instruction"
        />
        <SecondaryButton
          label="BROWSE SYMBOLS"
          onPress={onBrowse}
          Icon={LayoutGrid}
          width={SPAN_W}
          accessibilityHint="Returns to the symbol browser"
        />
      </View>

      <BottomNavigation active="builder" onSelect={onTab} />

      <SymbolPickerSheet
        visible={pickerCategory !== null}
        category={pickerCategory}
        draft={draft}
        onSelect={onAddSymbol}
        onRemove={onRemoveSubslot}
        onClose={closePicker}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  listRegion: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.sm,
  },
  previewCard: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: LABEL_CARD_PAD,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.md,
  },
  previewTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  progress: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  rowGlyph: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  rowSummary: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  rowSummaryEmpty: {
    color: theme.colors.text.muted,
    fontStyle: 'italic',
  },
  rowEdit: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(224,40,171,0.1)',
  },
  actionPanel: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
});

export default LabelBuilderScreen;
