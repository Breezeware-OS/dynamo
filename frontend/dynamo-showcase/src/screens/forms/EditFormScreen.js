import {Breadcrumbs, Text, Snackbar} from 'glide-design-system';
import {Alert} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import HomeIcon from '../../assets/icon/home.svg';
import CreateForm from '../../features/forms/CreateForm';
import {
  closeNotification,
  getDiscardModalStatus,
  getFormsError,
  getNotificationStatus,
  getPublishModalStatus,
  message,
} from '../../features/forms/formSlice';
import PublishModal from '../../features/forms/PublishModal';
import EditForm from '../../features/forms/EditForm';
import DiscardModal from '../../features/forms/DiscardModal';
import useDocumentTitle from '../../helpers/useDocumentTitle';
import Layout from '../../components/layout/Layout';

const EditFormScreen = ({user}) => {
  const dispatch = useDispatch();
  const open = useSelector(getPublishModalStatus);
  const notification = useSelector(getNotificationStatus);
  const notificationMessage = useSelector(message);
  const error = useSelector(getFormsError);
  const discardModal = useSelector(getDiscardModalStatus);
  useDocumentTitle('Edit Form');

  return (
    <Layout>
      <div>
        {/* <Snackbar
          autoHideDuration={2000}
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
        <div>
          <EditForm />
        </div>
        <PublishModal open={open} user={user} />
        <DiscardModal open={discardModal} />
      </div>
    </Layout>
  );
};

export default EditFormScreen;
