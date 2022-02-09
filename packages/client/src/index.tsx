import React from 'react';
import { render } from 'react-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import AppContextProvider from './components/AppContextProvider';
import THEME from './themes/theme';
import App from './components/App';

const rootElement = document.getElementById('root');
render(
  <ThemeProvider theme={THEME}>
    <CssBaseline />
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ThemeProvider>,
  rootElement,
);
