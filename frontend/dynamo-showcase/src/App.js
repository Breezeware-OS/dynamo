import './App.css';
import React, {useEffect, useState} from 'react';
// eslint-disable-next-line import/no-unresolved
import '@aws-amplify/ui-react/styles.css';
import axios from 'axios';
import ReactGA from 'react-ga4';
import {useAuthenticator} from '@aws-amplify/ui-react';
import Login from './auth/Login';
import AuthRouter from './routes/AuthRouter';
import AppRouter from './routes/AppRouter';

const TRACKING_ID = 'G-3PGC5XGPZR'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

function App() {
  const {user, signOut} = useAuthenticator();
  const [AuthDetails, setAuthDetails] = useState(user);
  // pass Access token to server in request headers.

  if (user || AuthDetails) {
    axios.interceptors.request.use(
      (axios.defaults.headers = {
        Authorization: user
          ? 'Bearer ' + user?.signInUserSession?.accessToken?.jwtToken
          : 'Bearer ' + AuthDetails?.signInUserSession?.accessToken?.jwtToken,
      }),
    );
  }

  return AuthDetails?.signInUserSession?.accessToken?.jwtToken ||
    user?.signInUserSession?.accessToken?.jwtToken ? (
    <AppRouter user={user || AuthDetails} signOut={signOut} />
  ) : (
    <AuthRouter setAuthDetails={setAuthDetails} />
  );
}

export default App;
