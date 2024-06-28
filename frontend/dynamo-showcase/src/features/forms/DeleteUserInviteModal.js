import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {Alert, Divider, IconButton} from '@mui/material';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
  Snackbar,
} from 'glide-design-system';
import CloseIcon from '@mui/icons-material/Close';
import warningIcon from '../../assets/icon/warning.svg';
import BackendService from '../../service/BackendService';

export default function DeleteUserInviteModal({
  open,
  getData,
  closeModal,
  currentUserInviteData,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  //   const formData = useSelector(getFormData);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [severity, setSeverity] = useState(null);

  /**
   * Deletes the user invite when submit btn is clicked
   */
  const deleteUserInvite = () => {
    BackendService.deletUserInvite(currentUserInviteData?.id)
      .then(() => {
        setNotification(true);
        setSeverity('success');
        setNotificationMessage('User Invite deleted successfully!');
        getData();
        closeModal();
      })
      .catch(err => {
        setNotification(true);
        setSeverity('error');
        setNotificationMessage(err?.message);
      });
  };

  return (
    <>
      {/* <Snackbar
        autoHideDuration={3000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={notification}
        onClose={() => setNotification(false)}>
        <Alert
          id="alert"
          severity={severity}
          onClose={() => setNotification(false)}>
          {notificationMessage}
        </Alert>
      </Snackbar> */}
      {notification && (
        <Snackbar
          open={notification}
          message={notificationMessage}
          type={severity}
          onClose={() => setNotification(false)}
        />
      )}
      <Modal open={open} onClose={closeModal} id="modal">
        <ModalTitle id="modal-title">
          <Text type="h2">Delete User Invite</Text>
          <IconButton
            onClick={closeModal}
            size="small"
            style={{padding: 0}}
            id="close-icon">
            <CloseIcon />
          </IconButton>
        </ModalTitle>
        <ModalContent
          id="modal-content"
          style={{display: 'flex', justifyContent: 'center', padding: '25px'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
            }}>
            <img src={warningIcon} alt="Warning" height="25px" width="29px" />
            <Text style={{fontSize: '16px', fontWeight: '400'}}>
              Are you sure you want to delete this user invite?
            </Text>
            <Text>(The action cannot be undone)</Text>
          </div>
        </ModalContent>
        <Divider />
        <ModalActions>
          <Button
            icon={<span className="material-symbols-outlined">close</span>}
            iconPosition="start"
            color="secondary"
            onClick={closeModal}
            id="cancel-btn"
            style={{marginRight: '15px', fontSize: '16px'}}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            icon={
              <span
                style={{color: 'white', marginRight: '8px'}}
                className="material-symbols-outlined">
                delete
              </span>
            }
            style={{fontSize: '16px'}}
            iconPosition="start"
            id="submit-btn"
            onClick={() => {
              // traceSpan('Archive Form', async () => {
              deleteUserInvite();
              // });
            }}>
            Delete
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: 'rgba(217, 0, 27, 1) !important',
    '&:hover': {
      backgroundColor: 'rgba(199,78,27,1) !important',
    },
  },
}));
