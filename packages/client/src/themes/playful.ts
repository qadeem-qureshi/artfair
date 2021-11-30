import { createTheme, responsiveFontSizes } from '@material-ui/core';
import { Shadows } from '@material-ui/core/styles/shadows';

const playful = responsiveFontSizes(
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
        root: {
          outline: '0.2rem solid #eeeeee',
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
        },
        containedSecondary: {
          boxShadow: '0 0.3rem #2e7d32',
          '&:hover': {
            boxShadow: '0 0.2rem #1b5e20',
          },
          '&:focus': {
            boxShadow: '0 0.2rem #2e7d32',
          },
        },
      },
    },
  }),
);

export default playful;
