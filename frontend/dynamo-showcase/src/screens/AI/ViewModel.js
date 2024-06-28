import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core';
import {ProgressCricle, TextField, Snackbar} from 'glide-design-system';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import BackendService from '../../service/BackendService';

const ViewModel = () => {
  const classes = useStyles();
  const {id} = useParams();
  const navigate = useNavigate();

  const [datas, setDatas] = useState([]);
  const [feed, setFeed] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [modelInfo, setModelInfo] = useState();
  const [scrolled, setScrolled] = useState(false);
  const [title, setTitle] = useState('');

  const containerRef = useRef(null);

  const submitHandler = () => {
    setDatas(prevDatas => [...prevDatas, feed]);
    const feedData = {
      message: feed,
    };
    setFeed('');
    setIsLoading(true);
    BackendService.conversation(feedData, id)
      .then(res => {
        setIsLoading(false);
        setDatas(prevDatas => [...prevDatas, res?.data?.message]);
      })
      .catch(err => {
        setDatas(datas);
        setIsLoading(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage(err?.message);
      });
  };

  /**
   * retreieves model details to show model name
   */
  const getModelDetail = () => {
    BackendService.getModelDetails(id)
      .then(res => {
        setTitle(res?.data?.modelName);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage(err?.message);
      });
  };

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom();
  }, [datas]);

  useEffect(() => {
    getModelDetail();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Layout>
      <Snackbar
        open={notification}
        message={notificationMessage}
        type={notificationError ? 'error' : 'success'}
        onClose={() => setNotification(null)}
      />
      <div
        className={`${classes.modelInfoContainer} ${
          scrolled && classes.scrolled
        }`}>
        <span
          className="material-symbols-outlined"
          style={{fontSize: '30px', color: '#333', cursor: 'pointer'}}
          onClick={() => navigate('/AI/home')}>
          arrow_back
        </span>
        <div className={classes.modelName}>{title}</div>
      </div>
      <div style={{padding: '24px', paddingBottom: '44px'}}>
        {datas?.length === 0 && (
          <div className={classes.noDataText}>
            <span
              className="material-symbols-outlined"
              style={{fontSize: '125px'}}>
              robot_2
            </span>
            <div>Welcome! How can I assist you today? Type your question.</div>
          </div>
        )}
        <div style={{width: '100%'}}>
          {datas?.map((data, i) => {
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '100%',
                  width: i % 2 !== 0 ? '756px' : '100%',
                  borderRadius: '5px',
                  border: i % 2 !== 0 && '1px solid #d7d7d7',
                  padding: i % 2 !== 0 ? '16px 16px' : '12px 0px',
                }}>
                <div className={classes.header}>
                  {i % 2 === 0 ? (
                    <div
                      className={classes.msgBy}
                      style={{justifyContent: 'end'}}>
                      <div>You</div>
                      <span
                        className="material-symbols-outlined"
                        style={{fontSize: '18px'}}>
                        person
                      </span>
                    </div>
                  ) : (
                    <div className={classes.msgBy}>
                      <span
                        className="material-symbols-outlined"
                        style={{fontSize: '18px'}}>
                        robot_2
                      </span>
                      <div>System</div>
                    </div>
                  )}
                </div>
                <div
                  className={classes.msg}
                  style={{
                    justifyContent: i % 2 === 0 ? 'end' : 'start',
                    display: i % 2 === 0 ? 'flex' : 'block',
                  }}>
                  {data?.split('\n')?.map((line, index) => (
                    <div key={`prompt${index}`}>
                      {line}
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '12px',
              }}>
              <div className={classes.header}>System</div>
              <ProgressCricle
                style={{
                  width: '20px',
                  height: '20px',
                  animation: 'spin 0.5s linear infinite',
                }}
              />
            </div>
          )}
          <div ref={containerRef} />
        </div>
      </div>
      <div className={classes.textFieldContainer}>
        <TextField
          className={classes.textField}
          id="feed"
          size="small"
          name="feed"
          width="100%"
          value={feed}
          disabled={isLoading}
          icon={
            <div className={classes.iconContainer}>
              <span
                className="material-symbols-outlined"
                style={{
                  color: '#5f6368',
                  cursor: !isLoading ? 'pointer' : 'not-allowed',
                }}
                onClick={() => feed && submitHandler()}>
                send
              </span>
            </div>
          }
          iconPosition="end"
          placeholder={
            isLoading
              ? 'Please hold on with bated breath while I gracefully fetch the response you seek  🎩✨...'
              : 'Need information? Ask away!'
          }
          containerClass={classes.searchField}
          onChange={e => setFeed(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && feed) {
              submitHandler();
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default ViewModel;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100% !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px',
    flex: '1',
    padding: '16px',
    paddingBottom: '0px',
  },
  contentContainer: {
    display: 'flex !important',
    alignItems: 'center !important',
    width: '100% !important',
    marginTop: '18px !important',
    flexDirection: 'column !important',
    gap: '28px !important',
    paddingBottom: '16px',
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
  textField: {
    width: '100% !important',
    fontFamily: 'Roboto,sans-serif !important',
    '& .Mui-disabled': {
      WebkitTextFillColor: 'rgba(0, 0, 0, 1) !important',
    },
    fontSize: '18px !important',
    color: '#999 !important',
  },
  textFieldContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'end',
    position: 'fixed',
    bottom: '0px',
    height: '75px',
    backgroundColor: '#fff',
    paddingBottom: '16px',
    paddingInline: '24px',
  },
  searchField: {
    color: 'grey !important',
    width: '100% !important',
    maxWidth: '100% !important',
    height: '48px !important',
  },
  iconContainer: {
    width: '38px',
    height: '38px',
    '&:hover': {
      boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
  },
  header: {
    color: '#797979',
    fontFamily: ' "Roboto Medium", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
  },
  msgBy: {
    display: 'flex',
    gap: '2px',
  },
  msg: {
    fontSize: '18px',
    fontFamily: 'Roboto,sans-serif !important',
    display: 'flex',
    color: '#333',
  },
  noDataText: {
    display: 'flex',
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: 'auto',
    fontSize: '16px',
    fontFamily: '"Roboto", sans-serif',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    textAlign: 'center',
    flexDirection: 'column',
    color: '#949494',
  },
  modelInfoContainer: {
    display: 'flex',
    gap: '8px',
    position: 'fixed',
    top: '50px',
    left: '0px',
    alignItems: 'center',
    transition: 'box-shadow 0.3s ease-in-out',
    paddingLeft: '24px',
    height: '50px',
  },
  modelName: {
    fontSize: '28px',
    color: '#333333',
    fontWeight: '500',
    fontFamily: '"Roboto Bold", "Roboto", sans-serif',
    textTransform: 'capitalize',
  },
  scrolled: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    backgroundColor: '#ffffffd6',
  },
}));
