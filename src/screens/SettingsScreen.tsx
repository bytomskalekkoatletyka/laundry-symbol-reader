import React, { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';

import { APP_VERSION, CONTENT_VERIFIED_ON, GUTTER, TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';
import { TOTAL_SYMBOLS } from '../game/catalog';
import { IconButton } from '../components/ActionButtons';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SurfaceCard } from '../components/SurfaceCard';

/**
 * App preferences and provenance. No account, no analytics, no network call:
 * everything the app knows is bundled or written to this device.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Block = { key: 'feedback' | 'about' };

const BLOCKS: Block[] = [{ key: 'feedback' }, { key: 'about' }];

type Props = {
  hapticsEnabled: boolean;
  onToggleHaptics: (next: boolean) => void;
  onBack: () => void;
};

export function SettingsScreen({ hapticsEnabled, onToggleHaptics, onBack }: Props) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const openSources = useCallback(() => setSourcesOpen(true), []);
  const closeSources = useCallback(() => setSourcesOpen(false), []);

  const renderBlock = ({ item }: { item: Block }) => {
    if (item.key === 'feedback') {
      return (
        <SurfaceCard style={styles.card}>
          <Text style={styles.cardTitle}>Feedback</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.rowLabel}>Save haptics</Text>
              <Text style={styles.rowHint}>One short pulse when a garment is saved.</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={onToggleHaptics}
              accessibilityLabel="Save haptics"
              thumbColor={hapticsEnabled ? theme.colors.brand.magenta : '#FFFFFF'}
              trackColor={{ false: '#CBD8CD', true: theme.colors.brand.greenSoft }}
            />
          </View>
        </SurfaceCard>
      );
    }

    return (
      <SurfaceCard style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.rowLabel}>Laundry Symbol Reader</Text>
          <Text style={styles.rowValue}>Version {APP_VERSION}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.rowLabel}>Reference language</Text>
          <Text style={styles.rowValue}>English</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.rowLabel}>Works offline</Text>
          <Text style={styles.rowValue}>{TOTAL_SYMBOLS} symbols bundled</Text>
        </View>
        <Text style={styles.rowHint}>Your garments stay on this device.</Text>

        <Pressable
          onPress={openSources}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Care reference"
          style={styles.sourceRow}>
          <Text style={styles.sourceLabel}>Care reference</Text>
          <Text style={styles.sourceValue}>{'>'}</Text>
        </Pressable>
      </SurfaceCard>
    );
  };

  return (
    <ScreenBackground variant="settings">
      <ScreenHeader
        title="Settings"
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back" />}
      />

      <View style={styles.listRegion}>
        <FlatList
          data={BLOCKS}
          renderItem={renderBlock}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal visible={sourcesOpen} transparent animationType="slide" onRequestClose={closeSources}>
        <View style={styles.scrim}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} accessibilityRole="header">
                Care reference
              </Text>
              <Pressable
                onPress={closeSources}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.sheetClose}>
                <X size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
              </Pressable>
            </View>

            <Text style={styles.sheetBody}>
              Symbol meanings follow the GINETEX care-symbol reference and its care-label
              brochure. Iron temperatures show both the current ISO 3758:2023 maxima and the
              older chart values, so an unknown garment is never ironed hotter than it should be.
            </Text>
            <Text style={styles.sheetBody}>
              Stain advice is paraphrased from general detergent-based guidance and stays within
              whatever the open label allows.
            </Text>
            <Text style={styles.sheetMeta}>Content verified on {CONTENT_VERIFIED_ON}</Text>
          </View>
        </View>
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
    gap: theme.spacing.xl,
  },
  card: {
    gap: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  switchRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  switchText: {
    flex: 1,
  },
  aboutRow: {
    minHeight: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  rowLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  rowValue: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text.muted,
  },
  rowHint: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
  sourceRow: {
    height: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.inset,
  },
  sourceLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  sourceValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: theme.colors.brand.magenta,
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
  sheetBody: {
    fontSize: 16,
    lineHeight: 23,
    color: theme.colors.text.secondary,
  },
  sheetMeta: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
});

export default SettingsScreen;
