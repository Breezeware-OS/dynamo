import React, {useState} from 'react';
// import '@aws-amplify/ui-react/styles.css';
import axios from 'axios';
import {useAuthenticator} from '@aws-amplify/ui-react';
import {Auth} from 'aws-amplify';
import awsmobile from './aws-exports';

import AppRouter from './routes/AppRouter';
import AuthRouter from './routes/AuthRouter';

Auth.configure(awsmobile);

function App() {
  const {user, signOut} = useAuthenticator();
  const [AuthDetails, setAuthDetails] = useState(user);
  // pass Access token to server in request headers.

  if (user || AuthDetails) {
    axios.interceptors.request.use(
      (axios.defaults.headers = {
        Authorization: user
          ? // eslint-disable-next-line no-unsafe-optional-chaining
            'Bearer ' + user?.signInUserSession?.accessToken?.jwtToken
          : // eslint-disable-next-line no-unsafe-optional-chaining
            'Bearer ' + AuthDetails?.signInUserSession?.accessToken?.jwtToken,
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
