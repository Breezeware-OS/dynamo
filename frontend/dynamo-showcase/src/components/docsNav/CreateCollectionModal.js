import React, {useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {
  Backdrop,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  TextField,
  InputLabel,
} from '@mui/material';
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Snackbar,
  Button,
} from 'glide-design-system';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import BackendService from '../../service/BackendService';
import {docsSliceActions} from '../../screens/docs/DocsSlice';

const collectionSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});

const CreateCollectionModal = ({cancelHandler, open, initialValues}) => {
  const classes = useStyles();

  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {...initialValues},
    validationSchema: collectionSchema,
    onSubmit: async values => {
      setLoader(true);
      const data = {
        name: values?.name,
        permission: values?.permission ? values?.permission : 'read_write',
      };
      if (initialValues) {
        BackendService.editCollection(values)
          ?.then(res => {
            setNotification(true);
            setNotificationError(false);
            setNotificationMessage('Collection edited successfully');
            setLoader(false);
            handleCancel();
            dispatch(docsSliceActions.getData());
          })
          .catch(err => {
            setLoader(false);
            setNotification(true);
            setNotificationError(true);
            setNotificationMessage('Failed to edit collection');
          });
      } else {
        BackendService.createCollection(data)
          ?.then(res => {
            setNotification(true);
            setNotificationError(false);
            setNotificationMessage('Collection created successfully');
            setLoader(false);
            handleCancel();
            dispatch(docsSliceActions.getData());
          })
          .catch(err => {
            setLoader(false);
            setNotification(true);
            setNotificationError(true);
            setNotificationMessage('Failed to create collection');
          });
      }
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const handleCancel = () => {
    formik.resetForm();
    cancelHandler();
  };

  return (
    <>
      {notification && (
        // <Snackbar
        //   id="alert-message"
        //   style={{zIndex: '1'}}
        //   open
        //   message={notificationMessage}
        //   type={notificationError ? 'error' : 'success'}
        //   autoHideDuration={5000}
        //   onClose={() => setNotification(false)}
        // />
        <Snackbar
          open
          message={notificationMessage}
          type={notificationError ? 'error' : 'success'}
          onClose={() => setNotification(false)}
        />
      )}
      <Backdrop
        sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
        open={loader}>
        <CircularProgress style={{color: '#0a5b99'}} />
      </Backdrop>
      <Modal
        open={open}
        onClose={handleCancel}
        id="modal"
        className={classes.modal}>
        <form
          onSubmit={formik.handleSubmit}
          id="form"
          style={{padding: '16px', paddingTop: '10px'}}>
          <ModalTitle
            style={{
              padding: '0px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #d7d7d7',
            }}>
            <Grid item container xs={12} justifyContent="space-between">
              <Typography className={classes.header}>
                {initialValues ? 'Edit Collection' : 'Create New Collection'}
              </Typography>
              <IconButton
                sx={{padding: 0, float: 'right'}}
                id="cancel-icon"
                onClick={handleCancel}>
                <span class="material-symbols-outlined">close</span>
              </IconButton>
            </Grid>
          </ModalTitle>
          <ModalContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0px',
            }}>
            <Typography
              style={{color: '#9b9b9b', fontSize: '16px', marginBlock: '16px'}}>
              Collections are for grouping your documents.
            </Typography>
            <Grid
              item
              xs={12}
              display="flex"
              flexWrap={{md: 'nowrap', xs: 'wrap'}}>
              <Grid
                item
                xs={12}
                md={8}
                paddingRight={{md: 3, xs: 0}}
                sx={{width: '100%'}}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{color: 'black', paddingBottom: '10px'}}>
                  Name<span className={classes.span}> *</span>
                </InputLabel>
                <TextField
                  id="name"
                  className={classes.textField}
                  size="small"
                  name="name"
                  placeholder="Enter Collection title here"
                  onChange={formik.handleChange}
                  value={formik.values?.name}
                />
                {formik.errors?.name && (
                  <Typography className={classes.error}>
                    {formik.errors?.name}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                paddingRight={{md: 0, xs: 0}}
                sx={{width: '100%'}}
                marginTop={{md: 0, xs: '16px'}}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{color: 'black', paddingBottom: '10px'}}>
                  Default Access<span className={classes.span}> *</span>
                </InputLabel>
                <select
                  id="access"
                  style={{color: 'grey'}}
                  onChange={formik.handleChange}
                  value={formik.values?.permission}
                  className={classes.selectField}
                  name="permission">
                  <option value="read_write">View & Edit</option>
                  <option value="read">View Only</option>
                  <option value="no_access">No Access</option>
                </select>
                <Typography
                  style={{
                    color: '#9b9b9b',
                    fontSize: '12px',
                    marginBlock: '8px',
                  }}>
                  This represents the default level of access granted to team
                  members. After creating the collection, you can grant specific
                  users or groups additional access privileges.
                </Typography>
              </Grid>
            </Grid>
          </ModalContent>
          <ModalActions style={{padding: '10px 0px', paddingBottom: '2px'}}>
            <Grid
              item
              xs={12}
              container
              display="flex"
              justifyContent="flex-end">
              <Grid item className={classes.cancelBtnContainer}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  color="secondary"
                  className={classes.cancelBtn}
                  id="cancel-btn">
                  Cancel
                </Button>
              </Grid>
              <Grid item className={classes.submitBtnContainer}>
                <Button
                  type="submit"
                  id="submit-btn"
                  className={classes.submitBtn}>
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </ModalActions>
        </form>
      </Modal>
    </>
  );
};

export default CreateCollectionModal;

const useStyles = makeStyles(theme => ({
  header: {
    fontFamily: 'Roboto, sans-serif !important',
    fontWeight: '700 !important',
    fontSize: '18px !important',
    marginBottom: '2px !important',
    color: '#999999 !important',
  },
  subheader: {
    fontFamily: 'Roboto, sans-serif !important',
    fontSize: '14px !important',
    marginBottom: '4px !important',
  },

  textField: {
    width: '100% !important',
    fontFamily: 'Roboto,sans-serif !important',
  },

  breadcrumbs: {
    fontSize: '12px !important',
    color: 'rgb(170, 170, 170) !important',
    fontFamily: 'sans-serif !important',
  },

  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '14px !important',
    fontFamily: 'Roboto,sans-serif !important',
    paddingBottom: '5px !important',
  },

  modal: {
    width: '721px !important',
    fontFamily: 'Roboto, sans-serif !important',
    maxHeight: '100vh',
    overflowY: 'auto',
    [theme.breakpoints.down('721')]: {
      minWidth: 'auto !important',
      width: '95% !important',
      maxHeight: '100vh',
      overflowY: 'auto',
    },
    [theme.breakpoints.down('600')]: {
      width: '100% !important',
      minWidth: 'auto !important',
      maxHeight: '100vh',
      overflowY: 'auto',
    },
  },

  cancelBtnContainer: {
    paddingLeft: '0px !important',
    [theme.breakpoints.down('md')]: {
      padding: '2px !important',
      paddingTop: '5px !important',
    },
    fontFamily: 'Roboto,sans-serif !important',
    marginRight: '16px !important',
  },

  submitBtnContainer: {
    paddingRight: '0px !important',
    [theme.breakpoints.down('md')]: {
      padding: '2px !important',
      paddingTop: '5px !important',
    },
    fontFamily: 'Roboto,sans-serif !important',
  },

  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
  cancelBtn: {
    fontSize: '14px !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    textAlign: 'center !important',
    textTransform: 'none !important',
  },
  span: {
    color: 'red',
    fontSize: '14px',
    fontFamily: 'sans-serif !important',
  },
  selectField: {
    width: '100% !important',
    maxWidth: '100% !important',
    marginTop: '0px !important',
    border: '1px solid #d7d7d7 !important',
    backgroundColor: '#ffffff !important',
    borderRadius: '5px !important',
    '&:focus-visible': {
      outlineStyle: 'none !important',
    },
    '&:hover:focus:active': {
      border: '1px solid #d7d7d7 !important',
    },
    height: '36px !important',
  },
}));
