import {Divider, IconButton} from '@mui/material';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
} from 'glide-design-system';
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import {handleDiscardModal} from './formSlice';
import warningIcon from '../../assets/icon/warning.svg';
import {traceSpan} from '../../helpers/tracing';

/**
 * Confirmation modal to exit the form builder
 * @param {*} open status of modal is open or not boolean
 * @returns
 */
const DiscardModal = ({open}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  /**
   * Closes dicard modal
   */
  const closeModal = () => {
    dispatch(handleDiscardModal());
  };

  return (
    <Modal open={open} onClose={closeModal} id="modal">
      <ModalTitle id="modal-title">
        <Text type="h2">Discard Changes</Text>
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
            Are you sure you want to discard the changes?
          </Text>
          <Text style={{fontSize: '14px', fontWeight: '400', color: '#555555'}}>
            (Changes will not be saved and will be lost.)
          </Text>
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
          icon={<span className="material-symbols-outlined">stop_circle</span>}
          iconPosition="start"
          id="submit-btn"
          style={{fontSize: '16px'}}
          onClick={() => {
            // traceSpan('Discard Form', () => {
            dispatch(handleDiscardModal());
            navigate('/forms');
            // });
          }}>
          Discard
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default DiscardModal;

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#DD6336 !important',
    '&:hover': {
      backgroundColor: 'rgba(199,78,26,1) !important',
    },
  },
}));
