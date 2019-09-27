import React from 'react';
import ReactDOM from 'react-dom';
import ArPermaDapp from './ArPermaDapp';
import * as serviceWorker from './serviceWorker';
import './index.css'

ReactDOM.render(<ArPermaDapp />, document.getElementById('root'));


serviceWorker.unregister();
