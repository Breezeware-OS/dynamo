import React, {useEffect, useState} from 'react';
import {Button, Chip, Text, Snackbar} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import {Backdrop, CircularProgress} from '@mui/material';
import {useParams, useNavigate} from 'react-router-dom';
import ModelTitleLayout from '../../components/AI/ModelTitleLayout';
import Layout from '../../components/layout/Layout';
import icon from '../../assets/icon/Upload.png';
import UploadDocumentModal from '../../components/AI/UploadDocumentModal';
import UploadDocumentSearchFields from '../../components/AI/UploadDocumentSearchFields';
import UploadedDocumentTable from '../../components/AI/UploadedDocumentTable';
import DeleteFileModal from '../../components/AI/DeleteFileModal';
import UploadDocumentStepper from '../../components/AI/UploadDocumentStepper';
import BackendService from '../../service/BackendService';

/**
 * @returns new component when there is no documents available or shows documents table
 */
const TrainAIUploadDocuments = () => {
  const classes = useStyles();
  const {id} = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [enableNextBtn, setEnableNextBtn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState();
  const [searchFile, setSearchFile] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [sortItem, setSortItem] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [loader, setLoader] = useState(false);

  const searchFileHandler = e => {
    setPageNo(0);
    setSearchFile(e);
  };

  const statusHandler = e => {
    setPageNo(0);
    setStatus(e);
  };

  /**
   * Pagination of user table
   * @param {*} value page number
   */
  const PagehandleChange = value => {
    setPageNo(value - 1);
  };

  const sortHandler = (order, item) => {
    setPageNo(0);
    setSortItem(item);
    setSortOrder(order);
  };

  /**
   * delete document
   */
  const deleteHandler = () => {
    setLoader(true);
    BackendService.deleteModelDocument({id, documentId: openDeleteModal})
      ?.then(() => {
        setNotification(true);
        setNotificationError(false);
        setNotificationMessage('Document Deleted Successfully');
        setLoader(false);
        setOpenDeleteModal(false);
        getModelFiles();
        isDocumentsAvailable();
      })
      .catch(err => {
        setLoader(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage('Failed to Delete Document.');
      });
  };

  /**
   * uploaded document files for specific model
   */
  const getModelFiles = () => {
    setLoading(true);
    const data = {
      id,
      searchFile,
      status,
      sortItem,
      sortOrder,
      pageNo,
      searchDate: '',
    };
    BackendService.getModelFiles(data)
      .then(res => {
        setLoading(false);
        if (pageNo > 0 && res?.data?.content?.length === 0)
          setPageNo(pageNo - 1);
        setData(res?.data);
      })
      .catch(err => {
        setLoading(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage(err?.message);
      });
  };

  /**
   * checks whether the documents where uploaded or not to decide which one should be shown document table component or new document component and also used for enabling next btn
   */
  const isDocumentsAvailable = () => {
    BackendService.isDocumentsAvailable(id)
      .then(res => {
        setEnableNextBtn(res?.data);
      })
      .catch(err => {
        setEnableNextBtn(false);
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

  const columns = [
    {
      label: 'file name',
      fieldName: 'name',
      sort: true,
    },
    {
      label: 'status',
      sort: true,
      style: {
        textAlign: 'left',
      },
      fieldName: 'status',
      customBodyRenderer: rowItem => {
        return (
          <Text>
            <Chip
              style={{
                backgroundColor:
                  rowItem?.status === 'uploaded'
                    ? '#acd795'
                    : rowItem?.status === 'embedded'
                    ? '#f5ca9d'
                    : '',
                color: '#555555',
                fontWeight: '400',
                fontSize: '16px',
                height: '30px',
                textTransform: 'capitalize',
                fontFamily: '"Roboto", sans-serif',
              }}>
              {rowItem?.status ? rowItem?.status : ''}
            </Chip>
          </Text>
        );
      },
    },
    {
      label: 'file size',
      fieldName: 'size',
      sort: true,
      style: {
        textAlign: 'left',
      },
    },
    {
      label: 'action',
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => (
        <Text>
          <div
            style={{
              border: '1px solid #d7d7d7',
            }}
            onClick={() => setOpenDeleteModal(rowItem?.uniqueId)}
            className={classes.actionBtn}>
            <span
              className="material-symbols-outlined"
              style={{fontSize: '18px'}}>
              delete
            </span>{' '}
            Remove
          </div>
        </Text>
      ),
    },
  ];

  useEffect(() => {
    getModelFiles();
  }, [searchFile, sortItem, sortOrder, pageNo, status]);

  useEffect(() => {
    isDocumentsAvailable();
  }, []);

  useEffect(() => getModelDetail(), []);

  return (
    <Layout>
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
      <div className={classes.container}>
        {/* upload document modal */}
        <UploadDocumentModal
          open={openModal}
          cancelHandler={() => setOpenModal(false)}
          updateHandler={() => {
            isDocumentsAvailable();
            getModelFiles();
          }} // when the upload is successful this updateHandler is triggered
        />
        {/* delete document modal */}
        <DeleteFileModal
          open={openDeleteModal}
          cancelHandler={() => setOpenDeleteModal(false)}
          deleteHandler={deleteHandler}
        />
        <div className={classes.headerActionContainer}>
          {/* Title of the model is rendered in modelTitleLayout */}
          <ModelTitleLayout title={title} setTitle={updateTitle} />
          <div style={{display: 'flex', gap: '16px'}}>
            <Button
              icon={
                <span
                  style={{fontSize: '22px'}}
                  className="material-symbols-outlined">
                  start
                </span>
              }
              id="next-btn"
              color="primary"
              className={`${
                enableNextBtn ? classes.submitBtn : classes.disabledBtn
              }`}
              onClick={() =>
                enableNextBtn && navigate(`/AI/train/${id}/configure-test`)
              }>
              Next
            </Button>
            {/* <Button
          icon={<span style={{fontSize:"22px"}} className="material-symbols-outlined">check</span>}
          id="complete-btn"
          color="primary"
          className={`${enableCompleteBtn?classes.submitBtn:classes.disabledBtn}`}
          onClick={() => {}}>
          Complete
        </Button> */}
          </div>
        </div>
        <div style={{padding: '24px 24px 0px'}}>
          {/* static stepper component */}
          <UploadDocumentStepper />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Text className={classes.header}>Documents</Text>
            {enableNextBtn && (
              <Button
                type="submit"
                icon={
                  <span
                    style={{fontSize: '20px'}}
                    className="material-symbols-outlined">
                    add
                  </span>
                }
                id="submit-btn"
                color="primary"
                className={classes.submitBtn}
                onClick={() => setOpenModal(true)}>
                Upload Document
              </Button>
            )}
          </div>
          {enableNextBtn ? (
            <>
              {/* renders search fields if in future date search is asked u can enable it by passing props to the component */}
              <UploadDocumentSearchFields
                searchFile={searchFile}
                status={status}
                setStatus={statusHandler}
                setSearchFile={searchFileHandler}
              />
              {/* renders Table and pagination for the train and tune upload document screen */}
              <UploadedDocumentTable
                columns={columns}
                data={data}
                sortItem={sortItem}
                sortOrder={sortOrder}
                loading={loading}
                pageNo={pageNo}
                PagehandleChange={PagehandleChange}
                sortHandler={sortHandler}
              />
            </>
          ) : (
            // if isDocumentAvailable() returns false
            <div className={classes.contentContainer}>
              <Text
                style={{
                  fontSize: '16px',
                  color: '#949494',
                  fontFamily: '"Roboto", sans-serif',
                  textAlign: 'center',
                }}>
                Please provide any relevant documents the organization has for
                upload to proceed with training the model effectively.{' '}
              </Text>
              <div>
                <img style={{width: '124px', height: '102px'}} src={icon} />
              </div>
              <Button
                type="submit"
                icon={
                  <span
                    style={{fontSize: '20px'}}
                    className="material-symbols-outlined">
                    add
                  </span>
                }
                id="submit-btn"
                color="primary"
                className={classes.submitBtn}
                onClick={() => setOpenModal(true)}>
                Upload Document
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrainAIUploadDocuments;

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
    width: '100% !important',
    marginTop: '5px !important',
  },
  header: {
    color: 'rgba(0, 0, 0, 0.99) !important',
    fontSize: '28px !important',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Bold", "Roboto", sans-serif !important',
  },
  headerActionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 24px',
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
    alignItems: 'center !important',
    width: '100% !important',
    marginTop: '18px !important',
    flexDirection: 'column !important',
    gap: '28px !important',
  },
  actionBtn: {
    display: 'flex',
    backgroundColor: '#f7c9ce',
    width: 'fit-content',
    borderRadius: '5px',
    padding: '5px 10px',
    alignItems: 'center',
    gap: '4px',
    height: '30px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#333333',
  },
}));
