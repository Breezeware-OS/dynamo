import {
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
  FormGroup,
  Checkbox,
  TextField as Input,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {useAuthenticator} from '@aws-amplify/ui-react';
import {useFormik} from 'formik';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
  TextField,
} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUser, inviteUser, page} from './userSlice';
import {logdebug, traceSpan} from '../../helpers/tracing';

// user schema to validate error handling
const inviteUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email field required.')
    .email('Enter valid email.'),
  roles: Yup.array()
    .of(Yup.string().required('Role is required'))
    .required('Role is required'),
  groups: Yup.array()
    .of(Yup.string().required('Group is required'))
    .required('Group is required'),
  // firstName: Yup.string().required('Firstname field required.'),
  // lastName: Yup.string().required('Lastname field required.'),
  // phoneNumber: Yup.string().required('Phone Number field required.'),
});

const initialInviteUserValues = {
  email: null,
  roles: null,
  groups: null,
};

/**
 * Invite user Component
 * @param {*} param0 modal open prop
 * @param {*} param1 handle invite modal func
 * @returns modal with invite user fields
 */
const InviteUser = ({open, showModal}) => {
  const {user} = useAuthenticator();
  const userSession = user?.getSignInUserSession();

  const dispatch = useDispatch();
  const classes = useStyles();
  const pageNo = useSelector(page);

  const formik = useFormik({
    initialValues: {...initialInviteUserValues},
    validationSchema: inviteUserSchema,
    onSubmit: async values => {
      // values.phoneNumber = `+91${values.phoneNumber}`;
      // logdebug('Invite user', values);

      // invite user function is executed with user values as props
      // traceSpan('Invite user', async () => {
      showModal();
      const response = await dispatch(
        inviteUser({
          ...values,
          invitedBy: userSession.getIdToken().payload['custom:user_id'],
        }),
      );
      console.log('response', response);
      if (!response?.error) {
        dispatch(fetchUser({pageNo}));
        formik.resetForm();
      }
      // });
      // to display the invited user fetchuser func is executed with current pageNo as props
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const handlePhoneNumberKeyPress = event => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numbers (digits) and backspace
    const numericRegex = /^[0-9\b]+$/;

    // Limit the input to only five characters
    if (event.target.value.length >= 10 && event.key !== 'Backspace') {
      event.preventDefault();
      return;
    }

    if (!numericRegex.test(keyValue)) {
      event.preventDefault();
    }
  };
  const groupChangeHandler = e => {
    let groups = formik.values.groups ? [...formik.values.groups] : [];

    if (e.target.checked) {
      groups.push(e.target.value);
    } else {
      groups = groups.filter(prevValue => e.target.value !== prevValue);
    }

    formik.setFieldValue('groups', groups);
  };

  return (
    <Modal
      id="modal"
      open={open}
      onClose={() => {
        showModal(false);
        formik.resetForm();
      }}
      style={{width: '400px'}}>
      <form onSubmit={formik.handleSubmit}>
        <ModalTitle
          id="modal-title"
          style={{
            display: 'block',
            // justifyContent: 'space-between',
            padding: '10px 24px',
            backgroundColor: 'white',
          }}>
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              // borderBottom: '1px solid #d7d7d7',
            }}>
            <Text type="h2" style={{color: '#999999'}}>
              Add User
            </Text>
            <IconButton
              id="close-icon"
              style={{padding: 0}}
              onClick={() => {
                showModal(false);
                formik.resetForm();
              }}>
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{paddingTop: '6px'}}>
            <Divider />
          </div>
        </ModalTitle>
        <ModalContent
          style={{padding: '24px', paddingBottom: '16px'}}
          id="modal-content">
          <Grid container display="flex" flexDirection="row">
            <div>
              <Text className="modal-info">
                Adding a new user allows them to access form and docs.
              </Text>
            </div>
            <Grid item xs={12} marginBottom="16px">
              <InputLabel style={{marginBottom: 5}}>
                Email Address <span style={{color: 'red'}}>*</span>
              </InputLabel>
              <TextField
                placeholder="Email Address"
                name="email"
                id="email"
                size="large"
                style={{color: 'black'}}
                onChange={formik.handleChange}
              />
              {formik.errors?.email && (
                <Text className={classes.error}>{formik.errors?.email}</Text>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              style={{paddingTop: 0, paddingBottom: 0}}
              marginBottom="16px">
              {/* Add marginTop and marginBottom here */}
              <InputLabel>
                Groups <span style={{color: 'red'}}>*</span>
              </InputLabel>
              <FormGroup
                row
                name="groups"
                id="groups"
                onChange={groupChangeHandler}
                className={classes.checkbox}>
                {/* Add margin to FormControlLabel */}
                <FormControlLabel
                  value="administrative"
                  control={<Checkbox />}
                  label="Administrative"
                  checked={
                    formik?.values?.groups?.some(
                      value => value === 'administrative',
                    )
                      ? true
                      : false
                  }
                />
                <FormControlLabel
                  value="development"
                  control={<Checkbox />}
                  label="Development"
                  checked={
                    formik?.values?.groups?.some(
                      value => value === 'development',
                    )
                      ? true
                      : false
                  }
                />
              </FormGroup>

              {formik.errors?.groups && (
                <Text className={classes.error}>{formik.errors?.groups}</Text>
              )}

              {/* Remove the extra <Grid /> */}
            </Grid>

            <Grid
              item
              xs={12}
              style={{paddingTop: 0, paddingBottom: 0}}
              marginBottom="12px">
              {/* Add marginTop and marginBottom here */}
              <InputLabel>
                Role <span style={{color: 'red'}}>*</span>
              </InputLabel>
              <RadioGroup
                row
                name="roles"
                id="roles"
                onChange={e => formik.setFieldValue('roles', [e.target.value])}>
                {/* <FormControlLabel
          value="super_admin"
          control={<Radio />}
          label="Super Admin"
          id="super-admin"
        /> */}
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                  id="admin"
                />
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="User"
                  id="user"
                />
              </RadioGroup>
              {formik.errors?.roles && (
                <Text className={classes.error}>{formik.errors?.roles}</Text>
              )}
            </Grid>
          </Grid>
        </ModalContent>

        <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
          <Button
            color="secondary"
            variant="outlined"
            id="cancel-btn"
            onClick={() => {
              showModal(false);
              formik.resetForm();
            }}
            style={{
              marginRight: '15px',
              fontSize: '16px',
              // borderColor: '#1B3764',
              // color: '#1B3764',
            }}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            // style={{backgroundColor: '#1B3764'}}
            // icon={<span className="material-symbols-outlined">done</span>}
            iconPosition="start"
            type="submit"
            id="submit-btn">
            Confirm
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
};

export default InviteUser;

const useStyles = makeStyles(theme => ({
  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '13px !important',
    fontFamily: 'Roboto,sans-serif !important',
  },
  notchedOutline: {
    borderWidth: '1px !important',
    borderColor: '#d7d7d7 !important',
    color: '#333333 !important',
  },
  floatingLabelFocusStyle: {
    color: '#333333 !important',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
}));
