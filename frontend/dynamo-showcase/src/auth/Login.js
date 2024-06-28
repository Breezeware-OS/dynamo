import {
  Authenticator,
  AmplifySignIn,
  AmplifyAuthenticator,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import {Amplify, Auth} from 'aws-amplify';
import AWS from 'aws-sdk';
import {parseAWSExports} from '@aws-amplify/core';
import React, {useState} from 'react';
import SignInHeader from '../components/signIn/SignInHeader';
import SignInFooter from '../components/signIn/SignInFooter';
import SignUpHeader from '../components/signUp.js/SignUpHeader';
import SignUpFooter from '../components/signUp.js/SignUpFooter';
import ConfirmSignUp from '../components/signUp.js/ConfirmSignUp';
import ResetPassword from '../components/forgotPassword/ResetPassword';
import ConfirmResetPassword from '../components/forgotPassword/ConfirmResetPassword';
import formFields from './formFields';
import '../index.css';
import awsExports from '../aws-exports';
import AppRouter from '../routes/AppRouter';
import SignInFormFields from '../components/signIn/SignInFormFields';
import ForceNewPasswordHeader from '../components/changePassword/ForceNewPasswordHeader';
import LoginScreen from '../authScreen/Login';

Amplify.configure(awsExports);

const components = {
  SignIn: {
    Header: SignInHeader,
    FormFields: SignInFormFields,
    Footer: SignInFooter,
  },
  ForceNewPassword: {
    Header: ForceNewPasswordHeader,
    Footer: ForceNewPasswordHeader,
  },
  SignUp: {
    Header: SignUpHeader,
    Footer: SignUpFooter,
  },
  ConfirmSignUp: {
    Header: ConfirmSignUp,
  },
  ResetPassword: {
    Header: ResetPassword,
  },
  ConfirmResetPassword: {
    Header: ConfirmResetPassword,
  },
};

const Login = () => {
  const cognitoidentityserviceprovider =
    new AWS.CognitoIdentityServiceProvider();

  const [signInError, setSignInError] = useState(null);
  const {route, totpSecretCode, getTotpSecretCode} = useAuthenticator();

  const handleSignIn = async ({username, password}) => {
    try {
      await Auth.signIn(username, password);

      // User is successfully logged in, navigate to authenticated part of the app
    } catch (error) {
      setSignInError(error.message);
    }
  };

  return (
    // <>
    //   <Authenticator
    //     hide={['signIn']}
    //     // hideSignUp
    //     // socialProviders={['facebook', 'google', 'apple']}
    //     formFields={formFields}
    //     components={components}
    //     // services={{
    //     //   handleSignIn: async ({username, password}) => {
    //     //     console.log(username, password, '+++');
    //     //     try {
    //     //       console.log('enter');

    //     //       Auth.changePassword();

    //     //       const user = await Auth.signIn(
    //     //         username.toString(),
    //     //         password.toString(),
    //     //       )
    //     //         .then(async res => {
    //     //           console.log(res);
    //     //         })
    //     //         .catch(err => {
    //     //           console.log(err);
    //     //         });

    //     //       console.log('leave', user);
    //     //       // User is successfully logged in, navigate to authenticated part of the app
    //     //     } catch (error) {
    //     //       console.log('---');
    //     //       setSignInError(error.message);
    //     //     }
    //     //   },
    //     // }}
    //   >
    //     {/* <ForceNewPasswordHeader /> */}
    //     {({signOut, user}) => <AppRouter signOut={signOut} user={user} />}
    //   </Authenticator>
    // </>
    <LoginScreen />
    // <AmplifyAuthenticator>
    //   <AmplifySignIn
    //     headerText="Sign In to Your Account"
    //     slot="sign-in"
    //     handleSignIn={handleSignIn}
    //   />
    // </AmplifyAuthenticator>
  );
};

export default Login;
