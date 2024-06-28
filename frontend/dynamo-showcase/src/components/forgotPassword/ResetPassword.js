import {Text} from '@aws-amplify/ui-react';
import React from 'react';

const ResetPassword = () => {
  return (
    <>
      <Text style={{textAlign: 'center', fontSize: '16px', fontWeight: 700}}>
        Forgot Password
      </Text>
      <Text>Please enter the email address associated with your account.</Text>
    </>
  );
};

export default ResetPassword;
