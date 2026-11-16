import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Splash duration. Fixed at 8000ms by the factory contract — do not shorten. */
export const LOADER_DURATION_MS = 8000;

/** Splash progress bar ticks. */
export const LOADER_TICK_MS = 80;

/** Safe top padding below the status bar. */
export const TOP_INSET = 44;

/** Header content row height. */
export const HEADER_ROW_H = 72;

/** Bottom navigation height (content + safe bottom inset). */
export const NAV_H = 68;

/** Minimum touch target. */
export const TOUCH_MIN = 48;

/** Primary action height. */
export const ACTION_H = 56;

/** Horizontal screen margin. */
export const GUTTER = 16;

/**
 * Bounded board geometry (codegen rule 4/5).
 * Parent padding + border are subtracted BEFORE the cell width is computed,
 * so a grid can never overflow its frame.
 */
export const BOARD_PAD = 8;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 9
export const BOARD_MAX_W = Math.min(SCREEN_W - 2 * GUTTER, 380);
export const GRID_GAP = 12;

export function cellWidth(cols: number, gap: number = GRID_GAP): number {
  const inner = BOARD_MAX_W - 2 * BOARD_FRAME - (cols - 1) * gap;
  return Math.floor(inner / cols);
}

export function boardWidth(cols: number, gap: number = GRID_GAP): number {
  return cellWidth(cols, gap) * cols + (cols - 1) * gap + 2 * BOARD_FRAME;
}

/** Two-column grids used by categories, the symbol browser and the picker sheet. */
export const GRID_COLS = 2;
export const CELL_W = cellWidth(GRID_COLS);
export const BOARD_W = boardWidth(GRID_COLS);

/** Two grid columns plus their gap: every full-width block lines up with the grid. */
export const SPAN_W = CELL_W * GRID_COLS + GRID_GAP;

/**
 * Label preview strip: five cells with a 4dp gap inside the preview card.
 * The card's own padding and border are subtracted first, so the strip can
 * never push past the rounded corner even at 320dp width.
 */
export const LABEL_CELLS = 5;
export const LABEL_GAP = 4;
export const LABEL_CARD_PAD = 6;
export const LABEL_INNER_W = SPAN_W - 2 * LABEL_CARD_PAD - 2 * BOARD_BORDER;
export const LABEL_CELL_W = Math.floor(
  (LABEL_INNER_W - (LABEL_CELLS - 1) * LABEL_GAP) / LABEL_CELLS,
);

/** Card heights. */
export const SYMBOL_CARD_H = 148;
export const CATEGORY_TILE_H = 128;

/** Animation timings (ms). */
export const FADE_MS = 180;
export const STAGGER_MS = 20;
export const STAGGER_CAP_MS = 200;
export const SAVE_CHECK_MS = 240;
export const SAVED_TOAST_MS = 2000;

/** Garment name / notes limits. */
export const NAME_MAX = 40;
export const NOTES_MAX = 240;

/** Reference content provenance shown on the Settings screen. */
export const CONTENT_VERIFIED_ON = '2026-11-13';
export const APP_VERSION = '1.0';
