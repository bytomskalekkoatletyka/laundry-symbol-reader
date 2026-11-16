/**
 * Bundled care-symbol reference — a closed 41-record catalog in stable order.
 * Meanings follow the current GINETEX care-symbol reference; see sourceKey.
 * IDs are immutable: garments persist IDs, never translated copy.
 */

export type CategoryId = 'wash' | 'bleach' | 'dry' | 'iron' | 'clean';

export type SubSlot =
  | 'wash'
  | 'bleach'
  | 'tumble'
  | 'natural'
  | 'iron'
  | 'professionalDry'
  | 'professionalWet';

export type GlyphSpec = {
  base: 'tub' | 'triangle' | 'tumble' | 'natural' | 'iron' | 'circle';
  text?: string;
  dots?: number;
  bars?: number;
  hand?: boolean;
  stripes?: boolean;
  lines?: 'line' | 'drip' | 'flat' | 'dripFlat';
  shade?: boolean;
  noSteam?: boolean;
  crossed?: boolean;
};

export type CareSymbol = {
  id: string;
  category: CategoryId;
  subslot: SubSlot;
  glyph: GlyphSpec;
  title: string;
  meaning: string;
  descriptor: string;
  aliases: string[];
  tips: [string, string];
  modifierNote?: string;
  conventionNote?: string;
  sourceKey: string;
};

export type Category = {
  id: CategoryId;
  label: string;
  browserTitle: string;
  blurb: string;
  glyph: GlyphSpec;
};

const GINETEX = 'ginetex_care_symbols';

export const CATEGORIES: Category[] = [
  {
    id: 'wash',
    label: 'Wash',
    browserTitle: 'Wash symbols',
    blurb: 'Tub, temperature, cycle',
    glyph: { base: 'tub' },
  },
  {
    id: 'bleach',
    label: 'Bleach',
    browserTitle: 'Bleach symbols',
    blurb: 'Triangle and its limits',
    glyph: { base: 'triangle' },
  },
  {
    id: 'dry',
    label: 'Dry',
    browserTitle: 'Dry symbols',
    blurb: 'Tumble and natural drying',
    glyph: { base: 'tumble', dots: 2 },
  },
  {
    id: 'iron',
    label: 'Iron',
    browserTitle: 'Iron symbols',
    blurb: 'Heat settings and steam',
    glyph: { base: 'iron', dots: 2 },
  },
  {
    id: 'clean',
    label: 'Clean',
    browserTitle: 'Professional care',
    blurb: 'Professional care',
    glyph: { base: 'circle', text: 'P' },
  },
];

const washTips: [string, string] = [
  'Choose the matching cycle',
  'Keep within the label temperature',
];
const mildTips: [string, string] = [
  'Reduce the mechanical action',
  'Keep within the label temperature',
];
const handTips: [string, string] = ['Move the garment gently', 'Avoid twisting it'];
const bleachTips: [string, string] = [
  'Check the detergent ingredients',
  'Match the bleach to the label',
];
const dryTips: [string, string] = [
  'Choose the shown drying method',
  'Keep shade-marked items out of direct sun',
];
const lowIronTips: [string, string] = [
  'Start with a low setting',
  'Check the written temperature',
];
const proTips: [string, string] = ['Show the original label', 'Use a professional service'];

function tub(temp: number, bars: number): CareSymbol {
  const suffix = bars === 0 ? 'normal' : bars === 1 ? 'mild' : 'very_mild';
  const kind = bars === 0 ? '' : bars === 1 ? ', mild' : ', very mild';
  const cycle = bars === 0 ? 'a normal cycle' : bars === 1 ? 'a mild cycle' : 'a very mild cycle';
  return {
    id: 'wash_' + temp + '_' + suffix,
    category: 'wash',
    subslot: 'wash',
    glyph: { base: 'tub', text: String(temp), bars },
    title: 'Wash at ' + temp + '°C' + kind,
    meaning: 'Use ' + cycle + ' at ' + temp + '°C or cooler.',
    descriptor: 'max ' + temp + '°C',
    aliases: ['wash', 'tub', 'machine', 'wash ' + temp, String(temp)],
    tips: bars === 0 ? washTips : mildTips,
    modifierNote:
      bars === 1
        ? 'One line means a mild process.'
        : bars === 2
        ? 'Two lines mean a very mild process.'
        : undefined,
    sourceKey: GINETEX,
  };
}

export const SYMBOLS: CareSymbol[] = [
  // ---------------------------------------------------------------- Wash (13)
  tub(30, 0),
  tub(40, 0),
  tub(60, 0),
  tub(70, 0),
  tub(95, 0),
  tub(30, 1),
  tub(40, 1),
  tub(60, 1),
  tub(30, 2),
  tub(40, 2),
  {
    id: 'hand_40',
    category: 'wash',
    subslot: 'wash',
    glyph: { base: 'tub', hand: true, text: '40' },
    title: 'Hand wash to 40°C',
    meaning: 'Wash by hand at 40°C or cooler.',
    descriptor: 'by hand, max 40°C',
    aliases: ['hand', 'hand wash', 'manual', 'wash 40'],
    tips: handTips,
    sourceKey: GINETEX,
  },
  {
    id: 'hand_ambient',
    category: 'wash',
    subslot: 'wash',
    glyph: { base: 'tub', hand: true },
    title: 'Hand wash',
    meaning: 'Wash by hand at roughly 20 to 30°C.',
    descriptor: 'by hand, 20-30°C',
    aliases: ['hand', 'hand wash', 'lukewarm'],
    tips: handTips,
    sourceKey: GINETEX,
  },
  {
    id: 'wash_none',
    category: 'wash',
    subslot: 'wash',
    glyph: { base: 'tub', crossed: true },
    title: 'Do not wash',
    meaning: 'This garment must not be washed at home.',
    descriptor: 'not washable',
    aliases: ['no wash', 'do not wash', 'crossed tub'],
    tips: ['Do not wash this garment at home', 'Follow the rest of the label'],
    sourceKey: GINETEX,
  },

  // -------------------------------------------------------------- Bleach (3)
  {
    id: 'bleach_any',
    category: 'bleach',
    subslot: 'bleach',
    glyph: { base: 'triangle' },
    title: 'Any bleach allowed',
    meaning: 'Chlorine and oxygen bleach may both be used.',
    descriptor: 'chlorine or oxygen',
    aliases: ['bleach', 'triangle', 'chlorine'],
    tips: bleachTips,
    sourceKey: GINETEX,
  },
  {
    id: 'bleach_oxygen',
    category: 'bleach',
    subslot: 'bleach',
    glyph: { base: 'triangle', stripes: true },
    title: 'Oxygen bleach only',
    meaning: 'Use oxygen bleach only, never chlorine bleach.',
    descriptor: 'oxygen only',
    aliases: ['oxygen', 'non chlorine', 'stripes', 'bleach'],
    tips: bleachTips,
    modifierNote: 'Diagonal stripes limit bleaching to oxygen products.',
    sourceKey: GINETEX,
  },
  {
    id: 'bleach_none',
    category: 'bleach',
    subslot: 'bleach',
    glyph: { base: 'triangle', crossed: true },
    title: 'Do not bleach',
    meaning: 'No bleaching agent may be used.',
    descriptor: 'no bleach',
    aliases: ['no bleach', 'crossed triangle'],
    tips: ['Do not use any bleach on this garment', 'Follow the rest of the label'],
    sourceKey: GINETEX,
  },

  // ----------------------------------------------------------------- Dry (11)
  {
    id: 'tumble_low',
    category: 'dry',
    subslot: 'tumble',
    glyph: { base: 'tumble', dots: 1 },
    title: 'Tumble dry, low heat',
    meaning: 'Tumble drying is allowed at a reduced temperature.',
    descriptor: 'low heat',
    aliases: ['tumble', 'dryer', 'low', 'one dot'],
    tips: dryTips,
    modifierNote: 'One dot means a lower dryer temperature.',
    sourceKey: GINETEX,
  },
  {
    id: 'tumble_normal',
    category: 'dry',
    subslot: 'tumble',
    glyph: { base: 'tumble', dots: 2 },
    title: 'Tumble dry, normal heat',
    meaning: 'Tumble drying is allowed at a normal temperature.',
    descriptor: 'normal heat',
    aliases: ['tumble', 'dryer', 'normal', 'two dots'],
    tips: dryTips,
    sourceKey: GINETEX,
  },
  {
    id: 'tumble_none',
    category: 'dry',
    subslot: 'tumble',
    glyph: { base: 'tumble', crossed: true },
    title: 'Do not tumble dry',
    meaning: 'This garment must not go in a tumble dryer.',
    descriptor: 'no dryer',
    aliases: ['no tumble', 'crossed dryer'],
    tips: ['Do not tumble dry this garment', 'Follow the shown natural drying method'],
    sourceKey: GINETEX,
  },
  {
    id: 'line',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'line' },
    title: 'Line dry',
    meaning: 'Hang the garment to dry.',
    descriptor: 'hang to dry',
    aliases: ['line', 'hang', 'natural'],
    tips: dryTips,
    sourceKey: GINETEX,
  },
  {
    id: 'line_shade',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'line', shade: true },
    title: 'Line dry in shade',
    meaning: 'Hang the garment to dry out of direct sunlight.',
    descriptor: 'hang, in shade',
    aliases: ['line', 'shade', 'hang'],
    tips: dryTips,
    modifierNote: 'A corner diagonal means dry in shade.',
    sourceKey: GINETEX,
  },
  {
    id: 'drip_line',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'drip' },
    title: 'Drip dry',
    meaning: 'Hang the garment wet and let it drip.',
    descriptor: 'hang while wet',
    aliases: ['drip', 'wet', 'hang'],
    tips: dryTips,
    sourceKey: GINETEX,
  },
  {
    id: 'drip_line_shade',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'drip', shade: true },
    title: 'Drip dry in shade',
    meaning: 'Hang the garment wet, out of direct sunlight.',
    descriptor: 'hang wet, in shade',
    aliases: ['drip', 'shade', 'wet'],
    tips: dryTips,
    modifierNote: 'A corner diagonal means dry in shade.',
    sourceKey: GINETEX,
  },
  {
    id: 'flat',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'flat' },
    title: 'Dry flat',
    meaning: 'Lay the garment flat to dry.',
    descriptor: 'lay flat',
    aliases: ['flat', 'lay', 'natural'],
    tips: dryTips,
    sourceKey: GINETEX,
  },
  {
    id: 'flat_shade',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'flat', shade: true },
    title: 'Dry flat in shade',
    meaning: 'Lay the garment flat, out of direct sunlight.',
    descriptor: 'lay flat, in shade',
    aliases: ['flat', 'shade', 'lay'],
    tips: dryTips,
    modifierNote: 'A corner diagonal means dry in shade.',
    sourceKey: GINETEX,
  },
  {
    id: 'drip_flat',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'dripFlat' },
    title: 'Dry flat while wet',
    meaning: 'Lay the garment flat without wringing it first.',
    descriptor: 'lay flat, wet',
    aliases: ['drip flat', 'wet', 'lay'],
    tips: dryTips,
    sourceKey: GINETEX,
  },
  {
    id: 'drip_flat_shade',
    category: 'dry',
    subslot: 'natural',
    glyph: { base: 'natural', lines: 'dripFlat', shade: true },
    title: 'Dry flat while wet, in shade',
    meaning: 'Lay the garment flat while wet, out of direct sunlight.',
    descriptor: 'lay flat wet, in shade',
    aliases: ['drip flat', 'shade', 'wet'],
    tips: dryTips,
    modifierNote: 'A corner diagonal means dry in shade.',
    sourceKey: GINETEX,
  },

  // ---------------------------------------------------------------- Iron (5)
  {
    id: 'iron_low',
    category: 'iron',
    subslot: 'iron',
    glyph: { base: 'iron', dots: 1 },
    title: 'Iron, low heat',
    meaning: 'Iron at the lowest setting.',
    descriptor: 'low heat',
    aliases: ['iron', 'low', 'one dot'],
    tips: lowIronTips,
    conventionNote:
      'Current ISO 3758:2023 gives a 120°C maximum. Older charts show 110°C.',
    sourceKey: GINETEX,
  },
  {
    id: 'iron_low_no_steam',
    category: 'iron',
    subslot: 'iron',
    glyph: { base: 'iron', dots: 1, noSteam: true },
    title: 'Iron, low heat, no steam',
    meaning: 'Iron at the lowest setting with the steam switched off.',
    descriptor: 'low heat, dry',
    aliases: ['iron', 'no steam', 'dry iron', 'low'],
    tips: lowIronTips,
    modifierNote: 'The crossed steam marks mean no steam.',
    conventionNote:
      'Current ISO 3758:2023 gives a 120°C maximum. Older charts show 110°C.',
    sourceKey: GINETEX,
  },
  {
    id: 'iron_medium',
    category: 'iron',
    subslot: 'iron',
    glyph: { base: 'iron', dots: 2 },
    title: 'Iron, medium heat',
    meaning: 'Iron at a medium setting.',
    descriptor: 'medium heat',
    aliases: ['iron', 'medium', 'two dots'],
    tips: lowIronTips,
    conventionNote:
      'Current ISO 3758:2023 gives a 160°C maximum. Older charts show 150°C.',
    sourceKey: GINETEX,
  },
  {
    id: 'iron_high',
    category: 'iron',
    subslot: 'iron',
    glyph: { base: 'iron', dots: 3 },
    title: 'Iron, high heat',
    meaning: 'Iron at a high setting.',
    descriptor: 'high heat',
    aliases: ['iron', 'high', 'three dots', 'cotton'],
    tips: lowIronTips,
    conventionNote:
      'Current ISO 3758:2023 gives a 210°C maximum. Older charts show 200°C.',
    sourceKey: GINETEX,
  },
  {
    id: 'iron_none',
    category: 'iron',
    subslot: 'iron',
    glyph: { base: 'iron', crossed: true },
    title: 'Do not iron',
    meaning: 'This garment must not be ironed.',
    descriptor: 'no ironing',
    aliases: ['no iron', 'crossed iron'],
    tips: ['Do not iron this garment', 'Follow the rest of the label'],
    sourceKey: GINETEX,
  },

  // --------------------------------------------------------------- Clean (9)
  {
    id: 'dry_p_normal',
    category: 'clean',
    subslot: 'professionalDry',
    glyph: { base: 'circle', text: 'P' },
    title: 'Dry clean, P process',
    meaning: 'Professional dry cleaning with the P solvent process.',
    descriptor: 'P, normal',
    aliases: ['dry clean', 'p', 'professional'],
    tips: proTips,
    sourceKey: GINETEX,
  },
  {
    id: 'dry_p_mild',
    category: 'clean',
    subslot: 'professionalDry',
    glyph: { base: 'circle', text: 'P', bars: 1 },
    title: 'Dry clean, P process, mild',
    meaning: 'Professional dry cleaning with the P process and gentle handling.',
    descriptor: 'P, mild',
    aliases: ['dry clean', 'p', 'mild', 'gentle'],
    tips: proTips,
    modifierNote: 'One line means a mild process.',
    sourceKey: GINETEX,
  },
  {
    id: 'dry_f_normal',
    category: 'clean',
    subslot: 'professionalDry',
    glyph: { base: 'circle', text: 'F' },
    title: 'Dry clean, F process',
    meaning: 'Professional dry cleaning with the F solvent process.',
    descriptor: 'F, normal',
    aliases: ['dry clean', 'f', 'professional'],
    tips: proTips,
    sourceKey: GINETEX,
  },
  {
    id: 'dry_f_mild',
    category: 'clean',
    subslot: 'professionalDry',
    glyph: { base: 'circle', text: 'F', bars: 1 },
    title: 'Dry clean, F process, mild',
    meaning: 'Professional dry cleaning with the F process and gentle handling.',
    descriptor: 'F, mild',
    aliases: ['dry clean', 'f', 'mild', 'gentle'],
    tips: proTips,
    modifierNote: 'One line means a mild process.',
    sourceKey: GINETEX,
  },
  {
    id: 'dry_none',
    category: 'clean',
    subslot: 'professionalDry',
    glyph: { base: 'circle', crossed: true },
    title: 'Do not dry clean',
    meaning: 'Professional dry cleaning is not allowed.',
    descriptor: 'no dry cleaning',
    aliases: ['no dry clean', 'crossed circle'],
    tips: ['Do not have this garment dry cleaned', 'Follow the rest of the label'],
    modifierNote: 'This mark forbids dry cleaning only, not professional wet cleaning.',
    sourceKey: GINETEX,
  },
  {
    id: 'wet_w_normal',
    category: 'clean',
    subslot: 'professionalWet',
    glyph: { base: 'circle', text: 'W' },
    title: 'Professional wet clean',
    meaning: 'Professional wet cleaning with a normal process.',
    descriptor: 'W, normal',
    aliases: ['wet clean', 'w', 'professional'],
    tips: proTips,
    sourceKey: GINETEX,
  },
  {
    id: 'wet_w_mild',
    category: 'clean',
    subslot: 'professionalWet',
    glyph: { base: 'circle', text: 'W', bars: 1 },
    title: 'Professional wet clean, mild',
    meaning: 'Professional wet cleaning with a mild process.',
    descriptor: 'W, mild',
    aliases: ['wet clean', 'w', 'mild'],
    tips: proTips,
    modifierNote: 'One line means a mild process.',
    sourceKey: GINETEX,
  },
  {
    id: 'wet_w_very_mild',
    category: 'clean',
    subslot: 'professionalWet',
    glyph: { base: 'circle', text: 'W', bars: 2 },
    title: 'Professional wet clean, very mild',
    meaning: 'Professional wet cleaning with a very mild process.',
    descriptor: 'W, very mild',
    aliases: ['wet clean', 'w', 'very mild', 'gentle'],
    tips: proTips,
    modifierNote: 'Two lines mean a very mild process.',
    sourceKey: GINETEX,
  },
  {
    id: 'wet_none',
    category: 'clean',
    subslot: 'professionalWet',
    glyph: { base: 'circle', text: 'W', crossed: true },
    title: 'Do not wet clean',
    meaning: 'Professional wet cleaning is not allowed.',
    descriptor: 'no wet cleaning',
    aliases: ['no wet clean', 'crossed w'],
    tips: ['Do not have this garment wet cleaned', 'Follow the rest of the label'],
    modifierNote: 'This mark forbids professional wet cleaning only.',
    sourceKey: GINETEX,
  },
];

export const SYMBOL_BY_ID: Record<string, CareSymbol> = SYMBOLS.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<string, CareSymbol>);

export const SYMBOLS_BY_CATEGORY: Record<CategoryId, CareSymbol[]> = {
  wash: SYMBOLS.filter(s => s.category === 'wash'),
  bleach: SYMBOLS.filter(s => s.category === 'bleach'),
  dry: SYMBOLS.filter(s => s.category === 'dry'),
  iron: SYMBOLS.filter(s => s.category === 'iron'),
  clean: SYMBOLS.filter(s => s.category === 'clean'),
};

export const CATEGORY_BY_ID: Record<CategoryId, Category> = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {} as Record<CategoryId, Category>);

export const TOTAL_SYMBOLS = SYMBOLS.length;
export const TOTAL_CATEGORIES = CATEGORIES.length;

/** Local, case- and diacritic-insensitive normalisation used by every search field. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function searchSymbols(list: CareSymbol[], query: string): CareSymbol[] {
  const q = normalize(query);
  if (q.length === 0) {
    return list;
  }
  return list.filter(s => {
    const haystack = normalize(
      s.title + ' ' + s.descriptor + ' ' + s.meaning + ' ' + s.aliases.join(' '),
    );
    return haystack.indexOf(q) >= 0;
  });
}
