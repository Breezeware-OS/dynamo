import React, {useState} from 'react';
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
import {useNavigate} from 'react-router';
import {makeStyles} from '@material-ui/core';
import BackendService from '../../service/BackendService';

const CreateModelModal = ({open, cancelHandler, updateHandler}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [loader, setLoader] = useState(false);
  const [modelTitle, setModelTitle] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    setLoader(true);
    if (modelTitle) {
      setError(false);
      BackendService.createModel({'model-name': modelTitle})
        ?.then(res => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Model Created Successfully');
          setLoader(false);
          // updateHandler();
          setTimeout(() => {
            handleCancel();
            navigate(`/AI/train/${res?.data?.uniqueId}/upload-document`);
          }, 1000);
        })
        .catch(err => {
          setLoader(false);
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to create model');
        });
    } else {
      setError('Model Name is Required');
    }
  };

  const handleCancel = () => {
    setModelTitle('');
    setError(false);
    cancelHandler();
  };
  return (
    <>
      <Snackbar
        id="alert-message"
        className={classes.snackbar}
        open={notification}
        message={notificationMessage}
        type={notificationError ? 'error' : 'success'}
        autoHideDuration={5000}
        onClose={() => setNotification(false)}
      />
      <Backdrop
        sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 20000}}
        open={loader}>
        <CircularProgress style={{color: '#0a5b99'}} />
      </Backdrop>
      <Modal
        open={open}
        onClose={handleCancel}
        id="modal"
        className={classes.modal}>
        <div id="form" style={{padding: '16px', paddingTop: '10px'}}>
          <ModalTitle
            style={{
              padding: '0px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #d7d7d7',
            }}>
            <Grid item container xs={12} justifyContent="space-between">
              <Typography className={classes.header}>
                Create New Model
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
              style={{
                color: '#9b9b9b',
                fontSize: '16px',
                marginBlock: '16px',
                fontFamily: '"Roboto", sans-serif',
              }}>
              This procedure for developing a new AI model follows a structured
              sequence of document upload, configuration, and testing phases.
            </Typography>
            <Grid item xs={12} display="flex" flexDirection="column">
              <InputLabel
                id="demo-simple-select-label"
                sx={{color: 'black', paddingBottom: '6px'}}>
                Model Name<span className={classes.span}> *</span>
              </InputLabel>
              <TextField
                id="name"
                className={classes.textField}
                size="small"
                placeholder="Enter model title here"
                onChange={e => setModelTitle(e.target.value)}
                value={modelTitle}
              />
              {error && (
                <Typography className={classes.error}>{error}</Typography>
              )}
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
                  onClick={handleCancel}
                  color="secondary"
                  variant="outlined"
                  className={classes.cancelBtn}
                  id="cancel-btn">
                  Cancel
                </Button>
              </Grid>
              <Grid item className={classes.submitBtnContainer}>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  id="submit-btn"
                  className={classes.submitBtn}>
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </ModalActions>
        </div>
      </Modal>
    </>
  );
};

export default CreateModelModal;

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
    width: '390px !important',
    fontFamily: 'Roboto, sans-serif !important',
    maxHeight: '100vh',
    overflowY: 'auto',
    [theme.breakpoints.down('390')]: {
      minWidth: 'auto !important',
      width: '95% !important',
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
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
    backgroundColor: '#1b3764 !important',
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
  snackbar: {
    zIndex: '100 !important',
  },
}));
