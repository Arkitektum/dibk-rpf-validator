import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
//import 'ol/ol.css';
import App from './App';

window.onbeforeunload = () => {
   window.scrollTo(0, 0);
};

ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById('root')
);

