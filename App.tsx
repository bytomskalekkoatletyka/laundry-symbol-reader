import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';

import { theme } from './src/constants/theme';
import { CategoryId, SubSlot, SYMBOL_BY_ID } from './src/game/catalog';
import { buildCareSummary, CareSummary } from './src/game/buildCareSummary';
import { emptyDraft, restrictionsOf, withSymbol } from './src/game/labelRules';
import { useFadeIn } from './src/hooks/useEntrance';
import { useGarments } from './src/hooks/useGarments';
import { useLabelDraft } from './src/hooks/useLabelDraft';
import { TabId } from './src/components/BottomNavigation';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SymbolDetailScreen } from './src/screens/SymbolDetailScreen';
import { LabelBuilderScreen } from './src/screens/LabelBuilderScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { StainTipsScreen } from './src/screens/StainTipsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

/**
 * Root state machine. It owns navigation and the two pieces of shared state
 * (the editable label and the saved garments) and hands screens plain values —
 * no navigation library, and no screen subscribing to the whole app state.
 */

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'detail'
  | 'builder'
  | 'gameover'
  | 'favorites'
  | 'tips'
  | 'settings';

type Result = { summary: CareSummary; savedName: string | null };

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [previous, setPrevious] = useState<Screen>('menu');
  const [category, setCategory] = useState<CategoryId>('wash');
  const [activeSymbolId, setActiveSymbolId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const label = useLabelDraft();
  const garments = useGarments();
  const fade = useFadeIn(screen);

  // The ref keeps the previous screen without running a side effect inside a
  // state updater, which React may call twice.
  const currentScreen = useRef<Screen>('loader');
  const go = useCallback((next: Screen) => {
    setPrevious(currentScreen.current);
    currentScreen.current = next;
    setScreen(next);
  }, []);

  // ---------------------------------------------------------------- navigation

  const handleLoaderDone = useCallback(() => go('menu'), [go]);

  const handleOpenCategory = useCallback(
    (id: CategoryId) => {
      setCategory(id);
      go('game');
    },
    [go],
  );

  const handleStartReading = useCallback(() => go('game'), [go]);

  const handleOpenSymbol = useCallback(
    (id: string) => {
      setActiveSymbolId(id);
      go('detail');
    },
    [go],
  );

  const handleAddToLabel = useCallback(
    (id: string) => {
      label.addSymbol(id);
      go('builder');
    },
    [go, label],
  );

  const showSummary = useCallback(
    (summary: CareSummary, savedName: string | null) => {
      setResult({ summary, savedName });
      go('gameover');
    },
    [go],
  );

  const handleViewInstruction = useCallback(
    (id: string) => {
      showSummary(buildCareSummary(withSymbol(emptyDraft(), id)), null);
    },
    [showSummary],
  );

  const handleShowInstruction = useCallback(() => {
    showSummary(buildCareSummary(label.draft), null);
  }, [label.draft, showSummary]);

  const handleBuildAgain = useCallback(() => {
    if (result && result.summary.symbolIds.length > 0) {
      label.loadFrom(result.summary.symbolIds, null);
    }
    go('builder');
  }, [go, label, result]);

  const handleOpenGarment = useCallback(
    (id: string) => {
      const garment = garments.byId(id);
      if (!garment) {
        return;
      }
      label.loadFrom(garment.symbolIds, garment.id);
      showSummary(
        buildCareSummary(garment.symbolIds.reduce((acc, s) => withSymbol(acc, s), emptyDraft())),
        garment.name,
      );
    },
    [garments, label, showSummary],
  );

  const handleSaveGarment = useCallback(
    (name: string, notes: string) => {
      if (!result) {
        return false;
      }
      const saved = garments.save({
        id: label.editingGarmentId,
        name,
        notes,
        symbolIds: result.summary.symbolIds,
      });
      if (!saved) {
        return false;
      }
      setResult({ summary: result.summary, savedName: saved.name });
      return true;
    },
    [garments, label.editingGarmentId, result],
  );

  const handleTab = useCallback(
    (tab: TabId) => {
      if (tab === 'categories') {
        go('menu');
      } else if (tab === 'builder') {
        go('builder');
      } else if (tab === 'favorites') {
        go('favorites');
      } else {
        go('tips');
      }
    },
    [go],
  );

  const handleSettings = useCallback(() => go('settings'), [go]);

  const handleRemoveSubslot = useCallback(
    (subslot: SubSlot) => label.removeSubslot(subslot),
    [label],
  );

  const handleBack = useCallback(() => {
    if (screen === 'detail') {
      go('game');
      return true;
    }
    if (screen === 'game') {
      go('menu');
      return true;
    }
    if (screen === 'builder') {
      go(previous === 'detail' ? 'game' : 'menu');
      return true;
    }
    if (screen === 'gameover') {
      go(previous === 'favorites' ? 'favorites' : 'builder');
      return true;
    }
    if (screen === 'settings') {
      go(previous === 'settings' ? 'menu' : previous);
      return true;
    }
    if (screen === 'favorites' || screen === 'tips') {
      go('menu');
      return true;
    }
    return false;
  }, [go, previous, screen]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => subscription.remove();
  }, [handleBack]);

  // ------------------------------------------------------------------ rendering

  const restrictions = useMemo(() => restrictionsOf(label.draft), [label.draft]);

  const detailSelected =
    activeSymbolId !== null &&
    SYMBOL_BY_ID[activeSymbolId] !== undefined &&
    label.draft[SYMBOL_BY_ID[activeSymbolId].subslot] === activeSymbolId;

  let content: React.ReactNode = null;

  if (screen === 'loader') {
    content = <LoaderScreen onDone={handleLoaderDone} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        lastCategory={category}
        onOpenCategory={handleOpenCategory}
        onStartReading={handleStartReading}
        onSettings={handleSettings}
        onTab={handleTab}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        category={category}
        selectedIds={label.ids}
        onBack={handleBack}
        onOpenSymbol={handleOpenSymbol}
        onBuildLabel={() => go('builder')}
        onSettings={handleSettings}
        onTab={handleTab}
      />
    );
  } else if (screen === 'detail' && activeSymbolId) {
    content = (
      <SymbolDetailScreen
        symbolId={activeSymbolId}
        alreadySelected={detailSelected}
        onBack={handleBack}
        onAddToLabel={handleAddToLabel}
        onViewInstruction={handleViewInstruction}
      />
    );
  } else if (screen === 'builder') {
    content = (
      <LabelBuilderScreen
        draft={label.draft}
        canGoBack={previous === 'detail' || previous === 'game'}
        onBack={handleBack}
        onAddSymbol={label.addSymbol}
        onRemoveSubslot={handleRemoveSubslot}
        onClear={label.clear}
        onShowInstruction={handleShowInstruction}
        onBrowse={() => go('game')}
        onTab={handleTab}
      />
    );
  } else if (screen === 'gameover' && result) {
    content = (
      <GameOverScreen
        summary={result.summary}
        savedName={result.savedName}
        hapticsEnabled={hapticsEnabled}
        onBack={handleBack}
        onSave={handleSaveGarment}
        onBuildAgain={handleBuildAgain}
        onViewFavorites={() => go('favorites')}
        onMenu={() => go('menu')}
      />
    );
  } else if (screen === 'favorites') {
    content = (
      <FavoritesScreen
        garments={garments.garments}
        onOpenGarment={handleOpenGarment}
        onDelete={garments.remove}
        onRestore={garments.restore}
        onBuildLabel={() => go('builder')}
        onSettings={handleSettings}
        onTab={handleTab}
      />
    );
  } else if (screen === 'tips') {
    content = (
      <StainTipsScreen
        restrictions={restrictions}
        hasLabel={!label.empty}
        onCheckSymbols={() => go('menu')}
        onSettings={handleSettings}
        onTab={handleTab}
      />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        hapticsEnabled={hapticsEnabled}
        onToggleHaptics={setHapticsEnabled}
        onBack={handleBack}
      />
    );
  } else {
    content = (
      <MenuScreen
        lastCategory={category}
        onOpenCategory={handleOpenCategory}
        onStartReading={handleStartReading}
        onSettings={handleSettings}
        onTab={handleTab}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
      />
      {/* box-none: the crossfade wrapper must never swallow a tap on Android. */}
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        {content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});
