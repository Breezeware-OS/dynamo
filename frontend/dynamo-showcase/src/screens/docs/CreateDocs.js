import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import {Button, Snackbar} from 'glide-design-system';
import MDEditor from '@uiw/react-md-editor';
import {makeStyles} from '@material-ui/core';
import TextArea from '../../components/docsComponent/TextArea';
import BackendService from '../../service/BackendService';

let debounceTimer;

const CreateDocs = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const classes = useStyles();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [data, setData] = useState({htmlContent: ''});
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');

  const handleTilteChange = e => {
    if (e.target.value?.length < 100) {
      setTitle(e.target.value);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const updatedData = {
          ...data?.[0],
          title: e.target.value,
          content,
        };
        BackendService.updateDocument(updatedData).catch(err => {
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to update document');
        });
      }, 3000);
    }
  };

  const handleContentChange = e => {
    setContent(e);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const updatedData = {
        ...data?.[0],
        title,
        content: e,
      };
      BackendService.updateDocument(updatedData).catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to update document');
      });
    }, 3000);
  };

  const saveToDraft = () => {
    const updatedData = {
      ...data?.[0],
      title,
      content,
    };
    BackendService.updateDocument(updatedData)
      .then(res => {
        setNotification(true);
        setNotificationError(false);
        setNotificationMessage('Document saved to draft successfully');
        setTimeout(() => {
          navigate(-1);
        }, 200);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to draft document');
      });
  };

  const publishDocument = () => {
    if (title) {
      const updatedData = {
        ...data?.[0],
        title,
        content,
      };
      BackendService.publishDocument(updatedData)
        .then(res => {
          setNotification(true);
          setNotificationError(false);
          setNotificationMessage('Document published successfully');
          setTimeout(() => {
            navigate(-1);
          }, 200);
        })
        .catch(err => {
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Failed to publish document');
        });
    } else {
      setNotification(true);
      setNotificationError(true);
      setNotificationMessage('Title is required to publish a document');
    }
  };

  useEffect(() => {
    BackendService.getIndivdualDocument(id)
      .then(res => {
        setData(res?.data?.data);
        setTitle(
          res?.data?.data?.[0]?.title ? res?.data?.data?.[0]?.title : '',
        );
        setContent(
          res?.data?.data?.[0]?.content ? res?.data?.data?.[0]?.content : '',
        );
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Something Went Wrong.');
      });
  }, []);

  return (
    <div
      style={{
        padding: '24px',
        width: '100%',
        paddingTop: '60px',
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
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
        <Button
          type="draft"
          id="draft-btn"
          color="primary"
          variant="outlined"
          className={classes.outlinedBtn}
          onClick={saveToDraft}>
          Save as Draft
        </Button>
        <Button
          type="submit"
          id="publish-btn"
          color="primary"
          className={classes.submitBtn}
          onClick={publishDocument}>
          Publish
        </Button>
      </div>
      <div
        data-color-mode="light"
        style={{maxWidth: '100%', width: '100%', marginInline: 'auto'}}>
        <TextArea
          placeholder="Start with Title"
          onChange={handleTilteChange}
          value={title}
        />
        <MDEditor
          value={content}
          onChange={handleContentChange}
          height="700px"
          width="100%"
          maxHeight="100%"
        />
      </div>
    </div>
  );
};

export default CreateDocs;

const useStyles = makeStyles(theme => ({
  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: 'rgb(27, 55, 100) !important',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
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
      backgroundColor: '#3a5d95 !important',
      color: 'white !important',
    },
  },
}));
