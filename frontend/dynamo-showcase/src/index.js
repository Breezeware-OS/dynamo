import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import {AmplifyProvider, Authenticator} from '@aws-amplify/ui-react';

import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AmplifyProvider>
    <Authenticator.Provider>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </Authenticator.Provider>
  </AmplifyProvider>,
);

// if (process.env.REACT_APP_ENVIRONMENT === 'production') {
//   console.log = function () {};
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// function sendToAnalytics({id, name, value}) {
//   ga('send', 'event', {
//     eventCategory: 'Web Vitals',
//     eventAction: name,
//     eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
//     eventLabel: id, // id unique to current page load
//     nonInteraction: true, // avoids affecting bounce rate
//   });
// }

// function sendToAnalytics({name, value, id}) {
//   // Send the data to your analytics service
//   console.log({name, value, id});
// }
reportWebVitals();
