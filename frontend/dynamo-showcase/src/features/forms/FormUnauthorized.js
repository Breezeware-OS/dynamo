import React from 'react';
import unauthorizedImage from '../../assets/logo/Unauthorized1.jpg';

export default function FormUnauthorized() {
  return (
    <div style={{marginTop: '5%', textAlign: 'center'}}>
      <img
        src={unauthorizedImage}
        alt=""
        style={{width: '600px', height: '400px'}}
      />
      <p style={{fontWeight: 700, fontSize: 40}}>UNAUTHORIZED!</p>
      <p style={{fontWeight: '600'}}>You dont't have access to this form</p>
    </div>
  );
}
