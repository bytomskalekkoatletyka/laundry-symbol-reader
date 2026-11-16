import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Droplets, LayoutGrid, Settings, X } from 'lucide-react-native';

import { CELL_W, GRID_COLS, GRID_GAP, GUTTER, SPAN_W, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { CareRestrictions } from '../game/labelRules';
import {
  adviceContext,
  PROFESSIONAL_STEP,
  searchTopics,
  SHARED_CLOSING,
  StainTopic,
} from '../game/stainTopics';
import { IconButton, PrimaryButton } from '../components/ActionButtons';
import { BottomNavigation, TabId } from '../components/BottomNavigation';
import { EmptyState } from '../components/EmptyState';
import { LocalSearchField } from '../components/LocalSearchField';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SurfaceCard } from '../components/SurfaceCard';

/**
 * Conservative stain advice. Steps never exceed what the currently open label
 * allows: a do-not-wash selection replaces the home-washing steps outright.
 */

const TOPIC_CARD_H = 118;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type CardProps = { topic: StainTopic; onOpen: (id: string) => void };

const TopicCard = memo(function TopicCard({ topic, onOpen }: CardProps) {
  const handlePress = useCallback(() => onOpen(topic.id), [onOpen, topic.id]);

  return (
    <SurfaceCard
      width={CELL_W}
      height={TOPIC_CARD_H}
      onPress={handlePress}
      style={styles.card}
      accessibilityLabel={topic.title + '. First action: ' + topic.firstAction}
      accessibilityHint="Opens the stain advice">
      <Droplets size={28} color={theme.colors.brand.deep} strokeWidth={1.8} />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {topic.title}
      </Text>
      <Text style={styles.cardCue} numberOfLines={1}>
        {topic.firstAction}
      </Text>
    </SurfaceCard>
  );
});

type Props = {
  restrictions: CareRestrictions | null;
  hasLabel: boolean;
  onCheckSymbols: () => void;
  onSettings: () => void;
  onTab: (tab: TabId) => void;
};

export function StainTipsScreen({
  restrictions,
  hasLabel,
  onCheckSymbols,
  onSettings,
  onTab,
}: Props) {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const data = useMemo(() => searchTopics(query), [query]);
  const open = useMemo(() => data.find(t => t.id === openId) || null, [data, openId]);
  const context = useMemo(
    () => adviceContext(restrictions, hasLabel),
    [hasLabel, restrictions],
  );

  const handleClear = useCallback(() => setQuery(''), []);
  const handleOpen = useCallback((id: string) => setOpenId(id), []);
  const handleClose = useCallback(() => setOpenId(null), []);

  const renderItem = useCallback(
    ({ item }: { item: StainTopic }) => <TopicCard topic={item} onOpen={handleOpen} />,
    [handleOpen],
  );

  const keyExtractor = useCallback((item: StainTopic) => item.id, []);

  const steps = open
    ? context.replaceWithProfessional
      ? [open.steps[0], PROFESSIONAL_STEP, 'Keep the garment damp-free until then']
      : open.steps
    : [];

  return (
    <ScreenBackground variant="tips">
      <ScreenHeader
        title="Stain tips"
        rightSlot={<IconButton Icon={Settings} onPress={onSettings} label="Settings" />}
      />

      <View style={styles.search}>
        <LocalSearchField
          label="Search stain topics"
          placeholder="Search stain topics"
          value={query}
          onChange={setQuery}
          onClear={handleClear}
        />
        <Text style={styles.context} numberOfLines={2}>
          {context.note}
        </Text>
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
          />
        ) : (
          <EmptyState
            kind="search"
            title="No topics found"
            body="Try a different word, or clear the search to see all eight topics."
            actionLabel="CLEAR SEARCH"
            onAction={handleClear}
            width={SPAN_W}
          />
        )}
      </View>

      <View style={styles.actionPanel}>
        <PrimaryButton
          label="CHECK CARE SYMBOLS"
          onPress={onCheckSymbols}
          Icon={LayoutGrid}
          width={SPAN_W}
          accessibilityHint="Returns to the care categories"
        />
      </View>

      <BottomNavigation active="tips" onSelect={onTab} />

      <Modal visible={open !== null} animationType="slide" transparent onRequestClose={handleClose}>
        <View style={styles.scrim}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} accessibilityRole="header">
                {open ? open.title : ''}
              </Text>
              <Pressable
                onPress={handleClose}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.sheetClose}>
                <X size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
              </Pressable>
            </View>

            <SurfaceCard tone="inset" style={styles.firstAction}>
              <Text style={styles.firstActionLabel}>FIRST ACTION</Text>
              <Text style={styles.firstActionValue}>{open ? open.firstAction : ''}</Text>
            </SurfaceCard>

            <Text style={styles.contextInSheet}>{context.note}</Text>

            {steps.map((step, index) => (
              <View key={step} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            <Text style={styles.closing}>{SHARED_CLOSING}</Text>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  search: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  context: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  listRegion: {
    flex: 1,
    marginTop: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingBottom: theme.spacing.lg,
    gap: GRID_GAP,
  },
  column: {
    gap: GRID_GAP,
  },
  card: {
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  cardCue: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
  actionPanel: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  scrim: {
    flex: 1,
    backgroundColor: theme.colors.ui.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.huge,
    gap: theme.spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetTitle: {
    flex: 1,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  sheetClose: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  firstAction: {
    paddingVertical: theme.spacing.md,
    gap: 2,
  },
  firstActionLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  firstActionValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  contextInSheet: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.green,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.greenSoft,
  },
  stepNumberText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  closing: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
});

export default StainTipsScreen;
