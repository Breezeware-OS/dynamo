import React, {useEffect, useState} from 'react';
import {Text, Divider, TextField, Snackbar} from 'glide-design-system';
import {Menu, MenuItem, Backdrop, CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import SelectedTab from '../../components/docsComponent/SelectedTab';
import DocDetail from '../../components/docDetail/DocDetail';
import BackendService from '../../service/BackendService';
import DeleteModalLayout from '../../components/docsComponent/DeleteModalLayout';

const Trash = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [data, setData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [searchValue, setSearchValue] = useState('');
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
    BackendService.permanentDeleteDocument(selectedId?.uniqueId)
      ?.then(res => {
        setNotification(true);
        setNotificationError(false);
        setNotificationMessage('Document permanently deleted successfully');
        setLoader(false);
        setOpenDeleteModal(false);
        retrieveData();
      })
      .catch(err => {
        setLoader(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to delete document');
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
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to download Document');
      });
    handleClose();
  };

  const docClickHandler = data => {
    navigate(`/docs/${data?.uniqueId}`);
  };

  const retrieveData = () => {
    BackendService.getDeletedDocuments(searchValue)
      .then(res => {
        setData(res?.data?.data);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  useEffect(() => {
    retrieveData();
  }, [searchValue]);

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
      <DeleteModalLayout
        open={openDeleteModal}
        cancelHandler={() => setOpenDeleteModal(false)}
        title={'Permanently Delete'}
        deleteHandler={deleteHandler}>
        <Text style={{fontSize: '16px', paddingTop: '16px'}}>
          Are you sure you want to permanently delete this document
        </Text>
        <Text style={{fontSize: '12px'}}>
          - Restore it will move all files to Collection
        </Text>{' '}
        <Text
          style={{fontSize: '16px', paddingTop: '8px', paddingBottom: '8px'}}>
          (Remember, you can't undo this action)
        </Text>
      </DeleteModalLayout>
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
          }}>
          <TextField
            style={{maxWidth: '100%'}}
            placeholder={'Search Trashed files'}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
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
                marginBottom: '16px',
              }}>
              Trash
            </Text>
            <div className={classes.mobileTabViewContainer}>
              <div className={classes.TabViewTest}>Documents</div>
              <Divider style={{marginTop: '0px'}} />
            </div>
            {data?.map((doc, i) => {
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
            {(!data || data?.length === 0) && (
              <Text
                style={{
                  color: 'rgba(0, 0, 0, 0.99)',
                  fontSize: '16px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}>
                No Trash to Show
              </Text>
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
                style: {backgroundColor: '#fff', color: '#333'},
              }}>
              {/* <MenuItem>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  unarchive
                </span>
                Restore
              </MenuItem>
              <Divider className={classes.menuDivider} /> */}
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
                  setOpenDeleteModal(true);
                  handleClose();
                }}>
                <span
                  className={`material-symbols-outlined ${classes.menuIcon}`}>
                  delete
                </span>
                Permanently Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trash;

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
  mobileTabViewContainer: {
    display: 'none',
    [theme.breakpoints.down('1200')]: {
      display: 'block',
    },
    color: '#1b3764',
    fontSize: '16px',
    fontWeight: '500',
  },
  TabViewTest: {
    lineHeight: '2rem',
    borderBottom: '3px solid',
    width: 'fit-content',
  },
}));
