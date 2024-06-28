import React, {useEffect, useRef, useState} from 'react';
import {Text, Divider, TextField, Snackbar, Drawer} from 'glide-design-system';
import {useNavigate, useLocation, useParams} from 'react-router';
import {makeStyles} from '@material-ui/core';
import {TreeItem, SimpleTreeView} from '@mui/x-tree-view';
import {Menu, MenuItem, Backdrop, CircularProgress} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import NavMenu from './NavMenu';
import TreeItemRenderer from './TreeItemRenderer';
import CreateCollectionModal from './CreateCollectionModal';
import BackendService from '../../service/BackendService';
import DeleteModalLayout from '../docsComponent/DeleteModalLayout';
import {docsSliceActions} from '../../screens/docs/DocsSlice';
import HistoryDrawer from '../docsComponent/HistoryDrawer';

const MobileDrawer = ({openMobileDrawer, handleCloseMobileDrawer}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = useParams();

  const dispatch = useDispatch();

  const ref = useRef(null);

  const [data, setData] = useState([]);
  const [page, setPage] = useState('home');
  const [lastSelectedCollectionItem, setLastSelectedCollectionItem] =
    useState('Collections');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [loader, setLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const open = Boolean(anchorEl);

  const getData = useSelector(state => state.docs.getData);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setLastSelectedCollectionItem(itemId);
      handleCloseMobileDrawer();
    }
  };

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
        ?.then(() => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Document archived successfully');
          setLoader(false);
          setOpenDeleteModal(false);
          dispatch(docsSliceActions.getData());
        })
        .catch(() => {
          setLoader(false);
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to archive document');
        });
    } else if (selectedId?.collectionId) {
      BackendService.deleteDocument(selectedId?.uniqueId)
        ?.then(() => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Document deleted successfully');
          setLoader(false);
          setOpenDeleteModal(false);
          dispatch(docsSliceActions.getData());
        })
        .catch(() => {
          setLoader(false);
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to delete document');
        });
    } else {
      BackendService.deleteCollections(selectedId?.uniqueId)
        ?.then(() => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Collection deleted successfully');
          setLoader(false);
          setOpenDeleteModal(false);
          dispatch(docsSliceActions.getData());
          if (!window.location.pathname?.includes('home')) {
            navigate('/docs/home');
          }
        })
        .catch(() => {
          setLoader(false);
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to delete collection');
        });
    }
  };

  const uploadMd = e => {
    let formData = new FormData();
    formData.append('file', e?.target?.files?.[0]);
    handleClose();
    BackendService.uploadDocument(
      selectedId?.collectionId
        ? selectedId?.collectionId
        : selectedId?.uniqueId,
      selectedId?.collectionId ? selectedId?.uniqueId : '',
      formData,
      formData,
    )
      .then(() => {
        ref.current.value = null;
        dispatch(docsSliceActions.getData());
        dispatch(docsSliceActions.getCollectionData());
        dispatch(docsSliceActions.getDocumentData());
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
      .catch(() => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to download Document');
      });
    handleClose();
  };

  const createDocument = () => {
    const createData = {
      collectionId: selectedId?.collectionId
        ? selectedId?.collectionId
        : selectedId?.uniqueId,
      parentId: selectedId?.collectionId ? selectedId?.uniqueId : '',
    };
    BackendService.createDocument(createData)
      .then(res => {
        navigate(`/docs/create/${res?.data?.uniqueId}`);
      })
      .catch(() => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
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
      .catch(() => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  useEffect(() => {
    BackendService.getCollections(searchValue)
      .then(res => {
        setData(res?.data?.data);
      })
      .catch(() => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  }, [getData, searchValue]);

  useEffect(() => {
    if (window.location.pathname?.includes('home')) {
      setPage('home');
    } else if (window.location.pathname?.includes('drafts')) {
      setPage('drafts');
    } else if (window.location.pathname?.includes('archive')) {
      setPage('archive');
    } else if (window.location.pathname?.includes('trash')) {
      setPage('trash');
    } else {
      setPage('home');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      setLastSelectedCollectionItem(id);
    }
  }, [id]);

  const navMenus = [
    {
      navMenu: 'home',
      title: 'Home',
      iconName: 'dashboard',
    },
    {
      navMenu: 'drafts',
      title: 'Drafts',
      iconName: 'edit_note',
    },
    {
      navMenu: 'archive',
      title: 'Archive',
      iconName: 'archive',
    },
    {
      navMenu: 'trash',
      title: 'Trash',
      iconName: 'delete',
    },
  ];
  return (
    <Drawer
      position="left"
      style={{backgroundColor: '#fff'}}
      onClose={handleCloseMobileDrawer}
      open={openMobileDrawer}>
      <div style={{backgroundColor: '#fff'}}>
        <div className={classes.navContainer}>
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
          <CreateCollectionModal
            open={openModal}
            cancelHandler={() => setOpenModal(false)}
            initialValues={selectedId ? selectedId : {name: '', permission: ''}}
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
                  - The document will be moved to trash, where you can restore
                  the document within 30 days
                </Text>
              </>
            ) : (
              <Text style={{fontSize: '12px'}}>
                - This action will move all associated documents to archive
              </Text>
            )}
          </DeleteModalLayout>
          <div onClick={handleCloseMobileDrawer} className={classes.closeBtn}>
            <span style={{color: '#fff'}} className="material-symbols-outlined">
              chevron_left
            </span>
          </div>
          <div className={classes.navContent}>
            <Text className={classes.header}>Top Navigations</Text>
            <div style={{paddingBottom: '12px'}}>
              {navMenus?.map((data, i) => {
                return (
                  <NavMenu
                    iconName={data?.iconName}
                    navMenu={data?.navMenu}
                    title={data?.title}
                    onClick={nav => {
                      handleCloseMobileDrawer();
                      setPage(nav);
                      navigate(`/docs/${nav}`);
                    }}
                    page={page}
                  />
                );
              })}
              <Divider style={{borderTopWidth: '3px', marginBlock: '12px'}} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                }}>
                <div className={classes.collectionHeader}>Collection</div>
                <div
                  className={classes.createBtn}
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedId();
                  }}>
                  + create
                </div>
              </div>
              <TextField
                width="100%"
                style={{maxWidth: '100%'}}
                placeholder={'Search'}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                icon={
                  <span
                    style={{fontSize: '18px'}}
                    className="material-symbols-outlined">
                    search
                  </span>
                }
              />
            </div>
            <SimpleTreeView
              onItemSelectionToggle={handleItemSelectionToggle}
              selectedItems={lastSelectedCollectionItem}
              //   style={{
              //     overflowX: 'hidden',
              //     width: '300px',
              //     boxSizing: 'border-box',
              //   }}
            >
              {data?.map((list, i) => {
                return (
                  <TreeItem
                    key={list?.uniqueId}
                    itemId={`${list?.uniqueId}`}
                    onClick={() => {
                      setSelectedId(list);
                      setLastSelectedCollectionItem(`${list?.uniqueId}`);
                      navigate(`/docs/collection/${list?.uniqueId}`);
                    }}
                    sx={{
                      '.MuiTreeItem-content': {
                        gap: '0px',
                        padding: '4px',
                      },
                    }}
                    label={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}>
                        <div style={{display: 'flex', gap: '4px'}}>
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: '20px',
                              color: 'rgb(27, 55, 100)',
                            }}>
                            category
                          </span>
                          <span
                            style={{
                              whiteSpace: 'nowrap',
                              maxWidth: '160px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                            {list?.name}
                          </span>
                        </div>
                        <span
                          className="material-symbols-outlined"
                          style={{height: 'fit-content'}}
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenMenu(e, list);
                          }}>
                          more_horiz
                        </span>
                      </div>
                    }>
                    {list?.documentList?.map((data, ind) => {
                      return (
                        <TreeItemRenderer
                          data={data}
                          index={ind}
                          handleOpenMenu={handleOpenMenu}
                          handleSelect={data => {
                            setSelectedId(data);
                            setLastSelectedCollectionItem(`${data?.uniqueId}`);
                            navigate(`/docs/${data?.uniqueId}`);
                          }}
                        />
                      );
                    })}
                  </TreeItem>
                );
              })}
            </SimpleTreeView>
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
              <MenuItem
                onClick={() => {
                  if (selectedId?.collectionId) {
                    editDocumentHandler();
                  } else {
                    setOpenModal(true);
                    handleClose();
                  }
                }}>
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
              {selectedId?.collectionId && (
                <>
                  <MenuItem onClick={downloadDocument}>
                    <span
                      className={`material-symbols-outlined ${classes.menuIcon}`}>
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
    </Drawer>
  );
};

export default MobileDrawer;

const useStyles = makeStyles(theme => ({
  navContainer: {
    minHeight: '100vh',
    minWidth: '100%',
    boxSizing: 'border-box',
    boxShadow: '0px 0px 5px 0px #a5a5a5',
  },
  navContent: {
    overflowY: 'auto',
    padding: '24px',
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: '14px',
    color: '#999999',
    fontFamily: '"Roboto", sans-serif',
    paddingBottom: '12px',
  },
  content: {
    width: '100%',
    height: '40px',
    borderRadius: '10px',
    paddingInline: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '16px',
    cursor: 'pointer',
  },
  createBtn: {
    color: '#1b3764',
    cursor: 'pointer',
    fontSize: '14px',
  },
  collectionHeader: {
    color: '#999999',
    fontSize: '16px',
  },
  menuIcon: {
    paddingRight: '12px',
  },
  menuDivider: {
    marginBlock: '4px',
  },
  closeBtn: {
    height: '38px',
    width: '34px',
    borderTopLeftRadius: '5px',
    borderBottomLeftRadius: '5px',
    backgroundColor: '#1b3764',
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    marginLeft: 'auto',
  },
}));
