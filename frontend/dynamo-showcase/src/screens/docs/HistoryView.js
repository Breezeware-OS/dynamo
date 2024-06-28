import React, {useState, useEffect, useRef} from 'react';
import {Divider, TextField, Snackbar} from 'glide-design-system';
import {Backdrop, CircularProgress} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import BackendService from '../../service/BackendService';
import DocDetail from '../../components/docDetail/DocDetail';
import MDViewer from '../../components/docsComponent/MDViewer';

const HistoryView = () => {
  const classes = useStyles();
  const {id, historyId} = useParams();

  const [data, setData] = useState();
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');

  const retrieveData = () => {
    BackendService.getHistoryData(id, historyId)
      .then(res => {
        setData(res?.data);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  };

  useEffect(() => {
    retrieveData();
  }, [id, historyId]);

  return (
    <div
      style={{
        display: 'flex',
        padding: '24px',
        marginBottom: 'auto',
        width: '100%',
        flexWrap: 'wrap',
        gap: '16px',
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          maxWidth: '100%',
        }}>
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
            marginTop: '16px',
          }}>
          <div style={{width: '100%'}}>
            <MDViewer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;

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
}));
