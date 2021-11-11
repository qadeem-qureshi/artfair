import React from 'react';
import { render } from 'react-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './components/AppContextProvider';
import App from './components/App';
import professional from './themes/professional';

const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
    <ThemeProvider theme={professional}>
      <CssBaseline />
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
  rootElement,
);
