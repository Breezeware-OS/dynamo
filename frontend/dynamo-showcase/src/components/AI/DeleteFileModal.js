import React from 'react';
import {makeStyles} from '@material-ui/core';
import {Grid, Typography, IconButton} from '@mui/material';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
} from 'glide-design-system';

export default function DeleteFileModal({open, cancelHandler, deleteHandler}) {
  const classes = useStyles();

  const handleCancel = () => {
    cancelHandler();
  };

  return (
    <Modal open={open} onClose={handleCancel} id="modal">
      <div id="form" style={{padding: '16px', paddingTop: '10px'}}>
        <ModalTitle
          style={{
            padding: '0px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #d7d7d7',
          }}>
          <Grid item container xs={12} justifyContent="space-between">
            <Typography className={classes.header}>Remove Document</Typography>
            <IconButton
              sx={{padding: 0, float: 'right'}}
              id="cancel-icon"
              onClick={handleCancel}>
              <span class="material-symbols-outlined">close</span>
            </IconButton>
          </Grid>
        </ModalTitle>
        <ModalContent
          id="modal-content"
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 0px',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 5,
            }}>
            <Text style={{fontSize: '16px', fontWeight: '400'}}>
              Are you sure you want to remove this document?
            </Text>
            <Text>(You cannot undo this action)</Text>
          </div>
        </ModalContent>
        <ModalActions style={{paddingBottom: '0px'}}>
          <Button
            className={classes.canelButton}
            color="secondary"
            variant="outlined"
            onClick={handleCancel}
            id="cancel-btn"
            style={{marginRight: '15px', fontSize: '16px'}}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            style={{fontSize: '16px'}}
            id="delete-btn"
            onClick={deleteHandler}>
            Remove
          </Button>
        </ModalActions>
      </div>
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
}));
