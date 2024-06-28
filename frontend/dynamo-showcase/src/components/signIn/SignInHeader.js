import {Heading} from '@aws-amplify/ui-react';
import React from 'react';
import logo from '../../assets/logo/dynamo.png';

const SignInHeader = () => {
  return (
    <Heading style={{display: 'flex', justifyContent: 'center'}}>
      <img src={logo} alt="logo" />
    </Heading>
  );
};

export default SignInHeader;
