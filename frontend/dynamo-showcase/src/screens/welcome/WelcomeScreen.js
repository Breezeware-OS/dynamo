import React, {useEffect, useState} from 'react';
import BackendService from '../../service/BackendService';

const WelcomeScreen = () => {
  const [message, setMessage] = useState();
  useEffect(() => {
    BackendService.welcome()
      .then(res => {
        setMessage(res?.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 5,
        fontSize: '24px',
      }}>
      {message}🙌
    </div>
  );
};

export default WelcomeScreen;
