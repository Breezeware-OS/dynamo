import {Text} from '@aws-amplify/ui-react';
import React from 'react';

const ConfirmResetPassword = () => {
  return (
    <>
      <Text style={{textAlign: 'center', fontSize: '16px', fontWeight: 700}}>
        Set up your new Password
      </Text>
      <Text>
        Please provide the verification code along with your new password and
        confirmation to reset your password.
      </Text>
    </>
  );
};

export default ConfirmResetPassword;
