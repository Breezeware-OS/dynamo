import React, {useEffect, useState} from 'react';
import {Button, Chip, Text, Snackbar} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import {useParams} from 'react-router-dom';
import {Backdrop, CircularProgress} from '@mui/material';
import UploadDocumentSearchFields from '../../components/AI/UploadDocumentSearchFields';
import UploadedDocumentTable from '../../components/AI/UploadedDocumentTable';
import ModelTitleLayout from '../../components/AI/ModelTitleLayout';
import DeleteFileModal from '../../components/AI/DeleteFileModal';
import UploadDocumentModal from '../../components/AI/UploadDocumentModal';
import icon from '../../assets/icon/Upload.png';
import BackendService from '../../service/BackendService';
import TuneNavLayout from '../../components/AI/TuneNavLayout';
import Layout from '../../components/layout/Layout';

/**
 * @returns new component when there is no documents available or shows documents table
 */
const formatDate = timestamp => {
  const date = new Date(timestamp);
  const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-based
  const day = date?.getDate().toString().padStart(2, '0');
  const year = date?.getFullYear();
  let hours = date?.getHours();
  const minutes = date?.getMinutes().toString().padStart(2, '0');
  const amPM = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert hours to 12-hour format

  return `${month}/${day}/${year} ${hours}:${minutes} ${amPM}`;
};

/**
 * @returns new component when there is no documents available or shows documents table
 */
const TuneAIUploadDocuments = () => {
  const classes = useStyles();
  const {id} = useParams();

  const [title, setTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState();
  const [searchFile, setSearchFile] = useState('');
  const [status, setStatus] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [sortItem, setSortItem] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const searchFileHandler = e => {
    setPageNo(0);
    setSearchFile(e);
  };

  const searchDateHandler = e => {
    setPageNo(0);
    setSearchDate(e);
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
      searchDate: searchDate ? new Date(searchDate)?.toISOString() : searchDate,
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
   * checks whether the documents where uploaded or not to decide which one should be shown document table component or new document component
   */
  const isDocumentsAvailable = () => {
    BackendService.isDocumentsAvailable(id)
      .then(res => {
        setShowTable(res?.data);
      })
      .catch(err => {
        setShowTable(false);
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
    const data = {
      'model-name': e,
    };
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
      label: 'uploaded on',
      fieldName: 'createdOn',
      sort: true,
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return (
          <Text
            style={{
              color: '#555555',
              fontWeight: '400',
              fontSize: '16px',
              fontFamily: '"Roboto", sans-serif',
            }}>
            {formatDate(rowItem?.createdOn)}
          </Text>
        );
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
  }, [searchFile, sortItem, sortOrder, pageNo, status, searchDate]);

  useEffect(() => {
    isDocumentsAvailable();
  }, []);

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
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
          }}>
          <TuneNavLayout />
          <div className={classes.documentContainer}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Text className={classes.header}>Documents</Text>
              {showTable && (
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
            {showTable ? (
              <>
                {/* renders search fields  */}
                <UploadDocumentSearchFields
                  showDate
                  searchDate={searchDate}
                  setSearchDate={searchDateHandler}
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
      </div>
    </Layout>
  );
};

export default TuneAIUploadDocuments;

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
    marginBlock: '18px !important',
    gap: '28px !important',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  documentContainer: {
    padding: '24px 24px 0px 0px',
    [theme.breakpoints.down('900')]: {
      padding: '24px 24px 0px',
    },
    flex: '1',
    width: 'calc(100% - 308px)',
  },
}));
