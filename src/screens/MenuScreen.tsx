import React, { useCallback, useMemo } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BookOpen, Settings } from 'lucide-react-native';

import { CELL_W, GRID_COLS, GRID_GAP, GUTTER, SPAN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { categorySprites } from '../assets';
import {
  CATEGORIES,
  Category,
  CategoryId,
  SYMBOLS_BY_CATEGORY,
  TOTAL_CATEGORIES,
  TOTAL_SYMBOLS,
} from '../game/catalog';
import { IconButton, ICON_SIZE } from '../components/ActionButtons';
import { BottomNavigation, TabId } from '../components/BottomNavigation';
import { CategoryTile } from '../components/CategoryTile';
import { ReferenceCountCard } from '../components/ReferenceCountCard';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { usePressScale } from '../hooks/useEntrance';

/**
 * Categories hub (M3 bento). A bounded list of care families, then one action
 * group: the magenta START READING tile beside two reference counts.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const BENTO_H = 146;
const BENTO_LEFT_W = Math.floor(SPAN_W * 0.56);
const BENTO_RIGHT_W = SPAN_W - BENTO_LEFT_W - GRID_GAP;
const KIT_GAP = 8;
const KIT_W = Math.floor((SPAN_W - 4 * KIT_GAP) / 5);

type Props = {
  lastCategory: CategoryId;
  onOpenCategory: (id: CategoryId) => void;
  onStartReading: () => void;
  onSettings: () => void;
  onTab: (tab: TabId) => void;
};

function LaundryKitStrip() {
  return (
    <View style={styles.kit}>
      {categorySprites.map((sprite, index) => (
        <View key={index} style={[styles.kitTile, { width: KIT_W, height: KIT_W }]}>
          <Image source={sprite} style={styles.kitImage} resizeMode="contain" />
        </View>
      ))}
    </View>
  );
}

function StartReadingTile({ onPress, category }: { onPress: () => void; category: string }) {
  const press = usePressScale(0.98);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="Start reading"
      accessibilityHint={'Opens the ' + category + ' symbols'}
      style={{ width: BENTO_LEFT_W, height: BENTO_H }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.startShell,
          theme.shadows.action,
          { transform: [{ scale: press.scale }] },
        ]}>
        <LinearGradient
          colors={theme.gradients.action}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.startFill}>
          <View style={styles.startRow}>
            <BookOpen size={ICON_SIZE} color={theme.colors.text.onDark} strokeWidth={2.2} />
            <Text style={styles.startLabel}>START READING</Text>
          </View>
          <Text style={styles.startHint} numberOfLines={1}>
            {category} symbols first
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export function MenuScreen({
  lastCategory,
  onOpenCategory,
  onStartReading,
  onSettings,
  onTab,
}: Props) {
  const counts = useMemo(
    () => ({
      wash: SYMBOLS_BY_CATEGORY.wash.length,
      bleach: SYMBOLS_BY_CATEGORY.bleach.length,
      dry: SYMBOLS_BY_CATEGORY.dry.length,
      iron: SYMBOLS_BY_CATEGORY.iron.length,
      clean: SYMBOLS_BY_CATEGORY.clean.length,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Category; index: number }) => (
      <CategoryTile
        category={item}
        count={counts[item.id]}
        width={index === CATEGORIES.length - 1 ? SPAN_W : CELL_W}
        selected={item.id === lastCategory}
        onPress={onOpenCategory}
      />
    ),
    [counts, lastCategory, onOpenCategory],
  );

  const keyExtractor = useCallback((item: Category) => item.id, []);

  const listHeader = useMemo(
    () => (
      <View style={styles.intro}>
        <Text style={styles.introTitle}>Read a label with confidence</Text>
        <Text style={styles.introBody}>
          Five care families, one symbol at a time. Pick a family to see every symbol it holds.
        </Text>
        <LaundryKitStrip />
        <Text style={styles.kitCaption}>EVERYDAY LAUNDRY KIT</Text>
      </View>
    ),
    [],
  );

  const activeCategoryLabel =
    CATEGORIES.find(c => c.id === lastCategory)?.label || CATEGORIES[0].label;

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="Care guide"
        showLogo
        rightSlot={<IconButton Icon={Settings} onPress={onSettings} label="Settings" />}
      />

      <View style={styles.listRegion}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={GRID_COLS}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          windowSize={5}
        />
      </View>

      <View style={styles.actionRegion}>
        <Text style={styles.hint}>
          {TOTAL_SYMBOLS} SYMBOLS {'·'} {TOTAL_CATEGORIES} CARE FAMILIES
        </Text>
        <View style={styles.bento}>
          <StartReadingTile onPress={onStartReading} category={activeCategoryLabel} />
          <View style={[styles.bentoRight, { width: BENTO_RIGHT_W, height: BENTO_H }]}>
            <ReferenceCountCard value={String(TOTAL_SYMBOLS)} label="symbols" tone="green" />
            <ReferenceCountCard
              value={String(TOTAL_CATEGORIES)}
              label="categories"
              tone="blue"
            />
          </View>
        </View>
      </View>

      <BottomNavigation active="categories" onSelect={onTab} />
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
    paddingBottom: theme.spacing.md,
    gap: GRID_GAP,
  },
  column: {
    gap: GRID_GAP,
  },
  intro: {
    marginBottom: theme.spacing.xs,
  },
  introTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  introBody: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text.secondary,
  },
  kit: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    gap: KIT_GAP,
  },
  kitTile: {
    borderRadius: theme.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  kitImage: {
    width: '70%',
    height: '70%',
  },
  kitCaption: {
    marginTop: theme.spacing.sm,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  actionRegion: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  hint: {
    marginBottom: theme.spacing.sm,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  bento: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
  startShell: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
  },
  startFill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    justifyContent: 'flex-end',
    gap: 6,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  startLabel: {
    fontSize: 18,
    lineHeight: ICON_SIZE,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: theme.colors.text.onDark,
  },
  startHint: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.86)',
  },
  bentoRight: {
    justifyContent: 'space-between',
  },
});

export default MenuScreen;
