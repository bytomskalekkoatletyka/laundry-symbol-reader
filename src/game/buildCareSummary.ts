/**
 * Deterministic care instruction. Every row is generated from the selected
 * catalog IDs only — nothing is inferred from a garment name, a fabric or a
 * partially entered label, and an omitted category is shown as unspecified
 * rather than as a permission.
 */

import { CATEGORIES, CategoryId, SYMBOL_BY_ID } from './catalog';
import { LabelDraft, orderedIds, selectedIn, setCategoryCount } from './labelRules';

export const UNSPECIFIED = 'Not specified on this label';

export type CareRow = {
  category: CategoryId;
  heading: string;
  instruction: string;
  symbolIds: string[];
  unspecified: boolean;
};

export type CareSummary = {
  symbolIds: string[];
  rows: CareRow[];
  setCount: number;
  conventionNote: string | null;
};

export function buildCareSummary(draft: LabelDraft): CareSummary {
  const rows: CareRow[] = CATEGORIES.map(category => {
    const ids = selectedIn(draft, category.id);
    const sentences = ids
      .map(id => SYMBOL_BY_ID[id])
      .filter(Boolean)
      .map(s => s.meaning);

    return {
      category: category.id,
      heading: category.label,
      instruction: sentences.length > 0 ? sentences.join(' ') : UNSPECIFIED,
      symbolIds: ids,
      unspecified: sentences.length === 0,
    };
  });

  const ironId = draft.iron;
  const ironSymbol = ironId ? SYMBOL_BY_ID[ironId] : undefined;

  return {
    symbolIds: orderedIds(draft),
    rows,
    setCount: setCategoryCount(draft),
    conventionNote: ironSymbol && ironSymbol.conventionNote ? ironSymbol.conventionNote : null,
  };
}

/** One-line preview used by saved garment cards and the favorites list. */
export function previewLine(summary: CareSummary): string {
  const spoken = summary.rows.filter(r => !r.unspecified).map(r => r.instruction);
  if (spoken.length === 0) {
    return 'No symbols entered yet';
  }
  return spoken.join(' ');
}
