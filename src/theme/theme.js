import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#004A8C', // AEG Blue
    secondary: '#FF8200', // Accent Orange/Gold
    tertiary: '#002B54', // Darker Blue
    surface: '#FFFFFF',
    background: '#F5F7FA', // Soft Light Background
    onSurface: '#1A1C1E',
    outline: '#C4C7CC',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F2F4F7',
      level3: '#E8EBF0',
      level4: '#DEE2E9',
      level5: '#D4DAE2',
    },
  },
  roundness: 12, // More professional/modern look
};
