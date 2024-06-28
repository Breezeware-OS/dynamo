import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core';
import {Button, Text, ProgressCricle, TextField} from 'glide-design-system';
import icon from '../../assets/icon/Robot.svg';

const TestLayout = ({
  showEmbed,
  showEmbedHandler,
  feed,
  setFeed,
  submitHandler,
  datas,
  isLoading,
}) => {
  const classes = useStyles();
  const containerRef = useRef();

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom();
  }, [datas]);

  return (
    <div className={classes.container}>
      {showEmbed === 'uploaded' ? (
        <div className={classes.contentContainer}>
          <Text
            style={{
              fontSize: '16px',
              color: '#949494',
              fontFamily: '"Roboto", sans-serif',
              textAlign: 'center',
            }}>
            The uploaded documents are not ready for testing. If you want to run
            a test, please click the 'Embed Document' button. The testing
            process may take some time, depending on the number of uploaded
            documents.{' '}
          </Text>
          <div>
            <img style={{width: '166px', height: '64px'}} src={icon} />
          </div>
          <Button
            type="submit"
            id="submit-btn"
            color="primary"
            className={classes.submitBtn}
            onClick={showEmbedHandler}>
            Embed Document
          </Button>
        </div>
      ) : showEmbed === 'embedding' ? (
        <div className={classes.loaderContainer}>
          <ProgressCricle
            style={{
              width: '50px',
              height: '50px',
              animation: 'spin 0.5s linear infinite',
              color: 'rgb(27, 55, 100)',
            }}
          />
          <Text
            style={{
              fontSize: '16px',
              color: '#949494',
              fontFamily: '"Roboto", sans-serif',
              textAlign: 'center',
            }}>
            We are processing the documents to train the model. This might take
            a few minutes, so please wait a moment!
          </Text>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '200px',
            minHeight: '100%',
          }}>
          {datas?.map((data, i) => {
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '12px',
                  width: '100%',
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
                  style={{justifyContent: i % 2 === 0 ? 'end' : 'start'}}>
                  {data}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <>
              <div className={classes.msgBy}>
                <span
                  className="material-symbols-outlined"
                  style={{fontSize: '18px'}}>
                  robot_2
                </span>
                <div>System</div>
              </div>
              <ProgressCricle
                style={{
                  width: '20px',
                  height: '20px',
                  animation: 'spin 0.5s linear infinite',
                }}
              />
            </>
          )}
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
                      //   fontSize: '24px',
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
                  : 'Message Breeze AI'
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
        </div>
      )}
      <div className={classes.scroll} ref={containerRef} />
    </div>
  );
};

export default TestLayout;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100% !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px',
    flex: '1',
    minHeight: '200px',
    padding: '16px',
    paddingBottom: '0px',
    overflowY: 'auto',
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
    position: 'sticky',
    top: '100%',
    height: '75px',
    backgroundColor: '#fff',
    paddingBottom: '16px',
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
    fontSize: '16px',
    fontFamily: 'Roboto,sans-serif !important',
    display: 'flex',
    color: '#333',
  },
  loaderContainer: {
    maxHeight: '200px',
    height: '100%',
    display: 'flex !important',
    alignItems: 'center !important',
    width: '100% !important',
    flexDirection: 'column !important',
    gap: '28px !important',
    paddingBottom: '16px',
    justifyContent: 'center',
    minHeight: '100%',
  },
  scroll: {
    display: 'flex',
    width: '100%',
    alignItems: 'end',
    position: 'sticky',
    top: '100%',
  },
}));
