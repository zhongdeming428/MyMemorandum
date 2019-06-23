import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import store from '@/store/store';
import { Provider } from 'react-redux';

ReactDOM.render(<Provider store={store}>
    <App/>
</Provider>, document.getElementById('app'));