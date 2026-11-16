import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Settings, Trash2 } from 'lucide-react-native';

import { GRID_GAP, GUTTER, SPAN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { normalize, SYMBOL_BY_ID } from '../game/catalog';
import { Garment } from '../hooks/useGarments';
import { IconButton } from '../components/ActionButtons';
import { BottomNavigation, TabId } from '../components/BottomNavigation';
import { CareSymbolGlyph } from '../components/CareSymbolGlyph';
import { EmptyState } from '../components/EmptyState';
import { LocalSearchField } from '../components/LocalSearchField';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { UndoSnackbar } from '../components/Feedback';

/**
 * Saved garments, most recently updated first. Nothing is seeded: an empty
 * collection shows its own state instead of a fake example garment.
 */

const UNDO_MS = 5000;

type CardProps = {
  garment: Garment;
  onOpen: (id: string) => void;
  onDelete: (garment: Garment) => void;
};

const GarmentCard = memo(function GarmentCard({ garment, onOpen, onDelete }: CardProps) {
  const handleOpen = useCallback(() => onOpen(garment.id), [garment.id, onOpen]);
  const handleDelete = useCallback(() => onDelete(garment), [garment, onDelete]);

  const preview =
    garment.symbolIds
      .map(id => (SYMBOL_BY_ID[id] ? SYMBOL_BY_ID[id].title : ''))
      .filter(Boolean)
      .join(' · ') || 'No symbols entered';

  return (
    <SurfaceCard
      onPress={handleOpen}
      style={styles.card}
      accessibilityLabel={garment.name + '. ' + preview}
      accessibilityHint="Opens the saved care instruction">
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <Text style={styles.cardName} numberOfLines={1}>
            {garment.name}
          </Text>
          <Text style={styles.cardPreview} numberOfLines={1}>
            {preview}
          </Text>
        </View>
        <IconButton
          Icon={Trash2}
          onPress={handleDelete}
          label={'Delete ' + garment.name}
          tone="magenta"
        />
      </View>

      <View style={styles.glyphRow}>
        {garment.symbolIds.slice(0, 7).map(id => (
          <View key={id} style={styles.glyphCell}>
            <CareSymbolGlyph symbolId={id} size={24} />
          </View>
        ))}
      </View>
    </SurfaceCard>
  );
});

type Props = {
  garments: Garment[];
  onOpenGarment: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (garment: Garment) => void;
  onBuildLabel: () => void;
  onSettings: () => void;
  onTab: (tab: TabId) => void;
};

export function FavoritesScreen({
  garments,
  onOpenGarment,
  onDelete,
  onRestore,
  onBuildLabel,
  onSettings,
  onTab,
}: Props) {
  const [query, setQuery] = useState('');
  const [pendingUndo, setPendingUndo] = useState<Garment | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (undoTimer.current) {
        clearTimeout(undoTimer.current);
      }
    },
    [],
  );

  const data = useMemo(() => {
    const q = normalize(query);
    if (q.length === 0) {
      return garments;
    }
    return garments.filter(g => normalize(g.name + ' ' + g.notes).indexOf(q) >= 0);
  }, [garments, query]);

  const handleClear = useCallback(() => setQuery(''), []);

  const startUndo = useCallback(
    (garment: Garment) => {
      onDelete(garment.id);
      setPendingUndo(garment);
      if (undoTimer.current) {
        clearTimeout(undoTimer.current);
      }
      undoTimer.current = setTimeout(() => setPendingUndo(null), UNDO_MS);
    },
    [onDelete],
  );

  const confirmDelete = useCallback(
    (garment: Garment) => {
      Alert.alert('Delete ' + garment.name + '?', 'You can undo this straight away.', [
        { text: 'Keep', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => startUndo(garment) },
      ]);
    },
    [startUndo],
  );

  const handleUndo = useCallback(() => {
    if (pendingUndo) {
      onRestore(pendingUndo);
    }
    setPendingUndo(null);
  }, [onRestore, pendingUndo]);

  const renderItem = useCallback(
    ({ item }: { item: Garment }) => (
      <GarmentCard garment={item} onOpen={onOpenGarment} onDelete={confirmDelete} />
    ),
    [confirmDelete, onOpenGarment],
  );

  const keyExtractor = useCallback((item: Garment) => item.id, []);

  return (
    <ScreenBackground variant="favorites">
      <ScreenHeader
        title="Favorites"
        rightSlot={<IconButton Icon={Settings} onPress={onSettings} label="Settings" />}
      />

      {garments.length > 0 ? (
        <View style={styles.search}>
          <LocalSearchField
            label="Search garments"
            placeholder="Search saved garments"
            value={query}
            onChange={setQuery}
            onClear={handleClear}
          />
        </View>
      ) : null}

      <View style={styles.listRegion}>
        {garments.length === 0 ? (
          <EmptyState
            kind="collection"
            title="Your garments, remembered"
            body="Build a label from the symbols on a garment and save it here. Everything stays on this device."
            actionLabel="BUILD A LABEL"
            onAction={onBuildLabel}
            width={SPAN_W}
          />
        ) : data.length === 0 ? (
          <EmptyState
            kind="search"
            title="No garments found"
            body={'Nothing matches "' + query + '".'}
            actionLabel="CLEAR SEARCH"
            onAction={handleClear}
            width={SPAN_W}
          />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={5}
          />
        )}
      </View>

      <UndoSnackbar
        visible={pendingUndo !== null}
        message={pendingUndo ? pendingUndo.name + ' deleted' : ''}
        actionLabel="UNDO"
        onAction={handleUndo}
      />

      <BottomNavigation active="favorites" onSelect={onTab} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  search: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
  },
  listRegion: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    gap: GRID_GAP,
  },
  card: {
    minHeight: 112,
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  cardPreview: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text.muted,
  },
  glyphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  glyphCell: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
  },
});

export default FavoritesScreen;
