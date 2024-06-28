import {Button, Card, Text, TextField} from 'glide-design-system';
import {Auth} from 'aws-amplify';
import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import logo from '../assets/logo/dynamo.png';
import {logError, loginfo, traceSpan} from '../helpers/tracing';

// login schema to validate error handling
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email field required.')
    .email('Enter valid email.'),
  password: Yup.string().required('Password is required.'),
});

/**
 * Login Page using aws amplify API for authentication
 * @param {*} param0 authdetails of user is set.
 * @returns Login page with email and password fields.
 */
const LoginScreen = ({setAuthDetails}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [responseError, setResponseError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {},
    validationSchema: loginSchema,
    onSubmit: async values => {
      setLoading(true);
      // traceSpan('Login', async () => {
      handleLogin(values?.email, values?.password);
      // });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  /**
   * When user submits API call is made using aws-amplify
   * Naviagte to account setup if user status requires new password or update authdetails and navigate to home page.
   * @param {*} userName email of the user
   * @param {*} password of the user
   */
  const handleLogin = (userName, password) => {
    Auth.signIn(userName, password)
      .then(res => {
        // loginfo('Success', res);

        setResponseError(null);
        setLoading(false);
        if (res?.challengeName === 'NEW_PASSWORD_REQUIRED') {
          navigate(
            `/setup-account/${res?.challengeParam?.userAttributes?.email}`,
          );
        } else {
          setAuthDetails(res);
          navigate('/forms');
        }
      })
      .catch(err => {
        // logError('error', err);

        setResponseError(err?.message);
        setLoading(false);
      });
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <img src={logo} alt="" />
        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <div style={{width: '100%', paddingInline: 5}}>
            <TextField
              width="100%"
              required
              label="Email"
              id="email"
              placeholder="Email"
              autocomplete="off"
              name="email"
              style={{width: '100%', color: 'black'}}
              onChange={formik.handleChange}
            />
            {formik.errors?.email && (
              <Text className={classes.error}>{formik.errors?.email}</Text>
            )}
          </div>
          <div style={{width: '100%', paddingInline: 5}}>
            <TextField
              width="100%"
              required
              label="Password"
              id="pasword"
              name="password"
              placeholder="Password"
              type="password"
              onChange={formik.handleChange}
              style={{width: '100%', color: 'black'}}
            />
            {formik.errors?.password && (
              <Text className={classes.error}>{formik.errors?.password}</Text>
            )}
          </div>
          {responseError && (
            <Text
              style={{
                color: 'red',
                fontSize: '13px',
                fontWeight: '400',
                textAlign: 'center',
              }}>
              {responseError ? responseError : null}
            </Text>
          )}
          <div
            style={{
              width: '100%',
              display: 'flex',
              gap: '15px',
              flexDirection: 'column',
              paddingInline: 5,
            }}>
            <Button
              id="login-btn"
              style={{width: '100%'}}
              className={classes.button}
              type="submit"
              loading={loading}
              onClick={formik.handleSubmit}>
              Login
            </Button>
            <Text
              style={{color: '#1b3764'}}
              className={classes.forgotPassword}
              onClick={() => {
                navigate('/forgot-password');
              }}>
              Forgot password?
            </Text>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginScreen;

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '13px !important',
    fontWeight: '400 !important',
  },
  forgotPassword: {
    cursor: 'pointer',
    color: '#4c92c6',
    textDecoration: 'underline',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: '400 !important',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    width: '487px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: 5,
  },
  form: {
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
}));
