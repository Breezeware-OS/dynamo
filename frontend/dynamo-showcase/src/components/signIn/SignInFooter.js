import {Heading, View, useAuthenticator} from '@aws-amplify/ui-react';
import React from 'react';

const SignInFooter = () => {
  const {toResetPassword} = useAuthenticator();
  const {toSignUp} = useAuthenticator();

  return (
    <View textAlign="center">
      <Heading level={7} style={{marginTop: 0}}>
        Don't have an account ?
        <span
          style={{
            color: 'rgb(25, 118, 210)',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
          onClick={toSignUp}>
          {' '}
          Sign up
        </span>
      </Heading>
      <Heading
        onClick={toResetPassword}
        style={{
          color: 'rgb(25, 118, 210)',
          fontSize: '16px',
          fontWeight: '700',
          marginBottom: '15px',
          marginTop: '15px',
          cursor: 'pointer',
        }}>
        Forgot Password?
      </Heading>
    </View>
  );
};

export default SignInFooter;
