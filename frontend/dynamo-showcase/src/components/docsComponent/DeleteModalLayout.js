import React, {useState} from 'react';
import {
  Backdrop,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Snackbar,
  Button,
} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import {createTheme} from '@mui/material/styles';
import BackendService from '../../service/BackendService';

const theme = createTheme();

const DeleteModalLayout = ({
  cancelHandler,
  open,
  children,
  title,
  deleteHandler,
}) => {
  const classes = useStyles();

  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [loader, setLoader] = useState(false);

  return (
    <Modal
      open={open}
      onClose={cancelHandler}
      id="modal"
      className={classes.modal}>
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

      <ModalTitle
        style={{
          padding: '10px 24px',
          backgroundColor: '#fff',
          display: 'block',
        }}>
        <div
          style={{
            backgroundColor: 'white',
            // display: 'flex',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            width: '100%',
            // borderBottom: '1px solid #d7d7d7',
          }}>
          <Grid item container xs={12} justifyContent="space-between">
            <Typography className={classes.header}>{title}</Typography>
            <IconButton
              sx={{padding: 0, float: 'right'}}
              id="cancel-icon"
              onClick={cancelHandler}>
              <span class="material-symbols-outlined">close</span>
            </IconButton>
          </Grid>
          <div style={{paddingTop: '6px'}}>
            <Divider />
          </div>
        </div>
      </ModalTitle>
      <ModalContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 24px',
        }}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </ModalContent>
      <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
        <Grid item xs={12} container display="flex" justifyContent="flex-end">
          <Grid item className={classes.cancelBtnContainer}>
            <Button
              onClick={cancelHandler}
              color="secondary"
              variant="outlined"
              className={classes.cancelBtn}
              id="cancel-btn">
              Cancel
            </Button>
          </Grid>
          <Grid item className={classes.submitBtnContainer}>
            <Button
              type="submit"
              id="submit-btn"
              className={
                title?.includes('Archive')
                  ? classes.archiveBtn
                  : classes.submitBtn
              }
              onClick={deleteHandler}>
              {title}
            </Button>
          </Grid>
        </Grid>
      </ModalActions>
    </Modal>
  );
};

export default DeleteModalLayout;

const useStyles = makeStyles(() => ({
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
    width: '400px !important',
    fontFamily: 'Roboto, sans-serif !important',
    maxHeight: '100vh',
    overflowY: 'auto',
    [theme.breakpoints.down('400')]: {
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
    backgroundColor: '#d9001b !important',
    color: 'white !important',
    '&:hover': {
      backgroundColor: '#b52234 !important',
      color: 'white !important',
    },
  },
  archiveBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: '#DD6336 !important',
    color: 'white !important',
    '&:hover': {
      backgroundColor: 'rgba(199,78,26,1) !important',
      color: 'white !important',
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
