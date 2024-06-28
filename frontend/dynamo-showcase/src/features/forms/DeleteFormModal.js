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
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import warningIcon from '../../assets/icon/warning.svg';
import {getFormData, handleDeleteModal} from './formSlice';
import BackendService from '../../service/BackendService';
import {logError, loginfo, traceSpan} from '../../helpers/tracing';

/**
 * Confirmation modal for deleting forms
 * @param {*} open status of the form open or closed boolean
 * @param {*} getData is a function passed from FormList to execute the function after Deletion is complete to update the status of the form
 * @returns modal to delete Form
 */
const DeleteFormModal = ({open, getData}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const formData = useSelector(getFormData);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [severity, setSeverity] = useState(null);

  /**
   * Closes delete modal
   */
  const closeModal = () => {
    dispatch(handleDeleteModal());
  };

  /**
   * Deletes the form when submit btn is clicked
   */
  const deleteForm = () => {
    BackendService.archiveForm({id: formData?.id})
      .then(res => {
        // loginfo('Delete Form Success', res);

        closeModal();
        setNotification(true);
        setSeverity('success');
        getData();
        setNotificationMessage('Form Archived Successfully.');
      })
      .catch(err => {
        // logError('Delete Form err', err);
        closeModal();
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
      <Snackbar
        open={notification}
        message={notificationMessage}
        type={severity}
        onClose={() => setNotification(false)}
      />
      <Modal open={open} onClose={closeModal} id="modal">
        <ModalTitle
          id="modal-title"
          style={{
            backgroundColor: 'white',
            display: 'block',
            padding: '10px 24px',
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
              Archive Form
            </Text>
            <IconButton
              onClick={closeModal}
              size="small"
              style={{padding: 0}}
              id="close-icon">
              <CloseIcon sx={{color: '#999999'}} />
            </IconButton>
          </div>
          <div style={{paddingTop: '6px'}}>
            <Divider />
          </div>
        </ModalTitle>
        <ModalContent
          id="modal-content"
          style={{
            display: 'flex',
            // justifyContent: 'center',
            padding: '24px',
            paddingBottom: '16px',
          }}>
          <div
            style={{
              display: 'flex',
              // justifyContent: 'center',
              flexDirection: 'column',
              // alignItems: 'center',
              gap: 5,
            }}>
            <Text
              style={{
                fontSize: '16px',
                fontWeight: '400',
                color: 'rgb(155, 155, 155)',
              }}>
              Are you sure you want to archive this form?
            </Text>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: '400',
                paddingTop: '6px',
                color: '#333333',
              }}>
              (You cannot undo this action)
            </Text>
          </div>
        </ModalContent>
        <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
          <Button
            // icon={<span className="material-symbols-outlined">close</span>}
            // iconPosition="start"
            className={classes.canelButton}
            color="secondary"
            variant="outlined"
            onClick={closeModal}
            id="cancel-btn"
            style={{marginRight: '15px', fontSize: '16px'}}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            // icon={
            //   <span
            //     style={{color: 'white', marginRight: '8px'}}
            //     className="material-symbols-outlined">
            //     archive
            //   </span>
            // }
            // style={{fontSize: '16px'}}
            // iconPosition="start"
            id="submit-btn"
            onClick={() => {
              // traceSpan('Archive Form', async () => {
              deleteForm();
              // });
            }}>
            Archive
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
};

export default DeleteFormModal;

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#DD6336 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: 'rgba(199,78,26,1) !important',
    },
  },
  canelButton: {
    minWidth: 'auto',
  },
}));
