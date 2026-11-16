import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Layers, Settings } from 'lucide-react-native';

import { GRID_COLS, GRID_GAP, GUTTER, SPAN_W, TOUCH_MIN, CELL_W } from '../constants/config';
import { theme } from '../constants/theme';
import {
  CareSymbol,
  CATEGORY_BY_ID,
  CategoryId,
  searchSymbols,
  SYMBOLS_BY_CATEGORY,
} from '../game/catalog';
import { IconButton, PrimaryButton } from '../components/ActionButtons';
import { BottomNavigation, TabId } from '../components/BottomNavigation';
import { EmptyState } from '../components/EmptyState';
import { LocalSearchField } from '../components/LocalSearchField';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SymbolCard } from '../components/SymbolCard';

/**
 * Category symbol browser (G1). Header, bounded two-column list, then a
 * separate action surface — the last card can never slip under the panel.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type DryFilter = 'all' | 'tumble' | 'natural';

const DRY_FILTERS: { id: DryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'tumble', label: 'Tumble' },
  { id: 'natural', label: 'Natural' },
];

type ChipProps = { label: string; selected: boolean; onPress: () => void };

function FilterChip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected ? styles.chipActive : null]}>
      <Text style={[styles.chipLabel, selected ? styles.chipLabelActive : null]}>{label}</Text>
    </Pressable>
  );
}

type Props = {
  category: CategoryId;
  selectedIds: string[];
  onBack: () => void;
  onOpenSymbol: (id: string) => void;
  onBuildLabel: () => void;
  onSettings: () => void;
  onTab: (tab: TabId) => void;
};

export function GameScreen({
  category,
  selectedIds,
  onBack,
  onOpenSymbol,
  onBuildLabel,
  onSettings,
  onTab,
}: Props) {
  const [query, setQuery] = useState('');
  const [dryFilter, setDryFilter] = useState<DryFilter>('all');

  const meta = CATEGORY_BY_ID[category];

  const data = useMemo(() => {
    let list = SYMBOLS_BY_CATEGORY[category];
    if (category === 'dry' && dryFilter !== 'all') {
      list = list.filter(s => (dryFilter === 'tumble' ? s.subslot === 'tumble' : s.subslot === 'natural'));
    }
    return searchSymbols(list, query);
  }, [category, dryFilter, query]);

  const handleClear = useCallback(() => setQuery(''), []);

  const renderItem = useCallback(
    ({ item }: { item: CareSymbol }) => (
      <SymbolCard
        id={item.id}
        title={item.title}
        descriptor={item.descriptor}
        width={CELL_W}
        selected={selectedIds.indexOf(item.id) >= 0}
        onPress={onOpenSymbol}
      />
    ),
    [onOpenSymbol, selectedIds],
  );

  const keyExtractor = useCallback((item: CareSymbol) => item.id, []);

  return (
    <ScreenBackground variant="browser">
      <ScreenHeader
        title={meta.browserTitle}
        subtitle={meta.blurb}
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back" />}
        rightSlot={<IconButton Icon={Settings} onPress={onSettings} label="Settings" />}
      />

      <View style={styles.filters}>
        <LocalSearchField
          label={'Search ' + meta.label.toLowerCase() + ' symbols'}
          placeholder={'Search ' + meta.label.toLowerCase() + ' symbols'}
          value={query}
          onChange={setQuery}
          onClear={handleClear}
        />
        {category === 'dry' ? (
          <View style={styles.chipRow}>
            {DRY_FILTERS.map(f => (
              <FilterChip
                key={f.id}
                label={f.label}
                selected={dryFilter === f.id}
                onPress={() => setDryFilter(f.id)}
              />
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.listRegion}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={GRID_COLS}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={5}
            removeClippedSubviews
          />
        ) : (
          <EmptyState
            kind="search"
            title="No symbols found"
            body="Try a different word, or clear the search to see the whole category."
            actionLabel="CLEAR SEARCH"
            onAction={handleClear}
            width={SPAN_W}
          />
        )}
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.panelHint}>Matching more than one symbol?</Text>
        <PrimaryButton
          label="BUILD A LABEL"
          onPress={onBuildLabel}
          Icon={Layers}
          width={SPAN_W}
          accessibilityHint="Combines several symbols into one care instruction"
        />
      </View>

      <BottomNavigation active="categories" onSelect={onTab} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  filters: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  chip: {
    height: TOUCH_MIN,
    minWidth: 84,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  chipActive: {
    backgroundColor: theme.colors.brand.greenSoft,
    borderColor: theme.colors.brand.green,
    borderWidth: 2,
  },
  chipLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
  chipLabelActive: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  listRegion: {
    flex: 1,
    marginTop: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingBottom: theme.spacing.lg,
    gap: GRID_GAP,
  },
  column: {
    gap: GRID_GAP,
  },
  actionPanel: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  panelHint: {
    alignSelf: 'flex-start',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
});

export default GameScreen;
