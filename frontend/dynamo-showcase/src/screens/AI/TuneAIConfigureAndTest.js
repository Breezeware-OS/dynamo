import React, {useEffect, useState} from 'react';
import {Button, Text, Snackbar} from 'glide-design-system';
import {Backdrop, CircularProgress, Tooltip} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import {useParams, useNavigate} from 'react-router-dom';
import ModelTitleLayout from '../../components/AI/ModelTitleLayout';
import PromptLayout from '../../components/AI/PromptLayout';
import ConfigureLayout from '../../components/AI/ConfigureLayout';
import TestLayout from '../../components/AI/TestLayout';
import BackendService from '../../service/BackendService';
import TuneNavLayout from '../../components/AI/TuneNavLayout';
import Layout from '../../components/layout/Layout';

const TuneAIConfigureAndTest = () => {
  const classes = useStyles();
  const {id} = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [promptValue, setPromptValue] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [topK, setTopK] = useState(0);
  const [topP, setTopP] = useState(0);
  const [showEmbed, setShowEmbed] = useState('uploaded');
  const [feed, setFeed] = useState('');
  const [datas, setDatas] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false); // conversation loader

  /** embeds the document */
  const showEmbedHandler = () => {
    setShowEmbed('embedding');
    BackendService.embedDocument(id)
      .then(res => {
        setNotification(true);
        setNotificationError(false);
        setNotificationMessage('Document Embedded Successfully.');
        knowledgeArtifactsStatus();
      })
      .catch(err => {
        setShowEmbed('uploaded');
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage(err?.response?.data?.details?.[0]);
      });
  };

  /** test conversation when user send message */
  const submitHandler = () => {
    setDatas(prevDatas => [...prevDatas, feed]);
    const feedData = {
      systemPrompt: promptValue,
      temperature,
      topP,
      topK,
      message: feed,
    };
    setFeed('');
    setLoading(true);
    BackendService.testConversation(feedData, id)
      .then(res => {
        setLoading(false);
        setDatas(prevDatas => [...prevDatas, res?.data?.message]);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  /** complete the training of documents */
  const completeTraining = () => {
    const promptData = {
      systemPrompt: promptValue,
      temperature,
      topP,
      topK,
    };
    BackendService.completeTraining(promptData, id)
      .then(res => {
        setNotification(true);
        setNotificationError(false);
        setNotificationMessage('Document Updated Successfully');
        setLoader(false);
        setTimeout(() => navigate(`/AI/view-model/${id}`), 1000);
      })
      .catch(err => {
        setLoader(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to Update Document.');
      });
  };

  /**
   * checks whether the documents is embedded or not if embedded show test convesation else shows embed button component
   */
  const isDocumentsEmbedded = () => {
    BackendService.isDocumentsEmbedded(id)
      .then(res => {
        setShowEmbed(res?.data);
      })
      .catch(err => {
        setShowEmbed('uploaded');
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
        setPromptValue(res?.data?.systemPrompt);
        setTopK(res?.data?.topk ? res?.data?.topK : 0);
        setTopP(res?.data?.topP ? res?.data?.topP : 0);
        setTemperature(res?.data?.temperature ? res?.data?.temperature : 0);
      })
      .catch(err => {
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage(err?.message);
      });
  };

  /**
   * updates model name
   * @param {*} e updated model name
   */
  const updateTitle = e => {
    setTitle(e);
    const data = {'model-name': e};
    BackendService.updateModelName(data, id).catch(err => {
      setNotification(true);
      setNotificationError(true);
      setNotificationMessage(err?.message);
    });
  };

  /**
   * checks whether the documents if not if redirect to upload document
   */
  const isDocumentAvailable = () => {
    BackendService.isDocumentsAvailable(id)
      .then(res => {
        if (res?.data) knowledgeArtifactsStatus();
        else navigate(`/AI/tune/${id}/upload-document`);
      })
      .catch(err => {
        navigate(`/AI/tune/${id}/upload-document`);
      });
  };

  const knowledgeArtifactsStatus = () => {
    BackendService.knowledgeArtifactsStatus(id)
      .then(res => {
        setShowEmbed(res?.data);
      })
      .catch(err => {
        setShowEmbed('uploaded');
      });
  };

  useEffect(() => isDocumentAvailable(), []);

  useEffect(() => getModelDetail(), []);

  return (
    <Layout>
      <div className={classes.container}>
        <Snackbar
          open={notification}
          message={notificationMessage}
          type={notificationError ? 'error' : 'success'}
          onClose={() => setNotification(null)}
        />
        <Backdrop
          sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
          open={loader}>
          <CircularProgress style={{color: '#0a5b99'}} />
        </Backdrop>
        <div className={classes.headerActionContainer}>
          {/* Title of the model is rendered in modelTitleLayout */}
          <ModelTitleLayout title={title} setTitle={updateTitle} />
          <Button
            icon={
              <span
                style={{fontSize: '22px'}}
                className="material-symbols-outlined">
                check
              </span>
            }
            id="complete-btn"
            color="primary"
            className={`${
              showEmbed === 'embedded' ? classes.submitBtn : classes.disabledBtn
            }`}
            onClick={() => showEmbed === 'embedded' && completeTraining()}>
            Update
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
          }}>
          <TuneNavLayout />
          <div className={classes.documentContainer}>
            <div className={classes.contentContainer}>
              <div className={classes.content}>
                <div className={classes.contentChild}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}>
                    <Text
                      className={classes.header}
                      style={{marginBottom: '0px'}}>
                      Prompts
                    </Text>
                    <Tooltip
                      slotProps={{
                        tooltip: {
                          style: {
                            fontSize: '14px',
                            fontWeight: '400',
                          },
                        },
                      }}
                      placement="bottom-start"
                      title="Prompts are essential as they establish the context and boundaries for the AI's response.">
                      <span
                        style={{
                          fontSize: '20px',
                          cursor: 'pointer',
                          color: '#1b3764',
                        }}
                        className="material-symbols-outlined">
                        info
                      </span>
                    </Tooltip>
                  </div>
                  <PromptLayout
                    setPromptValue={setPromptValue}
                    promptValue={promptValue}
                  />
                </div>
                <div className={classes.mobileConfigureContent}>
                  <Text className={classes.header}>Configure</Text>
                  <ConfigureLayout
                    temperature={temperature}
                    setTemperature={setTemperature}
                    topK={topK}
                    setTopK={setTopK}
                    topP={topP}
                    setTopP={setTopP}
                  />
                </div>
                <div className={classes.contentChild}>
                  <Text className={classes.header}>Test</Text>
                  <TestLayout
                    showEmbed={showEmbed}
                    showEmbedHandler={showEmbedHandler}
                    feed={feed}
                    setFeed={setFeed}
                    submitHandler={submitHandler}
                    datas={datas}
                    isLoading={loading}
                  />
                </div>
              </div>
              <div className={classes.configureContent}>
                <Text className={classes.header}>Configure</Text>
                <ConfigureLayout
                  temperature={temperature}
                  setTemperature={setTemperature}
                  topK={topK}
                  setTopK={setTopK}
                  topP={topP}
                  setTopP={setTopP}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TuneAIConfigureAndTest;

const useStyles = makeStyles(theme => ({
  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: 'rgb(27, 55, 100) !important',
    // '&:hover': {
    //   backgroundColor: 'rgb(27, 55, 100) !important',
    // },
  },
  container: {
    // flex: '1',
    // marginTop: '8px !important',
    // width: 'calc(100% - 308px)',
    width: '100%',
    marginTop: '5px',
  },
  header: {
    color: 'rgba(0, 0, 0, 0.99) !important',
    fontSize: '28px !important',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Bold", "Roboto", sans-serif !important',
    marginBottom: '12px',
  },
  headerActionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 24px',
    // boxShadow: '0px 8px 8px -8px rgba(0, 0, 0, 0.35)',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35)',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  disabledBtn: {
    color: '#797979 !important',
    backgroundColor: 'rgba(170, 170, 170, 1) !important',
    '&:hover': {
      color: '#797979 !important',
      backgroundColor: 'rgba(170, 170, 170, 1) !important',
    },
    cursor: 'not-allowed',
  },
  stepperContainer: {
    marginBottom: '18px !important',
    padding: '24px !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px !important',
    display: 'flex !important',
    gap: '8px !important',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentStep: {
    borderRadius: '50px',
    border: '7px solid #1b3764',
    padding: '4px',
    maxHeight: '22px',
    maxWidth: '22px',
  },
  currentText: {
    color: '#333333',
    fontSize: '20px !important',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif !important',
    fontWeight: '700 !important',
  },
  nextStep: {
    borderRadius: '50px',
    border: '4px solid #1b3764',
    maxHeight: '8px',
    maxWidth: '8px',
  },
  nextText: {
    color: '#555555',
    fontSize: '20px !important',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif !important',
    fontWeight: '700 !important',
  },
  contentContainer: {
    display: 'flex !important',
    width: '100% !important',
    marginBottom: '18px !important',
    gap: '28px !important',
  },
  content: {
    width: '100%',
    display: 'flex',
    flex: '1',
    flexWrap: 'wrap',
    gap: '18px',
  },
  contentChild: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  configureContent: {
    width: '424px',
    maxWidth: '100%',
    [theme.breakpoints.down('1200')]: {
      display: 'none',
    },
  },
  documentContainer: {
    padding: '24px 24px 0px 0px',
    [theme.breakpoints.down('900')]: {
      padding: '24px 24px 0px',
    },
    flex: 1,
    width: 'calc(100% - 308px)',
  },
  mobileConfigureContent: {
    display: 'none',
    [theme.breakpoints.down('1200')]: {
      width: '100%',
      maxWidth: '100%',
      display: 'block',
    },
  },
}));
