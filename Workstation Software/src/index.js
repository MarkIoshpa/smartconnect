import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TreeArduino from './components/tree';
import Statistics from './components/statistics';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(<Statistics />, document.getElementById('root'));


serviceWorker.unregister();
