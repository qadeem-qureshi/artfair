import React from 'react';
import { render } from 'react-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import THEME from './themes/playful';
import RoomContextProvider from './components/RoomContextProvider';
import App from './components/App';

const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <RoomContextProvider>
        <App />
      </RoomContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
  rootElement,
);
