import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {MainRouter} from './routes';
import {history} from './utils/history';
import './style.css';

ReactDOM.render(
    <React.StrictMode>
      <Router history={history}>
        <MainRouter/>
      </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);
