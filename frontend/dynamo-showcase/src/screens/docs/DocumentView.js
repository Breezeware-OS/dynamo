import React, {useState, useEffect, useRef} from 'react';
import {Text, Divider, TextField, Button, Snackbar} from 'glide-design-system';
import {Menu, MenuItem, Backdrop, CircularProgress} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import BackendService from '../../service/BackendService';
import SelectedTab from '../../components/docsComponent/SelectedTab';
import DeleteModalLayout from '../../components/docsComponent/DeleteModalLayout';
import DocDetail from '../../components/docDetail/DocDetail';
import {docsSliceActions} from './DocsSlice';
import HistoryDrawer from '../../components/docsComponent/HistoryDrawer';
import MDViewer from '../../components/docsComponent/MDViewer';

const DocumentView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const {id} = useParams();

  const ref = useRef(null);

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
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const getDocument = useSelector(state => state.docs.getDocumentData);

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
    BackendService.getIndivdualDocument(id, searchValue)
      .then(res => {
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
          if (selectedId?.uniqueId === data?.[0]?.uniqueId) {
            setTimeout(() => {
              navigate('/docs/home');
            }, 200);
          }
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
          if (selectedId?.uniqueId === data?.[0]?.uniqueId) {
            setTimeout(() => {
              navigate('/docs/home');
            }, 200);
          }
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
        if (selectedId?.uniqueId === data?.[0]?.uniqueId) {
          retrieveData();
        }
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
      collectionId: data?.[0]?.collectionId,
      parentId: id,
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

  const editParentDocument = () => {
    if (data?.[0]?.status === 'published' || data?.[0]?.status === 'forked') {
      editDocumentIsForked(id);
    } else {
      navigate(`/docs/edit/${data?.[0]?.uniqueId}`);
    }
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
  }, [id, getDocument, searchValue]);

  return (
    <div
      style={{
        display: 'flex',
        padding: '24px',
        marginBottom: 'auto',
        width: 'calc(100% - 260px)',
        flexWrap: 'wrap',
        gap: '80px',
        flex: '1 1 0',
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
          {deleteTitle === 'delete' ? 'delete' : 'archive'} this{' '}
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
          {/* {data?.[0]?.status !== 'archived' &&
            data?.[0]?.status !== 'deleted' &&
            data?.[0]?.status !== 'drafted' && (
              <TextField
                style={{maxWidth: '100%'}}
                placeholder={'Search files'}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            )} */}
          {data?.[0]?.status !== 'archived' &&
            data?.[0]?.status !== 'deleted' && (
              <Button
                type="draft"
                id="draft-btn"
                color="primary"
                variant="outlined"
                className={classes.outlinedBtn}
                onClick={editParentDocument}>
                Edit
              </Button>
            )}
          {(data?.[0]?.status === 'published' ||
            data?.[0]?.status === 'forked') && (
            <Button
              type="submit"
              icon={<span className="material-symbols-outlined">add</span>}
              id="submit-btn"
              color="primary"
              className={classes.submitBtn}
              onClick={createDocument}>
              New Document
            </Button>
          )}
          <span
            className="material-symbols-outlined"
            style={{height: 'fit-content', cursor: 'pointer', fontSize: '36px'}}
            onClick={e => {
              handleOpenMenu(e, data?.[0]);
            }}>
            more_horiz
          </span>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '900px',
            marginTop: '16px',
          }}>
          <div style={{width: '100%'}}>
            <MDViewer data={data} />
            <Divider
              style={{marginBlock: '16px'}}
              className={classes.menuDivider}
            />
            {data?.[0]?.children?.map((doc, i) => {
              if (doc?.status === 'published') {
                return (
                  <div key={i} style={{marginTop: '16px'}}>
                    <DocDetail
                      data={doc}
                      handleOpenMenu={handleOpenMenu}
                      docClickHandler={docClickHandler}
                    />
                    <Divider
                      style={{marginBlock: '16px'}}
                      className={classes.menuDivider}
                    />
                  </div>
                );
              }
            })}
            {/* {(!data || data?.length === 0) && (
              <Text
                style={{
                  color: 'rgba(0, 0, 0, 0.99)',
                  fontSize: '16px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}>
                No Nested Docs to Show
              </Text>
            )} */}
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
              {(data?.[0]?.status === 'published' ||
                data?.[0]?.status === 'forked' ||
                data?.[0]?.status === 'drafted') && (
                <>
                  <MenuItem onClick={EditDocument}>
                    <span
                      className={`material-symbols-outlined ${classes.menuIcon}`}>
                      edit
                    </span>
                    Edit
                  </MenuItem>
                  <Divider className={classes.menuDivider} />
                </>
              )}
              {(data?.[0]?.status === 'archived' ||
                data?.[0]?.status === 'deleted') && (
                <>
                  <MenuItem>
                    <span
                      className={`material-symbols-outlined ${classes.menuIcon}`}>
                      unarchive
                    </span>
                    Restore
                  </MenuItem>
                  <Divider className={classes.menuDivider} />
                </>
              )}
              <MenuItem onClick={downloadDocument}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  download
                </span>
                Download
              </MenuItem>
              <Divider className={classes.menuDivider} />
              {(data?.[0]?.status === 'published' ||
                data?.[0]?.status === 'forked') && (
                <>
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
                </>
              )}
              {(data?.[0]?.status === 'published' ||
                data?.[0]?.status === 'forked' ||
                data?.[0]?.status === 'drafted') && (
                <>
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
                </>
              )}
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

export default DocumentView;

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
  outlinedBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    color: 'rgb(27, 55, 100) !important',
    borderColor: 'rgb(27, 55, 100) !important',
    '&:hover': {
      backgroundColor: '#fff !important',
      color: 'rgb(27, 55, 100) !important',
    },
  },
  docTabs: {
    width: '200px',
    borderRight: '2px solid #d7d7d7',
    height: '110px',
    maxWidth: '100%',
    position: 'sticky',
    top: '69px',
    [theme.breakpoints.down('1500')]: {
      display: 'none',
    },
  },
}));
