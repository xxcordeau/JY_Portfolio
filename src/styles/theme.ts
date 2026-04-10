/**
 * Design tokens — centralized color / typography / spacing values.
 *
 * Usage:
 *   import { theme, tokens } from '../styles/theme';
 *   const Card = styled.div<{ $isDark: boolean }>`
 *     background: ${p => p.$isDark ? tokens.bg.dark : tokens.bg.light};
 *     padding: ${tokens.space(3)};
 *     border-radius: ${tokens.radius.md};
 *     font-size: ${tokens.fontSize.body};
 *   `;
 */

// ─── Base scale: one unit = 4px ──────────────────────────
const SPACE_UNIT = 4;

export const tokens = {
  // Spacing — tokens.space(4) === '16px'
  space: (n: number) => `${n * SPACE_UNIT}px`,

  // Colors
  bg: {
    light: '#ffffff',
    lightSecondary: '#f5f5f7',
    dark: '#000000',
    darkSecondary: '#1d1d1f',
    darkTertiary: '#1a1a1a',
  },
  text: {
    light: '#1d1d1f',
    lightMuted: '#86868b',
    dark: '#f5f5f7',
    darkMuted: '#86868b',
  },
  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    lightSubtle: 'rgba(0, 0, 0, 0.04)',
    dark: 'rgba(255, 255, 255, 0.08)',
    darkSubtle: 'rgba(255, 255, 255, 0.04)',
  },
  accent: {
    primary: '#0c8ce9',
    primaryHover: '#0a7bd1',
    primarySoft: 'rgba(12, 140, 233, 0.1)',
    danger: '#d4183d',
    success: '#30d158',
    warning: '#ff9f0a',
  },
  glass: {
    light: 'rgba(0, 0, 0, 0.04)',
    lightHover: 'rgba(0, 0, 0, 0.06)',
    dark: 'rgba(255, 255, 255, 0.06)',
    darkHover: 'rgba(255, 255, 255, 0.1)',
  },

  // Typography
  fontFamily: {
    body: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace",
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    body: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
    '5xl': '40px',
    '6xl': '56px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.7,
  },

  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.16)',
  },

  // Transitions
  transition: {
    fast: '0.15s ease',
    base: '0.25s ease',
    slow: '0.4s ease',
  },

  // Z-index scale
  z: {
    header: 100,
    dropdown: 500,
    modal: 9999,
    toast: 10000,
  },

  // Breakpoints
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

/**
 * Helper to get values from the current theme (light/dark) at once.
 */
export function theme(isDark: boolean) {
  return {
    bg: isDark ? tokens.bg.dark : tokens.bg.light,
    bgSecondary: isDark ? tokens.bg.darkSecondary : tokens.bg.lightSecondary,
    text: isDark ? tokens.text.dark : tokens.text.light,
    textMuted: isDark ? tokens.text.darkMuted : tokens.text.lightMuted,
    border: isDark ? tokens.border.dark : tokens.border.light,
    borderSubtle: isDark ? tokens.border.darkSubtle : tokens.border.lightSubtle,
    glass: isDark ? tokens.glass.dark : tokens.glass.light,
    glassHover: isDark ? tokens.glass.darkHover : tokens.glass.lightHover,
  };
}

export type Tokens = typeof tokens;
