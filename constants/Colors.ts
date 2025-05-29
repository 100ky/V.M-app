/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const adventureColors = {
  light: {
    background: '#edf6f9', // Light Sky Blue
    text: '#1A202C',      // Darkest Gray (for primary text)
    subtleText: '#4A5568', // Medium Gray (for less important text, e.g., borders)
    primary: '#546E7A',   // Blue Grey
    secondary: '#78909C', // Lighter Blue Grey
    accent: '#FF8C00',    // Dark Orange (adventurous accent)
    card: '#FFFFFF',
    border: '#CBD5E0',
  },
  dark: {
    background: '#1A202C', // Darkest Gray
    text: '#E2E8F0',      // Light Gray (for primary text)
    subtleText: '#A0AEC0', // Lighter Medium Gray (for borders)
    primary: '#78909C',   // Lighter Blue Grey (becomes primary in dark)
    secondary: '#546E7A', // Blue Grey (becomes secondary)
    accent: '#FFA500',    // Orange (adventurous accent)
    card: '#2D3748',
    border: '#4A5568',
  },
};

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
