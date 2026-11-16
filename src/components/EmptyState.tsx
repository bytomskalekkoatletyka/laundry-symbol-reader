import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FolderOpen, SearchX } from 'lucide-react-native';

import { theme } from '../constants/theme';
import { assets } from '../assets';
import { SecondaryButton } from './ActionButtons';

/**
 * One empty state for the whole app: an outline mark, a sentence that explains
 * the state and exactly one useful next action. Never an empty rounded box.
 */

type Props = {
  kind: 'search' | 'collection';
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  width: number;
};

function EmptyStateBase({ kind, title, body, actionLabel, onAction, width }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.art}>
        {kind === 'collection' ? (
          <Image source={assets.iconHome} style={styles.illustration} resizeMode="contain" />
        ) : (
          <SearchX size={44} color={theme.colors.text.muted} strokeWidth={1.6} />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      {actionLabel && onAction ? (
        <View style={styles.action}>
          <SecondaryButton
            label={actionLabel}
            onPress={onAction}
            Icon={kind === 'collection' ? FolderOpen : undefined}
            width={Math.min(width, 260)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingVertical: theme.spacing.huge,
    paddingHorizontal: theme.spacing.xl,
  },
  art: {
    width: 96,
    height: 96,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.inset,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  illustration: {
    width: 64,
    height: 64,
    opacity: 0.85,
  },
  title: {
    marginTop: theme.spacing.lg,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  action: {
    marginTop: theme.spacing.xl,
  },
});

export const EmptyState = memo(EmptyStateBase);

export default EmptyState;
