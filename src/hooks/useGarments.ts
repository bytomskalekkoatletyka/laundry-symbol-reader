import { useCallback, useRef, useState } from 'react';

/**
 * Saved garments. The collection lives in a single owner above the screens and
 * is handed down as plain values, so no screen re-renders on an unrelated slot
 * change. Writes are serialised through a ref so a double tap on Save cannot
 * produce two records.
 */

export type Garment = {
  id: string;
  name: string;
  notes: string;
  symbolIds: string[];
  createdAt: number;
  updatedAt: number;
};

export type GarmentsApi = {
  garments: Garment[];
  saving: boolean;
  lastSavedId: string | null;
  save: (input: {
    id: string | null;
    name: string;
    notes: string;
    symbolIds: string[];
  }) => Garment | null;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  restore: (garment: Garment) => void;
  byId: (id: string) => Garment | undefined;
};

let sequence = 0;
function nextId(): string {
  sequence += 1;
  return 'g' + Date.now().toString(36) + '-' + sequence.toString(36);
}

function sortGarments(list: Garment[]): Garment[] {
  return list.slice().sort((a, b) => {
    if (b.updatedAt !== a.updatedAt) {
      return b.updatedAt - a.updatedAt;
    }
    return a.name.localeCompare(b.name);
  });
}

export function useGarments(): GarmentsApi {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const writing = useRef(false);

  const save = useCallback<GarmentsApi['save']>(input => {
    if (writing.current) {
      return null;
    }
    const name = input.name.trim();
    if (name.length === 0) {
      return null;
    }

    writing.current = true;
    setSaving(true);

    const now = Date.now();
    let saved: Garment | null = null;

    setGarments(current => {
      const existing = input.id ? current.find(g => g.id === input.id) : undefined;
      if (existing) {
        saved = {
          ...existing,
          name,
          notes: input.notes.trim(),
          symbolIds: input.symbolIds,
          updatedAt: now,
        };
        const next = current.map(g => (g.id === existing.id ? (saved as Garment) : g));
        return sortGarments(next);
      }
      saved = {
        id: nextId(),
        name,
        notes: input.notes.trim(),
        symbolIds: input.symbolIds,
        createdAt: now,
        updatedAt: now,
      };
      return sortGarments(current.concat(saved));
    });

    writing.current = false;
    setSaving(false);
    setLastSavedId(saved ? (saved as Garment).id : null);
    return saved;
  }, []);

  const rename = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return;
    }
    setGarments(current =>
      sortGarments(
        current.map(g => (g.id === id ? { ...g, name: trimmed, updatedAt: Date.now() } : g)),
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setGarments(current => current.filter(g => g.id !== id));
  }, []);

  const restore = useCallback((garment: Garment) => {
    setGarments(current =>
      current.some(g => g.id === garment.id) ? current : sortGarments(current.concat(garment)),
    );
  }, []);

  const byId = useCallback(
    (id: string) => garments.find(g => g.id === id),
    [garments],
  );

  return { garments, saving, lastSavedId, save, rename, remove, restore, byId };
}
