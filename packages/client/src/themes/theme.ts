import { createTheme, responsiveFontSizes } from '@material-ui/core';
import { Shadows } from '@material-ui/core/styles/shadows';

const THEME = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#1e88e5',
      },
      secondary: {
        main: '#43a047',
      },
      error: {
        main: '#e53935',
      },
      divider: '#eeeeee',
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Varela Round',
      button: {
        fontWeight: 'bold',
      },
    },
    shadows: Array(25).fill('none') as Shadows,
    overrides: {
      MuiPaper: {
        elevation1: {
          boxShadow: '0 0 0 0.2rem #eeeeee',
          // Hack to fix overflow not hiding with border radius on certain browsers
          transform: 'translateZ(0)',
        },
      },
      MuiMenu: {
        paper: {
          boxShadow: '0 0 0 0.2rem #eeeeee',
          // Hack to fix overflow not hiding with border radius on certain browsers
          transform: 'translateZ(0)',
        },
      },
      MuiPopover: {
        paper: {
          boxShadow: '0 0 0 0.2rem #eeeeee',
          // Hack to fix overflow not hiding with border radius on certain browsers
          transform: 'translateZ(0)',
        },
      },
      MuiButton: {
        containedPrimary: {
          boxShadow: '0 0.3rem #1565c0',
          '&:hover': {
            boxShadow: '0 0.2rem #0d47a1',
          },
          '&:focus': {
            boxShadow: '0 0.2rem #1565c0',
          },
          '&:disabled': {
            boxShadow: 'none',
          },
        },
        containedSecondary: {
          boxShadow: '0 0.3rem #2e7d32',
          '&:hover': {
            boxShadow: '0 0.2rem #1b5e20',
          },
          '&:focus': {
            boxShadow: '0 0.2rem #2e7d32',
          },
          '&:disabled': {
            boxShadow: 'none',
          },
        },
      },
    },
  }),
);

export default THEME;
