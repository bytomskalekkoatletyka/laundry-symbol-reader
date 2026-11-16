import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, Layers, LayoutGrid, Lightbulb } from 'lucide-react-native';

import { NAV_H, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { GlyphIcon } from './ActionButtons';

export type TabId = 'categories' | 'builder' | 'favorites' | 'tips';

type Tab = { id: TabId; label: string; Icon: GlyphIcon };

const TABS: Tab[] = [
  { id: 'categories', label: 'Categories', Icon: LayoutGrid },
  { id: 'builder', label: 'Builder', Icon: Layers },
  { id: 'favorites', label: 'Favorites', Icon: Heart },
  { id: 'tips', label: 'Tips', Icon: Lightbulb },
];

const TAB_W = Math.floor(SCREEN_W / TABS.length);
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type ItemProps = { tab: Tab; active: boolean; onSelect: (id: TabId) => void };

function NavItem({ tab, active, onSelect }: ItemProps) {
  // Hoisted handler: the list is fixed, so no new closure per render of the bar.
  const handlePress = useCallback(() => onSelect(tab.id), [onSelect, tab.id]);
  const color = active ? theme.colors.text.primary : theme.colors.text.muted;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: active }}
      style={[styles.item, { width: TAB_W, height: NAV_H }, active ? styles.itemActive : null]}>
      <View style={styles.marker}>
        {active ? <View style={styles.markerBar} /> : null}
      </View>
      <tab.Icon size={22} color={color} strokeWidth={active ? 2.4 : 1.8} />
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {tab.label}
      </Text>
    </Pressable>
  );
}

type Props = { active: TabId; onSelect: (id: TabId) => void };

function BottomNavigationBase({ active, onSelect }: Props) {
  return (
    <View style={styles.root}>
      {TABS.map(tab => (
        <NavItem key={tab.id} tab={tab} active={tab.id === active} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: theme.colors.ui.header,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    paddingBottom: 8,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  itemActive: {
    backgroundColor: 'rgba(176,221,189,0.45)',
  },
  marker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    alignItems: 'center',
  },
  markerBar: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.brand.magenta,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export const BottomNavigation = memo(BottomNavigationBase);

export default BottomNavigation;
