import { createTheme } from '@mui/material/styles';

/**
 * Helper to get CSS variable value
 * @param {string} varName 
 * @returns {string} val
 */
const getVar = (varName) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

// We need a function to create the theme because we might want to 
// re-calculate when the CSS variables change (e.g. theme switching).
// However, standard MUI theme usage with valid CSS variables can be tricky 
// if we want to use them in the `palette`.
// 
// For simplicity in this demo, we will map the *default* values or 
// use the `var(--name)` string directly where MUI supports it.
// MUI supports CSS vars in most places now.

const theme = createTheme({
  palette: {
    primary: {
      main: 'var(--primary-color)',
      dark: 'var(--primary-hover)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'var(--secondary-color)',
    },
    error: {
      main: 'var(--error-color)',
    },
    warning: {
      main: 'var(--warning-color)',
    },
    success: {
      main: 'var(--success-color)',
    },
    background: {
      default: 'var(--bg-color)',
      paper: 'var(--surface-color)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
  },
  typography: {
    fontFamily: 'inherit', // Use the font defined in body
    h1: { fontSize: 'var(--font-3xl)', fontWeight: 'var(--weight-bold)' },
    h2: { fontSize: 'var(--font-2xl)', fontWeight: 'var(--weight-bold)' },
    h3: { fontSize: 'var(--font-xl)', fontWeight: 'var(--weight-semibold)' },
    h4: { fontSize: 'var(--font-lg)', fontWeight: 'var(--weight-medium)' },
    h5: { fontSize: 'var(--font-md)', fontWeight: 'var(--weight-medium)' },
    h6: { fontSize: 'var(--font-sm)', fontWeight: 'var(--weight-medium)' },
    body1: { fontSize: 'var(--font-md)' },
    body2: { fontSize: 'var(--font-sm)' },
  },
  shape: {
    borderRadius: 8, // Mapping to our --radius-md roughly
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 'var(--radius-full)', // Rounded buttons are modern
          fontWeight: 'var(--weight-medium)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Soft shadow
          backgroundImage: 'none', // Reset for dark mode
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  },
});

export default theme;
