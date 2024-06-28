import {Button, Card, Text, TextField} from 'glide-design-system';
import {TextField as Input} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import * as Yup from 'yup';
import {useNavigate, useParams} from 'react-router-dom';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import logo from '../assets/logo/dynamo.png';
import BackendService from '../service/BackendService';
import {logError, loginfo, traceSpan} from '../helpers/tracing';

// SetupAccount schema for error validation
const setupAccountSchema = Yup.object().shape({
  firstName: Yup.string().required('Firstname field required.'),
  lastName: Yup.string().required('Lastname field required.'),
  phoneNumber: Yup.string().required('Phone Number field required.'),
  newPassword: Yup.string()
    .required('Password field required.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password field required.')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

/**
 * Setup account page for user.
 * @returns Setup account page.
 */
const SetupAccount = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [responseError, setResponseError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {email} = useParams();

  const formik = useFormik({
    initialValues: {},
    validationSchema: setupAccountSchema,
    onSubmit: async values => {
      values.phoneNumber = values?.phoneNumber?.startsWith('+91')
        ? values.phoneNumber
        : `+91${values.phoneNumber}`;
      values.email = email;
      values.password = values?.newPassword;
      setLoading(true);
      // traceSpan('Account Setup', async () => {
      handleSetUpAccount(values);
      // });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  /**
   * When user submits API call is made.
   * Navigate to login page if success or update error.
   * @param {*} values - user data.
   */
  const handleSetUpAccount = values => {
    BackendService.accountSetup(values)
      .then(res => {
        // loginfo('Account SetUp Success', res);
        navigate('/');
        setResponseError(null);
      })
      .catch(err => {
        // logError('Account SetUp Failed', err);
        setResponseError(err?.response?.data?.details[0]);
      });
  };

  /**
   * Handles phone number field by restricting strings and max length.
   * @param {*} event phone number field
   * @returns null
   */
  const handlePhoneNumberKeyPress = event => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numbers (digits) and backspace
    const numericRegex = /^[0-9\b]+$/;

    if (
      event.target.value?.startsWith('+91') ||
      event.target.value?.startsWith(' 91')
    ) {
      if (event.target.value.length >= 13 && event.key !== 'Backspace') {
        event.preventDefault();
        return;
      }
    } else if (event.target.value.length >= 10 && event.key !== 'Backspace') {
      event.preventDefault();
      return;
    }

    if (!numericRegex.test(keyValue)) {
      event.preventDefault();
    }
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <img src={logo} alt="" />
        <Text style={{fontSize: '18px'}}>Setup your new account</Text>
        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <div style={{width: '100%', paddingInline: 5}}>
            <TextField
              label="First Name"
              required
              width="100%"
              id="firstName"
              placeholder="First Name"
              name="firstName"
              style={{width: '100%', color: 'black'}}
              onChange={formik.handleChange}
            />
            {formik.errors?.firstName && (
              <Text className={classes.error}>{formik.errors?.firstName}</Text>
            )}
          </div>
          <div style={{width: '100%', paddingInline: 5}}>
            <TextField
              label="Last Name"
              required
              width="100%"
              id="lastName"
              placeholder="Last Name"
              name="lastName"
              style={{width: '100%', color: 'black'}}
              onChange={formik.handleChange}
            />
            {formik.errors?.lastName && (
              <Text className={classes.error}>{formik.errors?.lastName}</Text>
            )}
          </div>

          <div style={{width: '100%', paddingInline: 5}}>
            <Text className={classes.inputLabel}>
              Phone Number <span style={{color: 'red'}}>*</span>
            </Text>
            <Input
              id="phoneNumber"
              placeholder="Phone number"
              className={classes.textField}
              size="small"
              type="text"
              name="phoneNumber"
              onChange={formik.handleChange}
              sx={{width: '100%'}}
              // value={
              //   initialValueData !== null
              //     ? formik.values?.phoneNumber?.slice(-10)
              //     : formik.values?.phoneNumber
              // }
              // value={formik.values?.phoneNumber}
              // inputProps={{
              //   inputMode: 'numeric',
              //   pattern: '[0-9]*',
              //   maxLength: 10,

              // }}
              InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 13,
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                className: classes.floatingLabelFocusStyle,
              }}
              onKeyPress={handlePhoneNumberKeyPress}
            />
            {formik.errors?.phoneNumber && (
              <Text className={classes.error}>
                {formik.errors?.phoneNumber}
              </Text>
            )}
          </div>
          <div style={{width: '100%', paddingInline: 5}}>
            <TextField
              label="New Password"
              required
              width="100%"
              id="new-password"
              placeholder="New Password"
              name="newPassword"
              type="password"
              style={{width: '100%', color: 'black'}}
              onChange={formik.handleChange}
            />
            {formik.errors?.newPassword && (
              <Text className={classes.error}>
                {formik.errors?.newPassword}
              </Text>
            )}
          </div>

          <div style={{width: '100%', paddingInline: 5}}>
            <TextField
              label="Confirm Password"
              required
              width="100%"
              id="confirm-password"
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
              style={{width: '100%', color: 'black'}}
              onChange={formik.handleChange}
            />
            {formik.errors?.confirmPassword && (
              <Text className={classes.error}>
                {formik.errors?.confirmPassword}
              </Text>
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
              className={classes.button}
              style={{width: '100%'}}
              type="submit"
              loading={loading}
              onClick={formik.handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SetupAccount;

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
  notchedOutline: {
    borderWidth: '1px !important',
    borderColor: '#d7d7d7 !important',
    color: '#333333 !important',
  },
  floatingLabelFocusStyle: {
    color: '#333333 !important',
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: '500 !important',
    marginBottom: '5px',
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
