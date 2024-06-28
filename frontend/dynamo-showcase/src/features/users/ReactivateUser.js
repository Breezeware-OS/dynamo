import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
} from 'glide-design-system';
import {Divider, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import React from 'react';
import warningIcon from '../../assets/icon/warning.svg';
import reactivateIcon from '../../assets/icon/reactivateIcon.svg';
import {
  enableUser,
  fetchUser,
  handleReactivateModal,
  initialValue,
  page,
  reactivateModal,
} from './userSlice';
import {traceSpan} from '../../helpers/tracing';

/**
 * Reactivate user component
 * @returns Modal with reactivate user func
 */
const ReactivateUser = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const pageNo = useSelector(page);
  const open = useSelector(reactivateModal);
  const initialData = useSelector(initialValue);

  /**
   * closes reactivate modal
   */
  const closeModal = () => {
    dispatch(handleReactivateModal());
  };

  /**
   * Reactivate user function is executed with user id as props.
   * To display updated status of user fetch user function is called with current pageNo.
   */
  const activateUser = async () => {
    closeModal();
    // traceSpan('activateUser', async () => {
    await dispatch(enableUser(initialData));
    dispatch(fetchUser({pageNo}));
    // });
  };

  return (
    <Modal open={open} onClose={closeModal} id="modal">
      <ModalTitle
        id="modal-title"
        style={{
          display: 'block',
          backgroundColor: 'white',
          padding: '10px 24px',
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
          <Text type="h2">Reactivate User</Text>
          <IconButton onClick={closeModal} style={{padding: 0}} id="close-icon">
            <CloseIcon />
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
          justifyContent: 'center',
          padding: '24px',
          paddingBottom: '16px',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            // alignItems: 'center',
            gap: 5,
          }}>
          <Text style={{fontSize: '16px', fontWeight: '400'}}>
            Are you sure you want to reactivate this user?
          </Text>
          <Text style={{fontSize: '14px', fontWeight: '400', color: '#555555'}}>
            (The user will be able to access the application)
          </Text>
        </div>
      </ModalContent>
      <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
        <Button
          // icon={<span className="material-symbols-outlined">close</span>}
          // iconPosition="start"
          variant="outlined"
          color="secondary"
          onClick={closeModal}
          id="cancel-btn"
          style={{marginRight: '15px'}}>
          Cancel
        </Button>
        <Button
          id="submit-btn"
          className={classes.button}
          // icon={<img src={reactivateIcon} alt="" />}
          // iconPosition="start"
          onClick={activateUser}>
          Reactivate
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default ReactivateUser;

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#DD6336 !important',
    '&:hover': {
      backgroundColor: 'rgba(199,78,26,1) !important',
    },
  },
}));
