import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
require('dotenv').config({ path: `${__dirname}/../../../.env`});

const rootElement = document.getElementById('root');
render(<App />, rootElement);
