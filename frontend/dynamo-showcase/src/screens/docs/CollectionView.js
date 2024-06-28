import React, {useEffect, useRef, useState} from 'react';
import {Text, Divider, TextField, Button, Snackbar} from 'glide-design-system';
import {Menu, MenuItem, Backdrop, CircularProgress} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import BackendService from '../../service/BackendService';
import {docsSliceActions} from './DocsSlice';
import DeleteModalLayout from '../../components/docsComponent/DeleteModalLayout';
import SelectedTab from '../../components/docsComponent/SelectedTab';
import DocDetail from '../../components/docDetail/DocDetail';
import HistoryDrawer from '../../components/docsComponent/HistoryDrawer';

const CollectionView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const {id} = useParams();

  const ref = useRef(null);
  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [selectedId, setSelectedId] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [loader, setLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [description, setDescription] = useState('');
  const open = Boolean(anchorEl);

  const getCollection = useSelector(state => state.docs.getCollectionData);

  const handleOpenMenu = (e, data) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(data);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const retrieveData = () => {
    BackendService.getCollection(id, searchValue)
      .then(res => {
        setDescription(
          res?.data?.data?.[0]?.description
            ? res?.data?.data?.[0]?.description
            : '',
        );
        setData(res?.data?.data);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
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
          retrieveData();
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
          retrieveData();
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

  const createDocument = () => {
    const createData = {
      collectionId: id,
      parentId: '',
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

  const editDocumentIsForked = id => {
    BackendService.editForkedOrPublishedDocument(id)
      .then(res => {
        if (res?.data?.forked) {
          navigate(`/docs/edit/${res?.data?.documentDto?.uniqueId}`);
        } else {
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage(
            `${res?.data?.documentDto?.createdUserFirstName} ${res?.data?.documentDto?.createdUserLastName} is already editing this document`,
          );
        }
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  const handleDescription = e => {
    setDescription(e.target.value);
    const updateData = {
      ...data?.[0],
      description: e.target.value,
    };
    BackendService.editCollection(updateData).catch(err => {
      setNotification(true);
      setNotificationError(true);
      setNotificationMessage('Failed to Update Description.');
    });
  };

  const EditDocument = () => {
    handleClose();
    if (selectedId?.status === 'published' || selectedId?.status === 'forked') {
      editDocumentIsForked(selectedId?.uniqueId);
    } else {
      navigate(`/docs/edit/${selectedId?.uniqueId}`);
    }
  };

  useEffect(() => {
    retrieveData();
  }, [id, getCollection, searchValue]);

  return (
    <div
      style={{
        display: 'flex',
        padding: '24px',
        marginBottom: 'auto',
        width: '100%',
        flexWrap: 'wrap',
        gap: '80px',
      }}>
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
      <div className={classes.docTabs}>
        <SelectedTab name={'Documents'} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          maxWidth: '100%',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
          <TextField
            style={{maxWidth: '100%'}}
            placeholder={'Search files'}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Button
            type="submit"
            icon={<span className="material-symbols-outlined">add</span>}
            id="submit-btn"
            color="primary"
            className={classes.submitBtn}
            onClick={createDocument}>
            New Document
          </Button>
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
          }}>
          <div style={{width: '100%'}}>
            <Text
              style={{
                color: 'rgba(0, 0, 0, 0.99)',
                fontSize: '36px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '32px',
                  color: 'rgb(27, 55, 100)',
                }}>
                category
              </span>{' '}
              {data?.[0]?.name ? data?.[0]?.name : ''}
            </Text>
            <TextField
              style={{
                height: '40px',
                width: '100%',
                border: 'none',
                paddingLeft: '0px',
                marginBottom: '12px',
              }}
              textFieldStyle={{fontSize: '20px'}}
              contentEditable
              placeholder="Add Description"
              onChange={handleDescription}
              value={description}
              icon={
                <span
                  style={{
                    fontSize: '20px',
                    color: 'rgb(27, 55, 100)',
                  }}
                  className="material-symbols-outlined">
                  edit
                </span>
              }
            />
            {data?.[0]?.documentList?.map((doc, i) => {
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
              <MenuItem onClick={EditDocument}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  edit
                </span>
                Edit
              </MenuItem>
              <Divider className={classes.menuDivider} />
              <MenuItem onClick={createDocument}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  note_stack_add
                </span>
                New Document
              </MenuItem>
              <Divider className={classes.menuDivider} />
              <MenuItem onClick={() => ref.current.click()}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  download
                </span>
                Import Document
              </MenuItem>
              <Divider className={classes.menuDivider} />
              <MenuItem onClick={downloadDocument}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  download
                </span>
                Download
              </MenuItem>
              <Divider className={classes.menuDivider} />
              <MenuItem
                onClick={() => {
                  setDeleteTitle('Archive');
                  setOpenDeleteModal(true);
                  handleClose();
                }}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
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
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
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
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  delete
                </span>
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionView;

const useStyles = makeStyles(theme => ({
  menuIcon: {
    paddingRight: '12px',
  },
  menuDivider: {
    marginBlock: '4px',
  },
  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: 'rgb(27, 55, 100) !important',
    '&:hover': {
      backgroundColor: 'rgb(27, 55, 100) !important',
    },
  },
  docTabs: {
    width: '200px',
    borderRight: '2px solid #d7d7d7',
    height: '110px',
    maxWidth: '100%',
    position: 'sticky',
    top: '69px',
    [theme.breakpoints.down('1200')]: {
      display: 'none',
    },
  },
}));
