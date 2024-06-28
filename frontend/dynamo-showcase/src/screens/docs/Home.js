import React, {useEffect, useState} from 'react';
import {Button, TextField, Snackbar, Divider, Text} from 'glide-design-system';
import {Menu, MenuItem, CircularProgress} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import {useNavigate} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import SelectedTab from '../../components/docsComponent/SelectedTab';
import ExistingUserHome from '../../components/home/ExistingUserHome';
import NewUserHome from '../../components/home/NewUserHome';
import BackendService from '../../service/BackendService';

const Home = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [data, setData] = useState();
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [menuData, setMenuData] = useState([]);
  const [anchorCollectionEl, setAnchorCollectionEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const openCollection = Boolean(anchorCollectionEl);

  const getData = useSelector(state => state.docs.getData);

  const handleCloseCollectionMenu = () => {
    setAnchorCollectionEl(null);
  };

  const retrieveData = () => {
    BackendService.getDocuments(searchValue)
      .then(res => {
        setData(res?.data?.data);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  const getCollectionList = e => {
    setAnchorCollectionEl(e.currentTarget);
    BackendService.getCollectionsList()
      .then(res => {
        setMenuData(res?.data?.data);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
        handleCloseCollectionMenu();
      });
  };

  const createDocument = data => {
    const createData = {
      collectionId: data?.uniqueId,
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

  useEffect(() => {
    retrieveData();
  }, [getData, searchValue]);

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
      <div className={classes.docTabs}>
        <SelectedTab name={'Recent Documents'} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          maxWidth: '100%',
        }}>
        {((data && data?.content?.length !== 0) || searchValue) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
            <TextField
              style={{maxWidth: '100%'}}
              placeholder={'Search in all Documents'}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            <Button
              type="submit"
              icon={<span className="material-symbols-outlined">add</span>}
              id="submit-btn"
              color="primary"
              className={classes.submitBtn}
              onClick={getCollectionList}>
              New
            </Button>
          </div>
        )}
        <Text
          style={{
            color: 'rgba(0, 0, 0, 0.99)',
            fontSize: '36px',
            fontWeight: '500',
          }}>
          Home
        </Text>
        <div className={classes.mobileTabViewContainer}>
          <div className={classes.TabViewTest}>Recent Documents</div>
          <Divider style={{marginTop: '0px'}} />
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
          }}>
          {data && data?.content?.length === 0 ? (
            <NewUserHome />
          ) : (
            <ExistingUserHome data={data} />
          )}
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorCollectionEl}
          open={openCollection}
          onClose={handleCloseCollectionMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            style: {backgroundColor: '#fff', color: '#333'},
          }}>
          {menuData?.map((data, i) => {
            return (
              <div>
                {' '}
                <MenuItem
                  key={data?.uniqueId}
                  onClick={() => createDocument(data)}>
                  <span
                    style={{color: 'rgb(27, 55, 100)'}}
                    className={`material-symbols-outlined ${classes.menuIcon}`}>
                    category
                  </span>
                  {data?.name}
                </MenuItem>
                {i !== menuData?.length - 1 && (
                  <Divider className={classes.menuDivider} />
                )}
              </div>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};

export default Home;

const useStyles = makeStyles(theme => ({
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
  menuIcon: {
    paddingRight: '12px',
  },
  menuDivider: {
    marginBlock: '4px',
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
