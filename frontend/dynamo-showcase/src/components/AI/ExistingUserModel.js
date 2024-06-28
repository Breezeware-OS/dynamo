import React, {useEffect, useState} from 'react';
import {
  Button,
  Table,
  Text,
  TextField,
  Chip,
  Snackbar,
} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import CreateModelModal from './CreateModelModal';
import TablePagination from '../pagination/TablePagination';
import BackendService from '../../service/BackendService';

/**
 *
 * @param {*} timestamp date and time in timestamp
 * @returns returns in format eg: Jan 20 2021
 */
const formatDate = timestamp => {
  const date = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month} ${day}  ${year}`;
};

/**
 *
 * @returns Model Table, Create model
 */
const ExistingUserModel = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [searchModel, setSearchModel] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortItem, setSortItem] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [data, setData] = useState();
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);

  const searchModelHandler = e => {
    setSearchModel(e.target.value);
    setPageNo(0);
  };

  const searchByDate = e => {
    setSearchDate(e.target.value);
    setPageNo(0);
  };

  /**
   * Pagination of user table
   * @param {*} value page number
   */
  const PagehandleChange = value => {
    setPageNo(value - 1);
  };

  const sortHandler = (order, item) => {
    setSortItem(item);
    setSortOrder(order);
    setPageNo(0);
  };

  const getModels = () => {
    setLoading(true);
    const data = {
      pageNo,
      sortItem,
      sortOrder,
      searchDate: searchDate ? new Date(searchDate)?.toISOString() : searchDate,
      searchModel,
    };
    BackendService.getModels(data)
      .then(res => {
        setLoading(false);
        setData(res?.data);
      })
      .catch(err => {
        setLoading(false);
        setNotification(true);
        setNotificationError(true);
        setNotificationMessage(err?.message);
      });
  };

  const columns = [
    {
      label: 'model name',
      fieldName: 'name',
      sort: true,
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      label: 'created date',
      fieldName: 'createdOn',
      sort: true,
      style: {
        textAlign: 'left',
      },
      type: 'date',
      customBodyRenderer: rowItem => (
        <Text
          style={{
            marginLeft: '10px',
            fontSize: '16px',
          }}>
          {rowItem?.createdOn ? formatDate(rowItem?.createdOn) : '-'}
        </Text>
      ),
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
                  rowItem?.status === 'training'
                    ? '#cdd0d3'
                    : rowItem?.status === 'validating'
                    ? '#f5ca9d'
                    : rowItem?.status === 'completed'
                    ? '#c7eac1'
                    : '',
                color: 'black',
                fontWeight: '400',
                fontSize: '14px',
                height: '28px',
                textTransform: 'capitalize',
              }}>
              {rowItem?.status
                ? rowItem?.status === 'training'
                  ? 'In Progress'
                  : rowItem?.status
                : ''}
            </Chip>
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
          {rowItem?.status === 'training' ||
          rowItem?.status === 'validating' ? (
            <div
              style={{
                border: '1px solid #d7d7d7',
              }}
              onClick={() => {
                navigate(`/AI/train/${rowItem?.uniqueId}/upload-document`);
              }}
              className={classes.actionBtn}>
              <span
                className="material-symbols-outlined"
                style={{fontSize: '14px'}}>
                robot_2
              </span>{' '}
              Train
            </div>
          ) : (
            <div style={{display: 'flex', gap: '24px'}}>
              <div
                style={{
                  backgroundColor: '#e6ebf2',
                }}
                onClick={() => {
                  navigate(`/AI/view-model/${rowItem?.uniqueId}`);
                }}
                className={classes.actionBtn}>
                <span
                  className="material-symbols-outlined"
                  style={{fontSize: '14px'}}>
                  visibility
                </span>{' '}
                View
              </div>
              <div
                style={{
                  backgroundColor: '#f7c9ce',
                }}
                className={classes.actionBtn}
                onClick={() => {
                  navigate(`/AI/tune/${rowItem?.uniqueId}/upload-document`);
                }}>
                <span
                  className="material-symbols-outlined"
                  style={{fontSize: '14px'}}>
                  edit
                </span>{' '}
                Tune
              </div>
            </div>
          )}
        </Text>
      ),
    },
  ];

  useEffect(() => {
    getModels();
  }, [sortItem, sortOrder, searchDate, searchModel, pageNo]);

  return (
    <div>
      {' '}
      <Snackbar
        open={notification}
        message={notificationMessage}
        type={notificationError ? 'error' : 'success'}
        onClose={() => setNotification(null)}
      />
      <CreateModelModal
        open={openModal}
        cancelHandler={() => setOpenModal(false)}
        updateHandler={() => getModels()}
      />{' '}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Text className={classes.header}>Models</Text>
        <Button
          type="submit"
          icon={<span className="material-symbols-outlined">add</span>}
          id="submit-btn"
          color="primary"
          className={classes.submitBtn}
          onClick={() => setOpenModal(true)}>
          New Model
        </Button>
      </div>
      <div className={classes.searchContainer}>
        <TextField
          onChange={searchModelHandler}
          icon={<span className="material-symbols-outlined">search</span>}
          placeholder={'Search Model'}
          value={searchModel}
          containerClass={classes.searchField}
        />
        <input
          type="date"
          name="birthdate"
          className={classes.dateField}
          onChange={searchByDate}
          value={searchDate}
        />
        {(searchModel || searchDate) && (
          <Button
            id="clear-btn"
            color="primary"
            className={classes.clearBtn}
            onClick={() => {
              setSearchModel('');
              setSearchDate('');
            }}>
            Clear
          </Button>
        )}
      </div>
      <div
        style={{
          border: '1px solid #d7d7d7',
          borderRadius: '5px',
          boxShadow: '0px 0px 5px 0px #a5a5a5',
        }}>
        <Table
          columns={columns}
          data={data?.content || []}
          sortHandler={sortHandler}
          sortItem={sortItem}
          sortOrder={sortOrder}
          loading={loading}
          progressCircleStyle={{color: '#0a5b99'}}
          message={(!data || data?.content?.length <= 0) && 'No Models to Show'}
          style={{
            border: '0px',
            minWidth: '1000px',
          }}
          tableContainerStyle={{
            borderBottom: '1px solid #d7d7d7',
            borderRadius: '5px',
          }}
          tableHeaderStyle={{height: '40px', backgroundColor: '#E6EBF2'}}
          tableRowStyles={{height: '40px'}}
        />
      </div>
      <TablePagination
        PagehandleChange={PagehandleChange}
        currentPage={data?.number + 1}
        data={data}
        pageNo={pageNo}
      />
    </div>
  );
};

export default ExistingUserModel;

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
  header: {
    color: 'rgba(0, 0, 0, 0.99) !important',
    fontSize: '28px !important',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Bold", "Roboto", sans-serif !important',
  },
  searchContainer: {
    marginBlock: '18px !important',
    padding: '24px !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px !important',
    display: 'flex !important',
    gap: '24px !important',
    flexWrap: 'wrap !important',
  },
  dateField: {
    width: '342px',
    maxWidth: '100%',
    height: '36px',
    borderRadius: '4px',
    border: '1.5px solid #d7d7d7',
    paddingInline: '8px',
    '&:focus-visible': {
      outline: 'none !important',
    },
  },
  searchField: {
    color: 'grey !important',
    width: '100% !important',
    maxWidth: '100% !important',
  },
  actionBtn: {
    display: 'flex',
    backgroundColor: '#ffe2d3',
    width: '72px',
    borderRadius: '5px',
    padding: '5px 10px',
    alignItems: 'center',
    gap: '4px',
    height: '28px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#333333',
  },
  clearBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: '#9b9b9b !important',
    color: '#fff !important',
    '&:hover': {
      backgroundColor: '#9b9b9b !important',
      color: '#fff !important',
    },
  },
}));
