import {Breadcrumbs, Text, Snackbar} from 'glide-design-system';
import {Alert} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import HomeIcon from '../../assets/icon/home.svg';
import FormList from '../../features/forms/FormList';
import DeleteFormModal from '../../features/forms/DeleteFormModal';
import PublishModal from '../../features/forms/PublishModal';
import {
  closeNotification,
  getFormsError,
  getNotificationStatus,
  getPublishModalStatus,
  message,
} from '../../features/forms/formSlice';
import useDocumentTitle from '../../helpers/useDocumentTitle';
import Layout from '../../components/layout/Layout';

const ListForms = ({user}) => {
  const dispatch = useDispatch();
  const notification = useSelector(getNotificationStatus);
  const notificationMessage = useSelector(message);
  const error = useSelector(getFormsError);
  useDocumentTitle('List Form');

  useEffect(() => {
    dispatch(closeNotification());
  }, []);

  return (
    <Layout>
      <div style={{paddingRight: '24px', paddingTop: '16px'}}>
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
          {/* <DeleteFormModal open={open} /> */}
          <FormList user={user} />
        </div>
      </div>
    </Layout>
  );
};

export default ListForms;
