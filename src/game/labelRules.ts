/**
 * Label draft rules.
 *
 * Wash, Bleach and Iron accept zero or one record. Dry keeps tumble and natural
 * separately, Clean keeps professional dry and professional wet separately.
 * Replacing inside a subslot replaces rather than appends, and a prohibition
 * never spills over into another process.
 */

import { CATEGORIES, CategoryId, SubSlot, SYMBOL_BY_ID } from './catalog';

export type LabelDraft = Record<SubSlot, string | null>;

export const SUBSLOTS_BY_CATEGORY: Record<CategoryId, SubSlot[]> = {
  wash: ['wash'],
  bleach: ['bleach'],
  dry: ['tumble', 'natural'],
  iron: ['iron'],
  clean: ['professionalDry', 'professionalWet'],
};

export const SUBSLOT_LABEL: Record<SubSlot, string> = {
  wash: 'Washing',
  bleach: 'Bleaching',
  tumble: 'Tumble drying',
  natural: 'Natural drying',
  iron: 'Ironing',
  professionalDry: 'Dry cleaning',
  professionalWet: 'Wet cleaning',
};

export function emptyDraft(): LabelDraft {
  return {
    wash: null,
    bleach: null,
    tumble: null,
    natural: null,
    iron: null,
    professionalDry: null,
    professionalWet: null,
  };
}

/** Puts a catalog ID into its own subslot. Selecting the same ID twice is idempotent. */
export function withSymbol(draft: LabelDraft, symbolId: string): LabelDraft {
  const symbol = SYMBOL_BY_ID[symbolId];
  if (!symbol) {
    return draft;
  }
  if (draft[symbol.subslot] === symbolId) {
    return draft;
  }
  const next = { ...draft };
  next[symbol.subslot] = symbolId;
  return next;
}

export function withoutSubslot(draft: LabelDraft, subslot: SubSlot): LabelDraft {
  if (draft[subslot] === null) {
    return draft;
  }
  const next = { ...draft };
  next[subslot] = null;
  return next;
}

export function selectedIn(draft: LabelDraft, category: CategoryId): string[] {
  const out: string[] = [];
  SUBSLOTS_BY_CATEGORY[category].forEach(slot => {
    const id = draft[slot];
    if (id) {
      out.push(id);
    }
  });
  return out;
}

/** A category counts as set when at least one of its supported subslots is present. */
export function isCategorySet(draft: LabelDraft, category: CategoryId): boolean {
  return selectedIn(draft, category).length > 0;
}

export function setCategoryCount(draft: LabelDraft): number {
  return CATEGORIES.reduce((n, c) => (isCategorySet(draft, c.id) ? n + 1 : n), 0);
}

/** All selected IDs in the fixed Wash, Bleach, Dry, Iron, Clean order. */
export function orderedIds(draft: LabelDraft): string[] {
  const out: string[] = [];
  CATEGORIES.forEach(c => {
    selectedIn(draft, c.id).forEach(id => out.push(id));
  });
  return out;
}

export function isDraftEmpty(draft: LabelDraft): boolean {
  return orderedIds(draft).length === 0;
}

export function symbolCount(draft: LabelDraft): number {
  return orderedIds(draft).length;
}

/**
 * Restrictions a stain-advice screen must respect. Unknown stays unknown:
 * an absent symbol never becomes a permission.
 */
export type CareRestrictions = {
  washAllowed: 'yes' | 'no' | 'unknown';
  maxWashTemp: number | null;
  bleachAllowed: 'yes' | 'oxygen' | 'no' | 'unknown';
};

export function restrictionsOf(draft: LabelDraft): CareRestrictions {
  const washId = draft.wash;
  const bleachId = draft.bleach;

  let washAllowed: CareRestrictions['washAllowed'] = 'unknown';
  let maxWashTemp: number | null = null;
  if (washId === 'wash_none') {
    washAllowed = 'no';
  } else if (washId) {
    washAllowed = 'yes';
    const match = /_(\d+)_/.exec(washId) || /_(\d+)$/.exec(washId);
    maxWashTemp = match ? Number(match[1]) : null;
  }

  let bleachAllowed: CareRestrictions['bleachAllowed'] = 'unknown';
  if (bleachId === 'bleach_none') {
    bleachAllowed = 'no';
  } else if (bleachId === 'bleach_oxygen') {
    bleachAllowed = 'oxygen';
  } else if (bleachId === 'bleach_any') {
    bleachAllowed = 'yes';
  }

  return { washAllowed, maxWashTemp, bleachAllowed };
}
