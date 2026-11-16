import { useCallback, useMemo, useState } from 'react';

import { CategoryId, SubSlot } from '../game/catalog';
import {
  LabelDraft,
  emptyDraft,
  isDraftEmpty,
  orderedIds,
  setCategoryCount,
  symbolCount,
  withSymbol,
  withoutSubslot,
} from '../game/labelRules';

export type LabelDraftApi = {
  draft: LabelDraft;
  ids: string[];
  count: number;
  setCount: number;
  empty: boolean;
  editingGarmentId: string | null;
  addSymbol: (symbolId: string) => void;
  removeSubslot: (subslot: SubSlot) => void;
  clear: () => void;
  loadFrom: (ids: string[], garmentId: string | null) => void;
};

/**
 * The editable label. A single owner keeps the draft so no screen has to
 * subscribe to the whole app state just to read one slot.
 */
export function useLabelDraft(): LabelDraftApi {
  const [draft, setDraft] = useState<LabelDraft>(emptyDraft);
  const [editingGarmentId, setEditingGarmentId] = useState<string | null>(null);

  const addSymbol = useCallback((symbolId: string) => {
    setDraft(current => withSymbol(current, symbolId));
  }, []);

  const removeSubslot = useCallback((subslot: SubSlot) => {
    setDraft(current => withoutSubslot(current, subslot));
  }, []);

  const clear = useCallback(() => {
    setDraft(emptyDraft());
    setEditingGarmentId(null);
  }, []);

  const loadFrom = useCallback((ids: string[], garmentId: string | null) => {
    setDraft(ids.reduce((acc, id) => withSymbol(acc, id), emptyDraft()));
    setEditingGarmentId(garmentId);
  }, []);

  const ids = useMemo(() => orderedIds(draft), [draft]);

  return {
    draft,
    ids,
    count: symbolCount(draft),
    setCount: setCategoryCount(draft),
    empty: isDraftEmpty(draft),
    editingGarmentId,
    addSymbol,
    removeSubslot,
    clear,
    loadFrom,
  };
}

export type { CategoryId, LabelDraft };
