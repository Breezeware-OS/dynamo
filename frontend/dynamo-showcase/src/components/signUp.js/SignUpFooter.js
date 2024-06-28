import {Heading, View, useAuthenticator, useTheme} from '@aws-amplify/ui-react';
import React from 'react';

const SignUpFooter = () => {
  const {toSignIn} = useAuthenticator();
  const {tokens} = useTheme();
  return (
    <View textAlign="center" paddingBottom="15px">
      <Heading
        adding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
        level={7}
        style={{paddingBottom: '15px !important'}}>
        Already have an account ?
        <span
          style={{
            color: 'rgb(25, 118, 210)',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            // marginBottom: '15px !important',
          }}
          onClick={toSignIn}>
          Login
        </span>
      </Heading>
    </View>
  );
};

export default SignUpFooter;
