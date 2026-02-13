export const theme = {
  colors: {
    light: {
      background: '#FFFFFF',
      foreground: '#1A1A1A',
      card: '#F5F5F5',
      primary: '#000000',
      secondary: '#666666',
      accent: '#2A2A2A',
      border: '#E0E0E0',
      text: '#1A1A1A',
      textSecondary: '#666666',
      error: '#FF3B30',
      success: '#34C759',
    },
    dark: {
      background: '#000000',
      foreground: '#FFFFFF',
      card: '#1A1A1A',
      primary: '#FFFFFF',
      secondary: '#A1A1A1',
      accent: '#D1D1D1',
      border: '#333333',
      text: '#FFFFFF',
      textSecondary: '#A1A1A1',
      error: '#FF453A',
      success: '#32D74B',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  typography: {
    fontFamily: 'Roboto', // Will need to load this or use default sans-serif
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      huge: 32,
    },
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
};

export type ThemeType = typeof theme;
