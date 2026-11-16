import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { TOUCH_MIN } from '../constants/config';
import { theme } from '../constants/theme';

/**
 * Labelled local search. The field keeps its position while results change, so
 * the list below can update without the input moving under the user's finger.
 */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  onClear: () => void;
};

function LocalSearchFieldBase({ label, placeholder, value, onChange, onClear }: Props) {
  const hasText = value.length > 0;

  return (
    <View style={styles.root}>
      <Text style={styles.label} nativeID="searchLabel">
        {label}
      </Text>
      <View style={styles.field}>
        <Search size={20} color={theme.colors.text.muted} strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.muted}
          returnKeyType="search"
          style={styles.input}
          accessibilityLabel={label}
          accessibilityLabelledBy="searchLabel"
        />
        {hasText ? (
          <Pressable
            onPress={onClear}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clear}>
            <X size={20} color={theme.colors.text.primary} strokeWidth={2.2} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
  field: {
    height: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  clear: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LocalSearchField = memo(LocalSearchFieldBase);

export default LocalSearchField;
