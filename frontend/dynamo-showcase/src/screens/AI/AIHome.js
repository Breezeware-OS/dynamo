import React, {useState} from 'react';
import Layout from '../../components/layout/Layout';
import ExistingUserModel from '../../components/AI/ExistingUserModel';
import NewUserModel from '../../components/AI/NewUserModel';

/** Dynamo AI home screen */
const AIHome = () => {
  const [isUploaded, setIsUploaded] = useState(true); // currently the screen is directed to ExistingUserModel Component without checking may be in future it will be implemented
  return (
    <Layout>
      <div style={{padding: '25px'}}>
        {isUploaded ? (
          /** when models are there */
          <ExistingUserModel />
        ) : (
          /** when no models are there */
          <NewUserModel updateHandler={() => setIsUploaded(true)} />
        )}
      </div>
    </Layout>
  );
};

export default AIHome;
