import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {Alert, Divider, IconButton, Snackbar} from '@mui/material';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
} from 'glide-design-system';
import CloseIcon from '@mui/icons-material/Close';
import warningIcon from '../../assets/icon/warning.svg';
import BackendService from '../../service/BackendService';

export default function DeleteFormElementModal({
  open,
  closeModal,
  currentFormElement,
  deletComponentHandler,
}) {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={closeModal} id="modal">
      <ModalTitle
        id="modal-title"
        style={{
          backgroundColor: 'white',
          display: 'block',
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
          <Text type="h2">Delete Element</Text>
          <IconButton
            onClick={closeModal}
            size="small"
            style={{padding: 0}}
            id="close-icon">
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
          padding: '16px 24px',
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
            Are you sure you want to delete this element?
          </Text>
          <Text>(You cannot undo this action)</Text>
        </div>
      </ModalContent>
      <ModalActions>
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
          //     delete
          //   </span>
          // }
          // iconPosition="start"
          style={{fontSize: '16px'}}
          id="submit-btn"
          onClick={() => {
            deletComponentHandler(currentFormElement?.key);
            closeModal();
          }}>
          Delete
        </Button>
      </ModalActions>
    </Modal>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    minWidth: 'auto',
    backgroundColor: '#d9001b !important',
    color: 'white !important',
    '&:hover': {
      backgroundColor: '#b52234 !important',
      color: 'white !important',
    },
  },
  canelButton: {
    minWidth: 'auto',
  },
}));
