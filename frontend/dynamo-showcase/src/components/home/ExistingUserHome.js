import React, {useRef, useState} from 'react';
import {Text, Divider, Snackbar} from 'glide-design-system';
import {Menu, MenuItem, Backdrop, CircularProgress} from '@mui/material';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import DocDetail from '../docDetail/DocDetail';
import DeleteModalLayout from '../docsComponent/DeleteModalLayout';
import BackendService from '../../service/BackendService';
import {docsSliceActions} from '../../screens/docs/DocsSlice';
import HistoryDrawer from '../docsComponent/HistoryDrawer';

const ExistingUserHome = ({data}) => {
  const classes = useStyles();

  const ref = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [selectedId, setSelectedId] = useState();
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [loader, setLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (e, data) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(data);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteHandler = () => {
    setLoader(true);
    if (deleteTitle === 'Archive') {
      BackendService.archiveDocument(selectedId?.uniqueId)
        ?.then(res => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Document archived successfully');
          setLoader(false);
          setOpenDeleteModal(false);
          dispatch(docsSliceActions.getData());
        })
        .catch(err => {
          setLoader(false);
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to archive document');
        });
    } else {
      BackendService.deleteDocument(selectedId?.uniqueId)
        ?.then(res => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Document deleted successfully');
          setLoader(false);
          setOpenDeleteModal(false);
          dispatch(docsSliceActions.getData());
        })
        .catch(err => {
          setLoader(false);
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to delete document');
        });
    }
  };

  const downloadDocument = () => {
    BackendService.downloadDocument(selectedId?.uniqueId)
      .then(res => {
        const file = new Blob([res.data], {type: 'text/markdown'});
        const fileURL = URL.createObjectURL(file);
        const contentDisposition = res.headers['content-disposition'];
        const match = contentDisposition.match(/filename=(.*\.md)/);
        const filename = match ? match[1] : 'readme.md';
        const link = document.createElement('a');
        link.href = fileURL; // Update this with the correct server endpoint
        link.target = '_blank'; // Open in a new tab
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to download Document');
      });
    handleClose();
  };

  const uploadMd = e => {
    let formData = new FormData();
    formData.append('file', e?.target?.files?.[0]);
    handleClose();
    BackendService.uploadDocument(
      selectedId?.collectionId,
      selectedId?.uniqueId,
      formData,
    )
      .then(res => {
        ref.current.value = null;
        dispatch(docsSliceActions.getData());
      })
      .catch(err => {
        ref.current.value = null;
        setNotification(true);
        setNotificationError(true);
        if (
          err?.response?.data?.details?.[0]?.includes(
            'Uploaded file Title must be less than 100 characters',
          )
        ) {
          setNotificationMessage(
            'Uploaded file Title must be less than 100 characters',
          );
        } else if (
          err?.response?.data?.details?.[0]?.includes('File is Empty')
        ) {
          setNotificationMessage('File is Empty');
        } else {
          setNotificationMessage('Failed to upload document');
        }
      });
  };

  const docClickHandler = data => {
    navigate(`/docs/${data?.uniqueId}`);
  };

  const editDocumentHandler = () => {
    handleClose();
    BackendService.editForkedOrPublishedDocument(selectedId?.uniqueId)
      .then(res => {
        if (res?.data?.forked) {
          navigate(`/docs/edit/${res?.data?.documentDto?.uniqueId}`);
        } else {
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Someone is already editing this document');
        }
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  const createDocument = () => {
    const createData = {
      collectionId: selectedId?.collectionId,
      parentId: selectedId?.uniqueId,
    };
    BackendService.createDocument(createData)
      .then(res => {
        navigate(`/docs/create/${res?.data?.uniqueId}`);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  return (
    <div style={{width: '100%'}}>
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
      <HistoryDrawer
        open={openDrawer}
        handleClose={() => setOpenDrawer(false)}
        data={selectedId}
      />
      <DeleteModalLayout
        open={openDeleteModal}
        cancelHandler={() => setOpenDeleteModal(false)}
        title={deleteTitle}
        deleteHandler={deleteHandler}>
        <Text style={{fontSize: '16px', paddingTop: '16px'}}>
          Are you sure you want to{' '}
          {deleteTitle === 'Delete' ? 'delete' : 'archive'} this{' '}
          {selectedId?.collectionId ? 'document' : 'collection'}?{' '}
        </Text>
        {deleteTitle === 'Delete' ? (
          <>
            <Text style={{fontSize: '12px'}}>
              - This action will also delete the nested documents
            </Text>
            <Text style={{fontSize: '12px'}}>
              - The document will be moved to trash, where you can restore the
              document within 30 days
            </Text>
          </>
        ) : (
          <Text style={{fontSize: '12px'}}>
            - This action will move all associated documents to archive
          </Text>
        )}
      </DeleteModalLayout>
      {/* <Text
        style={{
          color: 'rgba(0, 0, 0, 0.99)',
          fontSize: '36px',
          fontWeight: '500',
          marginBottom: '16px',
        }}>
        Home
      </Text> */}
      {data?.content?.map((doc, i) => {
        return (
          <>
            <DocDetail
              data={doc}
              handleOpenMenu={handleOpenMenu}
              docClickHandler={docClickHandler}
            />
            <Divider
              style={{marginBlock: '16px'}}
              className={classes.menuDivider}
            />
          </>
        );
      })}
      <input
        type="file"
        accept=".md"
        style={{display: 'none'}}
        ref={ref}
        onChange={uploadMd}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          style: {backgroundColor: '#fff', color: '#333'},
        }}>
        <MenuItem onClick={editDocumentHandler}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            edit
          </span>
          Edit
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem onClick={createDocument}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            note_stack_add
          </span>
          New Document
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem onClick={() => ref.current.click()}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            download
          </span>
          Import Document
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem onClick={downloadDocument}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            download
          </span>
          Download Document
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem
          onClick={() => {
            setDeleteTitle('Archive');
            setOpenDeleteModal(true);
            handleClose();
          }}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            archive
          </span>
          Archive
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenDrawer(true);
          }}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            history
          </span>
          History
        </MenuItem>
        <Divider className={classes.menuDivider} />
        <MenuItem
          onClick={() => {
            setDeleteTitle('Delete');
            setOpenDeleteModal(true);
            handleClose();
          }}>
          <span className={`material-symbols-outlined ${classes.menuIcon}`}>
            delete
          </span>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ExistingUserHome;

const useStyles = makeStyles(theme => ({
  menuIcon: {
    paddingRight: '12px',
  },
  menuDivider: {
    marginBlock: '4px',
  },
}));
