import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import { ArrowLeft, Check, Heart, LayoutGrid, RotateCcw, Save, X } from 'lucide-react-native';

import {
  GUTTER,
  NAME_MAX,
  NOTES_MAX,
  SAVED_TOAST_MS,
  SPAN_W,
  TOUCH_MIN,
} from '../constants/config';
import { theme } from '../constants/theme';
import { CareRow, CareSummary } from '../game/buildCareSummary';
import { IconButton, PrimaryButton, SecondaryButton } from '../components/ActionButtons';
import { CareSymbolGlyph } from '../components/CareSymbolGlyph';
import { SaveCheck } from '../components/Feedback';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SurfaceCard } from '../components/SurfaceCard';

/**
 * Care instruction — the result state of the reading flow.
 *
 * Every row is generated from the selected catalog IDs. An omitted category is
 * printed as unspecified, never silently turned into a permission.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  summary: CareSummary;
  savedName: string | null;
  hapticsEnabled: boolean;
  onBack: () => void;
  onSave: (name: string, notes: string) => boolean;
  onBuildAgain: () => void;
  onViewFavorites: () => void;
  onMenu: () => void;
};

export function GameOverScreen({
  summary,
  savedName,
  hapticsEnabled,
  onBack,
  onSave,
  onBuildAgain,
  onViewFavorites,
  onMenu,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSymbols = summary.symbolIds.length > 0;
  const saved = savedName !== null;

  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const openSheet = useCallback(() => {
    setError('');
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleSave = useCallback(() => {
    if (name.trim().length === 0) {
      setError('Enter a garment name');
      return;
    }
    const ok = onSave(name, notes);
    if (!ok) {
      setError('Could not save. Try again.');
      return;
    }
    setSheetOpen(false);
    setToast(true);
    if (hapticsEnabled) {
      Vibration.vibrate(20);
    }
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(false), SAVED_TOAST_MS);
  }, [hapticsEnabled, name, notes, onSave]);

  const renderRow = useCallback(
    ({ item }: { item: CareRow }) => (
      <View style={styles.careRow}>
        <View style={styles.rowGlyph}>
          {item.symbolIds.length > 0 ? (
            <CareSymbolGlyph symbolId={item.symbolIds[0]} size={28} />
          ) : (
            <View style={styles.rowGlyphEmpty} />
          )}
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowHeading}>{item.heading}</Text>
          <Text
            style={[styles.rowInstruction, item.unspecified ? styles.rowUnspecified : null]}>
            {item.instruction}
          </Text>
        </View>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: CareRow) => item.category, []);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.accent} />
      <SurfaceCard style={styles.stripCard}>
        <Text style={styles.stripLabel}>
          {hasSymbols ? 'SYMBOLS ON THIS LABEL' : 'NO SYMBOLS ENTERED YET'}
        </Text>
        {hasSymbols ? (
          <View style={styles.strip}>
            {summary.symbolIds.map(id => (
              <View key={id} style={styles.stripCell}>
                <CareSymbolGlyph symbolId={id} size={32} />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.stripEmpty}>
            Pick a symbol in the builder and the instruction appears here.
          </Text>
        )}
      </SurfaceCard>
      {savedName ? (
        <Text style={styles.savedLine} numberOfLines={1}>
          Saved as {savedName}
        </Text>
      ) : null}
    </View>
  );

  const listFooter = (
    <View style={styles.footerBlock}>
      <Text style={styles.explanation}>Follow any written instructions on the garment too.</Text>
      {summary.conventionNote ? (
        <Text style={styles.conventionNote}>{summary.conventionNote}</Text>
      ) : null}
    </View>
  );

  return (
    <ScreenBackground variant="result">
      <ScreenHeader
        title="Care instruction"
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back" />}
        rightSlot={<IconButton Icon={LayoutGrid} onPress={onMenu} label="Categories" />}
      />

      <View style={styles.listRegion}>
        <FlatList
          data={summary.rows}
          renderItem={renderRow}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.actionPanel}>
        <SaveCheck visible={toast} message="Garment saved" />

        {hasSymbols && !saved ? (
          <PrimaryButton
            label="SAVE GARMENT"
            onPress={openSheet}
            Icon={Save}
            width={SPAN_W}
            accessibilityHint="Names and stores this label on the device"
          />
        ) : null}

        {hasSymbols && saved ? (
          <SecondaryButton
            label="VIEW IN FAVORITES"
            onPress={onViewFavorites}
            Icon={Heart}
            width={SPAN_W}
          />
        ) : null}

        {hasSymbols ? (
          <SecondaryButton
            label="BUILD AGAIN"
            onPress={onBuildAgain}
            Icon={RotateCcw}
            width={SPAN_W}
            accessibilityHint="Returns to the builder with these symbols"
          />
        ) : (
          <PrimaryButton
            label="BUILD AGAIN"
            onPress={onBuildAgain}
            Icon={RotateCcw}
            width={SPAN_W}
            accessibilityHint="Returns to the builder"
          />
        )}
      </View>

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={closeSheet}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.scrim}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} accessibilityRole="header">
                Save garment
              </Text>
              <Pressable
                onPress={closeSheet}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.sheetClose}>
                <X size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Garment name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={NAME_MAX}
              placeholder="Blue linen shirt"
              placeholderTextColor={theme.colors.text.muted}
              returnKeyType="next"
              accessibilityLabel="Garment name"
              style={styles.nameInput}
            />
            {error.length > 0 ? (
              <Text style={styles.error} accessibilityLiveRegion="polite">
                {error}
              </Text>
            ) : null}

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              maxLength={NOTES_MAX}
              multiline
              placeholder="Where it is from, how it behaves in the wash"
              placeholderTextColor={theme.colors.text.muted}
              accessibilityLabel="Notes"
              style={styles.notesInput}
            />

            <View style={styles.sheetActions}>
              <PrimaryButton label="SAVE" onPress={handleSave} Icon={Check} width={SPAN_W} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    gap: theme.spacing.sm,
  },
  headerBlock: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  accent: {
    alignSelf: 'center',
    width: 64,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.brand.magenta,
    marginBottom: theme.spacing.sm,
  },
  stripCard: {
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  stripLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  stripCell: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  stripEmpty: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  savedLine: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.green,
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.card,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  rowGlyph: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
  },
  rowGlyphEmpty: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.divider,
  },
  rowText: {
    flex: 1,
  },
  rowHeading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  rowInstruction: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  rowUnspecified: {
    color: theme.colors.text.muted,
    fontStyle: 'italic',
  },
  footerBlock: {
    marginTop: theme.spacing.md,
    gap: 6,
  },
  explanation: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  conventionNote: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
  actionPanel: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
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
    gap: theme.spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetTitle: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
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
  inputLabel: {
    marginTop: theme.spacing.sm,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
  nameInput: {
    height: 56,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  notesInput: {
    height: 96,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    textAlignVertical: 'top',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.brand.magenta,
  },
  sheetActions: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
});

export default GameOverScreen;
