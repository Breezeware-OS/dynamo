import React, {useRef, useState} from 'react';
import {
  Backdrop,
  CircularProgress,
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
import {useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import BackendService from '../../service/BackendService';

const UploadDocumentModal = ({open, cancelHandler, updateHandler}) => {
  const classes = useStyles();
  const {id} = useParams();

  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [fileSizeExceeded, setFileSizeExceeded] = useState([]);

  const handleCancel = () => {
    setFiles([]);
    setFileSizeExceeded([]);
    cancelHandler();
    inputRef.current.value = null;
  };
  const fileUpload = e => {
    const uploadedFiles = Array.from(e.target.files)?.filter(data => {
      if (
        (data?.type || data?.name?.includes('.')) &&
        data?.size / (1024 * 1024) <= 100
      )
        return true;
    });
    const exceededFiles = Array.from(e.target.files)?.filter(data => {
      if (data?.size / (1024 * 1024) > 100) return true;
    });
    setFileSizeExceeded([...fileSizeExceeded, ...exceededFiles]);
    setFiles([...files, ...uploadedFiles]);
  };

  const fileUploadDrop = e => {
    e.preventDefault();
    const uploadedFiles = Array.from(e.dataTransfer.files)?.filter(data => {
      if (
        (data?.type || data?.name?.includes('.')) &&
        data?.size / (1024 * 1024) <= 100
      )
        return true;
    });
    const exceededFiles = Array.from(e.dataTransfer.files)?.filter(data => {
      if (data?.size / (1024 * 1024) > 100) return true;
    });
    setFileSizeExceeded([...fileSizeExceeded, ...exceededFiles]);
    setFiles([...files, ...uploadedFiles]);
  };

  const uploadDocuments = () => {
    setLoader(true);
    const formData = new FormData();
    files?.forEach(file => {
      formData.append('knowledge-artifacts', file);
    });
    BackendService.uploadModelDocument(formData, id)
      ?.then(res => {
        setNotification(true);
        setNotificationError(false);
        setNotificationMessage('Documents Uploaded Successfully.');
        setLoader(false);
        handleCancel();
        updateHandler();
      })
      .catch(err => {
        setLoader(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to upload document.');
      });
  };

  return (
    <>
      {notification && (
        <Snackbar
          id="alert-message"
          style={{zIndex: '1'}}
          open
          message={notificationMessage}
          type={notificationError ? 'error' : 'success'}
          autoHideDuration={5000}
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
        <div id="form" style={{padding: '16px', paddingTop: '10px'}}>
          <ModalTitle
            style={{
              padding: '0px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #d7d7d7',
            }}>
            <Grid item container xs={12} justifyContent="space-between">
              <Typography className={classes.header}>File Uploader</Typography>
              <IconButton
                sx={{padding: 0, float: 'right'}}
                id="cancel-icon"
                onClick={handleCancel}>
                <span className="material-symbols-outlined">close</span>
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
              Upload relevant documents for training.
            </Typography>
            <Grid item xs={12} display="flex" flexDirection="column">
              <input
                name="file"
                ref={inputRef}
                type="file"
                accept={'application/*,text/*'}
                multiple
                hidden
                onChange={fileUpload}
              />
              <div
                className={classes.dropArea}
                onClick={() => inputRef.current.click()}
                onDrop={fileUploadDrop}
                onDragOver={event => event.preventDefault()}>
                <div className={classes.dropAreaIcon}>
                  <span
                    style={{color: '#1b3764', fontSize: '50px'}}
                    class="material-symbols-outlined">
                    cloud_upload
                  </span>
                </div>
                <div className={classes.dropAreaContent}>
                  Drag and drop your file here or{' '}
                  <span style={{color: '#1b3764', cursor: 'pointer'}}>
                    Choose File{' '}
                  </span>
                </div>
                <Typography
                  style={{
                    color: '#9b9b9b',
                    fontSize: '16px',
                    fontFamily: '"Roboto", sans-serif',
                    textAlign: 'center',
                  }}>
                  (The hard limit is 100MB per file.)
                </Typography>
              </div>
              {files?.length > 0 && (
                <div className={classes.selectedFiles}>
                  <span
                    style={{
                      fontSize: '18px',
                      borderRadius: '50px',
                      padding: '4px',
                      border: '1px solid #d7d7d7',
                      marginRight: '8px',
                    }}
                    class="material-symbols-outlined">
                    description
                  </span>
                  {files?.length} file(s) has been selected for upload.
                </div>
              )}
              {fileSizeExceeded?.map((data, i) => {
                return (
                  <div key={`exc${i}`} className={classes.exceededFiles}>
                    <div>{data?.name} is too large to upload</div>
                  </div>
                );
              })}
            </Grid>
          </ModalContent>
          <ModalActions style={{padding: '10px 0px', paddingBottom: '2px'}}>
            {files?.length > 0 && (
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
                    onClick={() => uploadDocuments()}
                    type="submit"
                    id="submit-btn"
                    className={classes.submitBtn}>
                    Upload
                  </Button>
                </Grid>
              </Grid>
            )}
          </ModalActions>
        </div>
      </Modal>
    </>
  );
};

export default UploadDocumentModal;

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
    width: '820px !important',
    fontFamily: 'Roboto, sans-serif !important',
    maxHeight: '100vh',
    overflowY: 'auto',
    [theme.breakpoints.down('820')]: {
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
  dropArea: {
    border: '1px solid #d7d7d7',
    borderRadius: '5px',
    width: '100%',
    minHeight: '224px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  dropAreaIcon: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  dropAreaContent: {
    color: '#999999',
    fontSize: '18px',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedFiles: {
    border: '1px solid #d7d7d7',
    borderRadius: '5px',
    color: '#5f6368',
    fontSize: '18px',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif',
    fontWeight: '500',
    padding: '14px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  exceededFiles: {
    border: '1px solid #d7d7d7',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '18px',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif',
    fontWeight: '500',
    padding: '14px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgb(237, 98, 98)',
    width: '100%',
  },
}));
