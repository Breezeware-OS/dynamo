import React, {useEffect, useState} from 'react';
import {
  Alert,
  Divider,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ReactGA from 'react-ga4';

import {makeStyles} from '@material-ui/core';
import 'rsuite/dist/rsuite-no-reset.min.css';
import {DatePicker} from 'rsuite';
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  Table,
  Text,
  TextField,
  Snackbar,
} from 'glide-design-system';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import BackendService from '../../service/BackendService';
import TablePagination from '../../components/pagination/TablePagination';
import {formStatusBackgroundColor} from '../../utils/helperFunction';
import NoDataFound from '../../components/noData/NoDataFound';
import {
  getDeleteModalStatus,
  getPublishModalStatus,
  getVersionModalStatus,
  handleDeleteModal,
  handleFormVersionsModal,
  handlePublishModal,
  setFormData,
} from './formSlice';
import DeleteFormModal from './DeleteFormModal';
import FormVersionsList from './FormVersionsList';
import PublishModal from './PublishModal';
import {logError, loginfo, traceSpan} from '../../helpers/tracing';
import CreateFormModal from './CreateFormModal';
import FormHistoryDrawer from './FormHistoryDrawer';

const BASE_DYNAMO_FORM_URL = process.env.REACT_APP_DYNAMO_FORM_URL + '/form/';

const options = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'GMT',
};

const FormTable = ({activeIndex, retrieveFormCount, user}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const openDeleteModal = useSelector(getDeleteModalStatus);
  const openVersionsModal = useSelector(getVersionModalStatus);
  const openPublishModal = useSelector(getPublishModalStatus);
  const [tableData, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortItem, setSortItem] = useState('modifiedOn');
  const [pageNo, setPageNo] = useState(0);
  const [search, setSearch] = useState('');
  const [rowindex, setRowIndex] = useState();
  const [showMenu, setShowMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [date, setDate] = useState('');
  const [versionData, setVersionData] = useState();
  const [index, setIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedValue, setCopiedValue] = useState(null);
  const [copiedValueId, setCopiedValueId] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [severity, setSeverity] = useState(null);

  const [openFormHistoryDrawer, setOpenFormHistoryDrawer] = useState(false);

  const open = Boolean(showMenu);

  const copyFormUrl = (url, id) => {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);
    setCopiedValue(url);
    setCopiedValueId(id);
    setIsCopied(true);
    setNotificationMessage('Copied!');
    setNotification(true);
    setSeverity('success');
    setTimeout(() => {
      setIsCopied(false);
      setCopiedValue(null);
      setCopiedValueId(null);
    }, 1500);
  };

  let tablecolumns = [
    // {
    //   label: 'formId',
    //   fieldName: 'id',
    //   sort: true,
    //   style: {
    //     textAlign: 'left',
    //   },
    //   customBodyRenderer: rowItem => {
    //     return (
    //       <div onClick={() => navigate(`/edit-form/${rowItem.id}`)}>
    //         <Text
    //           style={{
    //             color: 'rgb(10, 91, 153)',
    //             fontSize: '16px',
    //             cursor: 'pointer',
    //           }}>
    //           #{rowItem.id}
    //         </Text>
    //       </div>
    //     );
    //   },
    // },
    {
      label: 'formName',
      fieldName: 'name',
      sort: true,
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return (
          <div onClick={() => navigate(`/edit-form/${rowItem.id}`)}>
            <Text
              style={{
                color: 'rgb(10, 91, 153)',
                fontSize: '16px',
                cursor: 'pointer',
              }}>
              {rowItem.name}
            </Text>
          </div>
        );
      },
    },
    {
      label: 'status',
      fieldName: 'status',
      sort: true,
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return (
          <Chip
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '5px',
              fontSize: '12px',
              fontWeight: 400,
              textTransform: 'capitalize',
              backgroundColor: formStatusBackgroundColor(rowItem?.status),
              color: '#333333',
            }}>
            {rowItem?.status}
          </Chip>
        );
      },
    },
    {
      label: 'link',
      fieldName: 'description',
      sort: true,
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        if (rowItem.status !== 'Published') {
          return <Text>-</Text>;
        }
        if (rowItem.uniqueId && rowItem.status === 'Published') {
          return (
            <div style={{display: 'flex', alignItems: 'center'}}>
              <a
                style={{cursor: 'pointer'}}
                onClick={() => {
                  window.open(
                    `${BASE_DYNAMO_FORM_URL}${rowItem.uniqueId}`,
                    'incognito',
                  );
                }}>{`${BASE_DYNAMO_FORM_URL}${rowItem.uniqueId}`}</a>
              {!isCopied && (
                <span
                  onClick={() =>
                    copyFormUrl(
                      `${BASE_DYNAMO_FORM_URL}${rowItem.uniqueId}`,
                      rowItem.id,
                    )
                  }
                  style={{
                    cursor: 'pointer',
                    fontSize: '17px',
                    marginLeft: '5px',
                    color: '#B2B2B2',
                  }}
                  class="material-symbols-outlined">
                  content_copy
                </span>
              )}

              {isCopied &&
                copiedValue ===
                  `${BASE_DYNAMO_FORM_URL}${rowItem.uniqueId}` && (
                  <span
                    style={{
                      fontSize: '17px',
                      marginLeft: '5px',
                      color: 'green',
                    }}
                    class="material-symbols-outlined">
                    check
                  </span>
                )}
            </div>
          );
        }
      },
    },
    {
      label: 'createdBy',
      fieldName: 'owner',
      sort: true,
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return rowItem?.owner ? rowItem?.owner : '-';
      },
    },

    {
      label: 'createdDate',
      fieldName: 'createdOn',
      type: 'date',
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
      customBodyRenderer: rowItem => {
        return (
          <div style={{display: 'flex', padding: '5px'}}>
            <Button
              className={classes.editButton}
              onClick={() => {
                // traceSpan('Edit', async () => {
                editForm(rowItem);
                // });
              }}
              style={{
                backgroundColor: 'rgba(230, 235, 242, 1)',
                color: 'black',
                border: '1px solid #d7d7d7',
                height: '33px',
                fontWeight: '400',
              }}>
              <span
                class="material-symbols-outlined"
                style={{fontSize: '18px'}}>
                edit
              </span>
              Edit
            </Button>

            <IconButton
              onClick={e => {
                const index = tableData?.content?.findIndex(
                  item => item?.id === rowItem?.id,
                );
                setRowIndex(index);
                setShowMenu(e.currentTarget);
              }}
              sx={{
                marginLeft: '6%',
                width: '15px',
                backgroundColor: 'transparent',
                ':hover': {
                  backgroundColor: 'transparent',
                },
              }}>
              <span style={{color: 'black'}} class="material-symbols-outlined">
                more_horiz
              </span>
            </IconButton>
          </div>
        );
      },
      // element: (
      //   <span
      //     className="material-symbols-outlined"
      //     data-testid="actions"
      //     style={{
      //       fontWeight: 500,
      //       // height: '10px',
      //       display: 'flex',
      //       alignItems: 'center',
      //       fontSize: '40px',
      //     }}>
      //     more_horiz
      //   </span>
      // ),
    },
  ];

  // closes action menu
  const closeMenu = () => {
    setShowMenu(null);
  };

  /**
   * Action menu is opened on which the user is clicked
   * @param {*} e element
   * @param {*} value row value
   */
  const actionHandler = async (e, value) => {
    const index = await tableData?.content?.findIndex(
      item => item?.id === value?.id,
    );
    setRowIndex(index);
    setShowMenu(e);
  };

  /**
   * Search data on value change
   * @param {*} data input value
   */
  const searchHandler = data => {
    setSearch(data?.target?.value);
  };

  /**
   * Filter data on value change
   * @param {*} data input value
   */
  const filterDateHandler = data => {
    setDate(new Date(data).toISOString());
  };

  /**
   * updates sort order and sort item state when sort button is clicked
   * @param {*} order  order to be sorted(ASC,DESC)
   * @param {*} item item to be sorted(created-on)
   */
  const sortHandler = (sortOrder, sortItem) => {
    const updatedSortItem = sortItem?.startsWith('created')
      ? sortItem?.replace(/o/g, 'O')?.split(' ')?.join('')
      : sortItem;
    setSortItem(updatedSortItem);
    setSortOrder(sortOrder);
    // dispatch(availabilitySliceActions.handleSorting());
  };

  /**
   * Pagination of user table
   * @param {*} value page number
   */
  const PagehandleChange = value => {
    setPageNo(value - 1);
  };

  /**
   * Archive the selected form
   * @param {*} data of selected form
   * updates the formData,opens archive modal
   */
  const archiveForm = data => {
    dispatch(setFormData(data));
    dispatch(handleDeleteModal());
    closeMenu();
  };

  /**
   * View versions of seleted form
   * @param {*} data of selected form
   * updates form data,opens version list modal
   */
  const viewVersions = async data => {
    await BackendService.retrieveListOfFormVersions({id: data?.id})
      .then(res => {
        // loginfo('Form versions', res);
        setVersionData(res.data);
        setOpenFormHistoryDrawer(true);
      })
      .catch(err => {
        // logError('Form versions', err);

        setError(err?.response?.data?.message);
      });
    dispatch(setFormData(data));
    // dispatch(handleFormVersionsModal());
    closeMenu();
  };

  /**
   * Publish selected form
   * @param {*} data of selected form
   * updates formData,opens publish modal
   */
  const publishForm = data => {
    // loginfo('Publish Form', '');

    dispatch(setFormData(data));
    dispatch(handlePublishModal());
    closeMenu();
  };

  /**
   * preview of the selected form
   * @param {*} data of selected form
   * opens new tab
   */
  const previewForm = data => {
    window.open(`/view-form/${data?.id}`, '_blank');
    closeMenu();
  };

  /**
   * navigate to edit form page
   * @param {*} data
   */
  const editForm = data => {
    ReactGA.event({
      category: 'Edit Forms',
      action: 'edit',
      transport: 'xhr',
      label: data?.id,
      page_title: `/edit-form/${data?.id}`,
      // value: 99,
      // nonInteraction: true,
    });
    navigate(`/edit-form/${data?.id}`);
    closeMenu();
  };

  /**
   * retrieve list of forms
   */
  const retrieveData = () => {
    ReactGA.event({
      category: 'Forms',
      action: 'api call',
    });

    // const gaEventTracker = useAnalyticsEventTracker('fetch forms');
    BackendService.retrieveListOfForms({
      search,
      pageNo,
      sortItem,
      sortOrder,
      date: date ? new Date(date).toISOString() : '',
      status: 'all',
    })
      .then(async res => {
        // await loginfo('Form List Success', res);
        setLoader(false);
        setData(res.data);
        setError(false);
      })
      .catch(async err => {
        // await logError('Form List Error', err);

        setLoader(false);
        setError(err?.response?.data?.message);
      });
    retrieveFormCount();
  };

  useEffect(() => {
    setLoader(true);
    // traceSpan('Retrieve List Of Forms', async () => {
    retrieveData();
    // });
  }, [search, sortItem, sortOrder, date, pageNo, activeIndex]);

  return (
    <div>
      <FormHistoryDrawer
        open={openFormHistoryDrawer}
        onClose={() => setOpenFormHistoryDrawer(false)}
        versionData={versionData}
      />
      {/* <Snackbar
        autoHideDuration={1000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={error}>
        <Alert id="alert" severity={'error'}>
          {error}
        </Alert>
      </Snackbar> */}
      {error && (
        <Snackbar
          open={error}
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      {/* <Snackbar
        autoHideDuration={3000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={notification}
        onClose={() => setNotification(false)}>
        <Alert
          id="alert"
          severity={severity}
          onClose={() => setNotification(false)}>
          {notificationMessage}
        </Alert>
      </Snackbar> */}
      <Snackbar
        open={notification}
        message={notificationMessage}
        type={severity}
        onClose={() => setNotification(null)}
      />

      <DeleteFormModal open={openDeleteModal} getData={retrieveData} />
      <FormVersionsList open={openVersionsModal} versionData={versionData} />
      <PublishModal
        open={openPublishModal}
        getData={retrieveData}
        user={user}
      />
      <div>
        <div className={classes.container}>
          <Grid
            container
            display="flex"
            spacing={2}
            flexDirection="row"
            alignItems="center">
            <Grid item xs={12} md={4} lg={2} display="flex" alignItems="center">
              <TextField
                // label="Search"
                placeholder="Search"
                id="search"
                type="search"
                name="search"
                width="100%"
                icon={
                  <span
                    style={{color: '#999999', fontSize: '18px'}}
                    className="material-symbols-outlined">
                    search
                  </span>
                }
                onChange={searchHandler}
                style={{color: 'black'}}
                value={search}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={2} display="flex" alignItems="center">
              {/* <InputLabel>Date</InputLabel> */}
              <DatePicker
                format="MM-dd-yyyy"
                placeholder="mm-dd-yyyy"
                size="md"
                style={{width: '100%'}}
                // placeholder="Date"
                // cleanable={false}
                onClean={e => {
                  e.target.value = '';
                  setData(null);
                }}
                onChange={(val, e) => {
                  setDate(val);
                }}
                value={date}
                renderValue={date => {
                  return `${new Date(date).toLocaleDateString(
                    'en-EN',
                    options,
                  )}`;
                }}
              />
            </Grid>

            <Grid item xs={12} md={4} lg={2}>
              {(search || date) && (
                <Button
                  className={classes.button}
                  onClick={() => {
                    setDate(null);
                    setSearch('');
                  }}>
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
        <div
          style={{
            border: '1px solid #d7d7d7',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px 0px #a5a5a5',
          }}>
          <Table
            columns={tablecolumns}
            data={tableData?.content ? tableData?.content : []}
            sortHandler={sortHandler}
            sortItem={sortItem}
            sortOrder={sortOrder}
            actionHandler={actionHandler}
            loading={loader}
            progressCircleStyle={{color: '#0a5b99'}}
            message={tableData?.content?.length === 0 ? <NoDataFound /> : ''}
            style={{
              border: '0px',
              minWidth: '1000px',
            }}
            tableContainerStyle={{
              borderBottom: '1px solid #d7d7d7',
              borderRadius: '5px',
              // boxShadow: '0px 0px 5px 0px #a5a5a5',
            }}
            tableHeaderStyle={{height: '40px', backgroundColor: '#E6EBF2'}}
            tableRowStyles={{height: '40px'}}
          />
        </div>
        <TablePagination
          PagehandleChange={PagehandleChange}
          currentPage={tableData?.number + 1}
          data={tableData}
          pageNo={pageNo}
        />
      </div>
      <Menu
        anchorEl={showMenu}
        open={open}
        onClose={closeMenu}
        data-testid="action-menu"
        id="action-menu"
        style={{
          minWidth: '118px',
        }}>
        {/* <MenuItem
          className={classes.menuItem}
          id="preview-opt"
          icon={
            <span
              style={{color: ' #2067a7', marginRight: '8px'}}
              className="material-symbols-outlined">
              preview
            </span>
          }
          onClick={() => {
            previewForm(tableData?.content[rowindex]);
          }}>
          Preview
        </MenuItem>
        <Divider /> */}
        {/* <MenuItem
          className={classes.menuItem}
          id="publish-opt"
          icon={
            <span
              style={{color: ' #2067a7', marginRight: '8px'}}
              className="material-symbols-outlined">
              publish
            </span>
          }
          onClick={() => {
            publishForm(tableData?.content[rowindex]);
          }}>
          Publish
        </MenuItem>
        <Divider /> */}
        {/* <MenuItem
          className={classes.menuItem}
          id="edit-opt"
          icon={
            <span
              style={{color: ' #2067a7', marginRight: '8px'}}
              className="material-symbols-outlined">
              edit
            </span>
          }
          onClick={() => {
            // traceSpan('Edit', async () => {
            editForm(tableData?.content[rowindex]);
            // });
          }}>
          Edit
        </MenuItem>
        <Divider /> */}
        {/* <MenuItem
          className={classes.menuItem}
          id="versions-opt"
          icon={
            <span
              style={{color: ' #2067a7', marginRight: '8px'}}
              className="material-symbols-outlined">
              content_copy
            </span>
          }
       
        >
          Duplicate
        </MenuItem> */}
        <Divider />
        <MenuItem
          className={classes.menuItem}
          id="versions-opt"
          icon={
            <span
              style={{marginRight: '8px', fontSize: '20px'}}
              className="material-symbols-outlined">
              history
            </span>
          }
          onClick={() => {
            viewVersions(tableData?.content[rowindex]);
          }}>
          History
        </MenuItem>
        <Divider />
        <MenuItem
          className={classes.menuItem}
          id="delete-opt"
          icon={
            <span
              style={{marginRight: '8px', fontSize: '20px'}}
              className="material-symbols-outlined">
              archive
            </span>
          }
          onClick={() => {
            archiveForm(tableData?.content[rowindex]);
          }}>
          Archive
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FormTable;

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid #DDD',
    borderRadius: '5px',
    padding: '16px 24px',
    marginBottom: '16px',
    boxShadow: '0px 0px 5px 0px #a5a5a5',
  },
  select: {
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #999999',
    backgroundColor: 'transparent',
    color: 'black',
  },
  durationField: {
    color: 'black !important',
    '& .rs-picker-toggle-wrapper': {
      display: 'inline-block',
      maxWidth: '100%',
      verticalAlign: 'middle',
    },
    '& .rs-picker-menu': {
      zIndex: 20000,
    },
    '& .rs-picker-toggle-value': {
      color: 'black !important',
    },
  },
  menuItem: {
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'flex-start',
    padding: '14px !important',
    height: '45px !important',
    alignItems: 'center',
    color: '#333333 !important',
  },

  tabStyle: {
    borderBottom: 'none !important',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },

  editButton: {
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
}));
