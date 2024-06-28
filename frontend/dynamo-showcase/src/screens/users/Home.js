import React, {useState} from 'react';
import '../../index.css';
import {useDispatch, useSelector} from 'react-redux';
import {Alert} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {Breadcrumbs, Button, Text, Snackbar} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import {
  closeNotification,
  getInviteStatus,
  getUsersError,
  message,
} from '../../features/users/userSlice';
import UsersTable from '../../features/users/UsersTable';
import InviteUser from '../../features/users/InviteUser';
import SuspendUser from '../../features/users/SuspendUser';
import ReactivateUser from '../../features/users/ReactivateUser';
import EditUser from '../../features/users/EditUser';
import HomeIcon from '../../assets/icon/home.svg';
import useDocumentTitle from '../../helpers/useDocumentTitle';
import Layout from '../../components/layout/Layout';

/**
 * Home screen with user management functionality components
 * @returns render screen with invite,edit user and user table
 */
const Home = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const notification = useSelector(getInviteStatus);
  const notificationMessage = useSelector(message);
  const error = useSelector(getUsersError);
  const [showInviteModal, setShowInviteModal] = useState(false);
  useDocumentTitle('Users');

  console.log('error users', error);

  /**
   * opens or closes invite user modal
   */
  const showModal = () => {
    setShowInviteModal(!showInviteModal);
  };

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '16px 24px',
        }}>
        <div>
          <Text style={style.heading}>Users</Text>
        </div>
        <Button
          icon={<span className="material-symbols-outlined">add</span>}
          id="addUser-btn"
          onClick={showModal}
          style={style.button}
          size="medium"
          className={classes.button}>
          Add User
        </Button>
      </div>
      {/* <Snackbar
        autoHideDuration={1000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={notification}
        onClose={() => dispatch(closeNotification())}>
        <Alert
          id="alert"
          onClose={() => dispatch(closeNotification())}
          severity={error ? 'error' : 'success'}>
          {notificationMessage}
        </Alert>
      </Snackbar> */}
      {notification && (
        <Snackbar
          open={notification}
          message={notificationMessage}
          type={error ? 'error' : 'success'}
          onClose={() => dispatch(closeNotification())}
        />
      )}
      <InviteUser open={showInviteModal} showModal={showModal} />
      <SuspendUser />
      <ReactivateUser />
      <EditUser />
      <UsersTable />
    </Layout>
  );
};

export default Home;

const style = {
  container: {
    backgroundColor: '#FFFFFF',
    width: '100% !important',
    marginLeft: '25px !important',
  },
  heading: {
    fontWeight: 700,
    fontSize: '24px',
    fontFamily: 'sans-serif',
    color: '#333333',
    // marginLeft: '24px',
  },
  button: {
    // marginRight: '25px',
    // marginBottom: '30px',
    backgroundColor: '#1B3764',
    // marginTop: '5px',
  },
};

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
}));
