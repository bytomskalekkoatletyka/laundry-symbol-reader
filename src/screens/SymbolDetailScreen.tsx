import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, ChevronDown, ChevronUp, FileText, Plus } from 'lucide-react-native';

import { GUTTER, SPAN_W, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { CATEGORY_BY_ID, SYMBOL_BY_ID } from '../game/catalog';
import { PrimaryButton, SecondaryButton, IconButton } from '../components/ActionButtons';
import { CareSymbolGlyph } from '../components/CareSymbolGlyph';
import { SaveCheck } from '../components/Feedback';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SurfaceCard } from '../components/SurfaceCard';

/**
 * One symbol, its meaning and two practical tips. Modifier and temperature
 * notes appear only when the selected record actually carries them.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ADDED_FEEDBACK_MS = 400;

type Block = { key: 'main' | 'tips' | 'notes' };

type Props = {
  symbolId: string;
  alreadySelected: boolean;
  onBack: () => void;
  onAddToLabel: (symbolId: string) => void;
  onViewInstruction: (symbolId: string) => void;
};

export function SymbolDetailScreen({
  symbolId,
  alreadySelected,
  onBack,
  onAddToLabel,
  onViewInstruction,
}: Props) {
  const [added, setAdded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const symbol = SYMBOL_BY_ID[symbolId];

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const handleAdd = useCallback(() => {
    if (timer.current) {
      return;
    }
    setAdded(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      onAddToLabel(symbolId);
    }, ADDED_FEEDBACK_MS);
  }, [onAddToLabel, symbolId]);

  const handleView = useCallback(() => onViewInstruction(symbolId), [onViewInstruction, symbolId]);

  const toggleNotes = useCallback(() => setNotesOpen(open => !open), []);

  if (!symbol) {
    return (
      <ScreenBackground variant="detail">
        <ScreenHeader
          title="Symbol"
          leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back" />}
        />
      </ScreenBackground>
    );
  }

  const category = CATEGORY_BY_ID[symbol.category];
  const blocks: Block[] = [{ key: 'main' }, { key: 'tips' }];
  if (symbol.modifierNote || symbol.conventionNote) {
    blocks.push({ key: 'notes' });
  }

  const renderBlock = ({ item }: { item: Block }) => {
    if (item.key === 'main') {
      return (
        <SurfaceCard style={styles.mainCard}>
          <View style={styles.canvas}>
            <CareSymbolGlyph
              symbolId={symbol.id}
              size={112}
              accessibilityLabel={symbol.title}
            />
          </View>
          <Text style={styles.meaningTitle}>{symbol.title}</Text>
          <Text style={styles.meaningBody}>{symbol.meaning}</Text>
          <Text style={styles.categoryCaption}>{category.browserTitle.toUpperCase()}</Text>
        </SurfaceCard>
      );
    }

    if (item.key === 'tips') {
      return (
        <SurfaceCard style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>Care tips</Text>
          {symbol.tips.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </SurfaceCard>
      );
    }

    return (
      <SurfaceCard style={styles.tipsCard}>
        {symbol.modifierNote ? (
          <Text style={styles.recognition}>{symbol.modifierNote}</Text>
        ) : null}

        {symbol.conventionNote ? (
          <View style={styles.notesBlock}>
            <Pressable
              onPress={toggleNotes}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Temperature notes"
              accessibilityState={{ expanded: notesOpen }}
              style={styles.notesToggle}>
              <Text style={styles.notesToggleLabel}>Temperature notes</Text>
              {notesOpen ? (
                <ChevronUp size={20} color={theme.colors.text.primary} strokeWidth={2} />
              ) : (
                <ChevronDown size={20} color={theme.colors.text.primary} strokeWidth={2} />
              )}
            </Pressable>
            {notesOpen ? <Text style={styles.notesBody}>{symbol.conventionNote}</Text> : null}
          </View>
        ) : null}
      </SurfaceCard>
    );
  };

  return (
    <ScreenBackground variant="detail">
      <ScreenHeader
        title={category.browserTitle}
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back" />}
      />

      <View style={styles.listRegion}>
        <FlatList
          data={blocks}
          renderItem={renderBlock}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.actionPanel}>
        <SaveCheck visible={added} message="Added to label" />
        <PrimaryButton
          label={alreadySelected && !added ? 'UPDATE LABEL' : 'ADD TO LABEL'}
          onPress={handleAdd}
          Icon={Plus}
          width={SPAN_W}
          accessibilityHint="Places this symbol in its label slot"
        />
        <SecondaryButton
          label="VIEW INSTRUCTION"
          onPress={handleView}
          Icon={FileText}
          width={SPAN_W}
          accessibilityHint="Opens the care instruction for this symbol"
        />
      </View>
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
  mainCard: {
    alignItems: 'center',
  },
  canvas: {
    width: 152,
    height: 152,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  meaningTitle: {
    marginTop: theme.spacing.lg,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  meaningBody: {
    marginTop: 6,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  categoryCaption: {
    marginTop: theme.spacing.md,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  tipsCard: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 2,
    borderWidth: 2,
    borderColor: theme.colors.brand.green,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  recognition: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  notesBlock: {
    gap: theme.spacing.sm,
  },
  notesToggle: {
    height: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  notesToggleLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  notesBody: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text.muted,
  },
  actionPanel: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
});

export default SymbolDetailScreen;
