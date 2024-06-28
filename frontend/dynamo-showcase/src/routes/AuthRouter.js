import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginScreen from '../authScreen/Login';
import ForgotPassword from '../authScreen/ForgotPassword';
import ResetPassword from '../authScreen/ResetPassword';
import SetupAccount from '../authScreen/SetupAccount';
import ViewForm from '../features/forms/ViewForm';
import FormSubmissionFeedback from '../features/forms/FormSubmissionFeedback';

const AuthRouter = ({setAuthDetails}) => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={<LoginScreen setAuthDetails={setAuthDetails} />}
      />
      <Route exact path="/forgot-password" element={<ForgotPassword />} />
      <Route exact path="/reset-password/:email" element={<ResetPassword />} />
      <Route exact path="/setup-account/:email" element={<SetupAccount />} />
      <Route exact path="/form/:id" element={<ViewForm />} />
      <Route exact path="/form/feedback" element={<FormSubmissionFeedback />} />
    </Routes>
  );
};

export default AuthRouter;
