import React from 'react';
import { render } from 'react-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import playful from './themes/playful';
import RoomContextProvider from './components/RoomContextProvider';
import App from './components/App';

const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
    <ThemeProvider theme={playful}>
      <CssBaseline />
      <RoomContextProvider>
        <App />
      </RoomContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
  rootElement,
);
