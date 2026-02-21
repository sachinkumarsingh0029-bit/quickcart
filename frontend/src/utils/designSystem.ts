// Design System Utilities for QuickCart
// Bold & Vibrant Design System

export const colors = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#8B5CF6',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9f1239',
    900: '#831843',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

// Gradient utilities
export const gradients = {
  primary: 'bg-gradient-to-r from-primary-600 to-pink-500',
  secondary: 'bg-gradient-to-r from-secondary-500 to-primary-600',
  accent: 'bg-gradient-to-r from-accent-500 to-pink-500',
  vibrant: 'bg-gradient-to-r from-primary-600 via-pink-500 to-accent-500',
  dark: 'bg-gradient-to-br from-slate-800 to-slate-900',
};

// Common style classes
export const styles = {
  // Button styles
  btnPrimary: 'bg-gradient-primary text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300',
  btnSecondary: 'bg-gradient-secondary text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300',
  btnAccent: 'bg-gradient-accent text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300',
  
  // Card styles with glassmorphism
  card: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20',
  cardHover: 'hover:shadow-2xl hover:scale-105 transition-all duration-300',
  
  // Gradient text
  textGradient: 'bg-gradient-primary bg-clip-text text-transparent',
  textGradientVibrant: 'bg-gradient-vibrant bg-clip-text text-transparent',
  
  // Input styles
  input: 'w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300',
  
  // Container styles
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 md:py-16 lg:py-20',
};

// Animation utilities
export const animations = {
  gradient: 'animate-gradient',
  pulse: 'animate-pulse-slow',
  bounce: 'animate-bounce-slow',
};
