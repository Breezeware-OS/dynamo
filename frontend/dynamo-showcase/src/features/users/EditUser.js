import {
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  FormGroup,
  Checkbox,
  TextField as Input,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import * as Yup from 'yup';
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
import {useAuthenticator} from '@aws-amplify/ui-react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {
  editUser,
  editUserModal,
  fetchUser,
  handleEditUserModal,
  initialValue,
  page,
} from './userSlice';
import {logdebug, traceSpan} from '../../helpers/tracing';

/**
 * Edit Existing user Component
 * @returns modal with edit user fields
 */
const EditUser = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector(editUserModal);
  const pageNo = useSelector(page);
  const initialData = useSelector(initialValue);

  const {user} = useAuthenticator();
  const userSession = user?.getSignInUserSession();

  // User schema to validate error handling
  const aciveUserSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required.')
      .email('Enter a valid email.'),
    roles: Yup.array()
      .of(Yup.string().required('Role is required'))
      .required('Role is required'),
    groups: Yup.array()
      .of(Yup.string().required('Group is required'))
      .required('Group is required'),

    firstName: Yup.string().required('First name is required.'),
    lastName: Yup.string().required('Last name is required.'),
    phoneNumber: Yup.string()
      .required('Phone Number required.')
      .min(10, 'Enter a valid phone number.')
      .max(10, 'Enter a valid phone number.'),
  });

  const inviteUserSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required.')
      .email('Enter a valid email.'),
    roles: Yup.array()
      .of(Yup.string().required('Role is required'))
      .required('Role is required'),
    groups: Yup.array()
      .of(Yup.string().required('Group is required'))
      .required('Group is required'),
  });

  const formik = useFormik({
    initialValues: {
      ...initialData,
      phoneNumber: initialData?.phoneNumber?.substring(3),
    },
    validationSchema:
      initialData?.status === 'invited' ? inviteUserSchema : aciveUserSchema,
    onSubmit: async values => {
      closeModal();

      values.phoneNumber = `+91${values.phoneNumber}`;

      dispatch(
        editUser({
          ...values,
          invitedBy: userSession.getIdToken().payload['custom:user_id'],
        }),
      );

      // logdebug('Edit user', values);
      // edit user function is executed with updated values

      // traceSpan('Edit user', async () => {
      // await dispatch(
      //   editUser({
      //     ...values,
      //     invitedBy: userSession.getIdToken().payload['custom:user_id'],
      //   }),
      // );
      // });

      // to display the updated value fetchuser is executed with current pageNo as props
      dispatch(fetchUser({pageNo}));
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  /**
   * Close edit modal
   */
  const closeModal = () => {
    dispatch(handleEditUserModal());
    formik.resetForm();
  };

  const handlePhoneNumberKeyPress = event => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numbers (digits) and backspace
    const numericRegex = /^[0-9\b]+$/;

    // Limit the input to only five characters
    if (
      event.target.value?.startsWith('+91') ||
      event.target.value?.startsWith('+1')
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
      open={open}
      onClose={closeModal}
      style={{width: initialData?.status !== 'invited' ? '800px' : '400px'}}
      id="modal">
      <form onSubmit={formik.handleSubmit}>
        <ModalTitle
          id="modal-title"
          style={{
            display: 'block',
            // justifyContent: 'space-between',
            padding: '10px 24px',
            backgroundColor: 'white',
            // borderBottom: '1px solid #d7d7d7',
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
              Edit User
            </Text>
            <IconButton
              id="close-icon"
              onClick={closeModal}
              style={{padding: 0}}>
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
          <Grid container spacing="24px" display="flex" flexDirection="row">
            {initialData?.status !== 'invited' ? (
              <>
                <Grid item xs={12} md={6} paddingBottom="16px">
                  {/* <InputLabel>
                    Firstname <span style={{color: 'red'}}>*</span>
                  </InputLabel> */}
                  <TextField
                    label="First Name"
                    required
                    id="first-name"
                    placeholder="Firstname"
                    name="firstName"
                    size="large"
                    width="100%"
                    value={formik.values?.firstName}
                    onChange={formik.handleChange}
                    style={{color: 'black'}}
                  />
                  {formik.errors?.firstName && (
                    <Text className={classes.error}>
                      {formik.errors?.firstName}
                    </Text>
                  )}
                </Grid>
                <Grid item xs={12} md={6} paddingBottom="16px">
                  {/* <InputLabel>
                    Lastname <span style={{color: 'red'}}>*</span>
                  </InputLabel> */}
                  <TextField
                    label="Last Name"
                    required
                    placeholder="Lastname"
                    id="last-name"
                    name="lastName"
                    size="large"
                    width="100%"
                    value={formik.values?.lastName}
                    onChange={formik.handleChange}
                    style={{color: 'black'}}
                  />
                  {formik.errors?.lastName && (
                    <Text className={classes.error}>
                      {formik.errors?.lastName}
                    </Text>
                  )}
                </Grid>
                <Grid item xs={12} md={6} paddingBottom="16px">
                  <div>
                    <p className="headers" style={{marginBottom: '5px'}}>
                      Phone number <span style={{color: 'red'}}> *</span>
                    </p>
                    <Input
                      id="phoneNumber"
                      placeholder="Phone number"
                      className={classes.textField}
                      size="small"
                      type="text"
                      name="phoneNumber"
                      onChange={formik.handleChange}
                      sx={{width: '100%'}}
                      InputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 15,
                        classes: {
                          notchedOutline: classes.notchedOutline,
                        },
                      }}
                      value={formik.values?.phoneNumber}
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
                </Grid>
              </>
            ) : (
              <></>
            )}

            <Grid
              item
              xs={12}
              md={initialData?.status !== 'invited' ? 6 : 0}
              paddingBottom="16px">
              {/* <InputLabel>
                Email Address <span style={{color: 'red'}}>*</span>
              </InputLabel> */}
              <TextField
                label="Email Address"
                required
                placeholder="Email Address"
                name="email"
                id="email"
                value={formik.values?.email}
                size="large"
                style={{color: 'black'}}
                width="100%"
                onChange={formik.handleChange}
              />
              {formik.errors?.email && (
                <Text className={classes.error}>{formik.errors?.email}</Text>
              )}
            </Grid>

            <Grid
              paddingBottom="16px"
              item
              xs={12}
              md={initialData?.status !== 'invited' ? 6 : 0}
              style={{paddingTop: 5, paddingBottom: 0}}>
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
              paddingBottom="16px"
              item
              xs={12}
              md={initialData?.status !== 'invited' ? 6 : 0}
              style={{paddingTop: 5, paddingBottom: 0}}>
              {/* Add marginTop and marginBottom here */}
              <InputLabel>
                Role <span style={{color: 'red'}}>*</span>
              </InputLabel>
              <RadioGroup
                row
                name="roles"
                id="roles"
                value={formik?.values?.roles}
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
            variant="outlined"
            color="secondary"
            onClick={closeModal}
            id="cancel-btn"
            style={{
              marginRight: '15px',
              minWidth: 'auto',
              // borderColor: '#1B3764',
              // color: '#1B3764',
            }}>
            Cancel
          </Button>
          <Button
            // style={{backgroundColor: '#1B3764'}}
            className={classes.button}
            // icon={<span className="material-symbols-outlined">done</span>}
            // iconPosition="start"
            type="submit"
            id="submit-btn"
            onClick={formik.handleSubmit}>
            Confirm
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
};

export default EditUser;

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
