/**
 * Visual theme — OCEAN_FRESH preset with the brief's cotton-green / magenta overrides.
 * The `name` field stays exactly as in the preset file (design-system contract).
 */

export const theme = {
  name: 'ocean-fresh',

  colors: {
    bg: {
      primary: '#EFF6ED',
      secondary: '#E8F4F8',
      tertiary: '#B0DDBD',
      accent: '#9DCEDB',
    },
    brand: {
      green: '#43AB2A',
      greenSoft: '#B0DDBD',
      magenta: '#E028AB',
      magentaSoft: '#F7C2E6',
      deep: '#00558B',
      ink: '#1A2418',
      cotton: '#FFFFFF',
    },
    text: {
      primary: '#1A2418',
      secondary: '#1A2418CC',
      muted: '#1A2418B3',
      onDark: '#FFFFFF',
      onDarkSoft: '#EFF6ED',
      accent: '#E028AB',
      green: '#2E7A1C',
    },
    ui: {
      border: '#43AB2A26',
      borderStrong: '#43AB2A55',
      divider: '#B0DDBD',
      surface: '#FFFFFF',
      surfaceSoft: '#FFFFFFCC',
      header: '#FFFFFFE6',
      inset: '#B0DDBD59',
      scrim: 'rgba(26, 36, 24, 0.55)',
    },
  },

  gradients: {
    loader: ['#1A2418', '#00558B', '#43AB2A'] as string[],
    loaderScrim: ['rgba(26,36,24,0.94)', 'rgba(0,85,139,0.90)', 'rgba(67,171,42,0.88)'] as string[],
    menu: ['rgba(239,246,237,0.95)', 'rgba(232,244,248,0.93)'] as string[],
    browser: ['rgba(232,244,248,0.94)', 'rgba(239,246,237,0.95)'] as string[],
    detail: ['rgba(239,246,237,0.95)', 'rgba(255,255,255,0.96)'] as string[],
    builder: ['rgba(239,246,237,0.94)', 'rgba(176,221,189,0.92)'] as string[],
    result: ['rgba(232,244,248,0.94)', 'rgba(176,221,189,0.93)'] as string[],
    favorites: ['rgba(239,246,237,0.95)', 'rgba(232,244,248,0.94)'] as string[],
    tips: ['rgba(232,244,248,0.95)', 'rgba(239,246,237,0.94)'] as string[],
    settings: ['rgba(239,246,237,0.95)', 'rgba(255,255,255,0.96)'] as string[],
    action: ['#E028AB', '#B81E89'] as string[],
    green: ['#43AB2A', '#B0DDBD'] as string[],
    progress: ['#43AB2A', '#E028AB'] as string[],
    header: ['rgba(255,255,255,0.94)', 'rgba(255,255,255,0.86)'] as string[],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '800' as const, lineHeight: 46, letterSpacing: -0.5 },
    screenTitle: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
    headerTitle: { fontSize: 22, fontWeight: '800' as const, lineHeight: 28 },
    section: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
    cardTitle: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
    action: { fontSize: 17, fontWeight: '700' as const, lineHeight: 24, letterSpacing: 0.6 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    emphasis: { fontSize: 17, fontWeight: '500' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
    micro: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.8 },
  },

  radius: { sm: 8, md: 14, card: 16, lg: 18, xl: 22, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, huge: 32 },

  shadows: {
    card: {
      shadowColor: '#1A2418',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 12,
      elevation: 2,
    },
    action: {
      shadowColor: '#E028AB',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 10,
      elevation: 3,
    },
    header: {
      shadowColor: '#1A2418',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
  },

  animation: {
    fast: 150,
    base: 180,
    slow: 240,
    press: { tension: 180, friction: 18 },
  },
};

export type Theme = typeof theme;
