import React, {useEffect, useState} from 'react';
import {
  Alert,
  Divider,
  Grid,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import ReactGA from 'react-ga4';
import 'rsuite/dist/rsuite-no-reset.min.css';
import {DatePicker} from 'rsuite';
import {
  Table,
  Text,
  TextField,
  Menu,
  MenuItem,
  Button,
  Snackbar,
} from 'glide-design-system';
import BackendService from '../../service/BackendService';
import DeleteResponseModal from './DeleteResponseModal';
import ViewResponseModal from './ViewResponseModal';
import TablePagination from '../../components/pagination/TablePagination';
import NoDataFound from '../../components/noData/NoDataFound';
import noResponses from '../../assets/icon/no_responses.png';

const options = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'GMT',
};

export default function ResponsesTable({
  formId,
  components,
  currentComponentsArray,
  data,
}) {
  const theme = useTheme();
  const isSmalll = useMediaQuery(theme.breakpoints.down('md'));

  const classes = useStyles();
  const [tableData, setData] = useState([]);
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortItem, setSortItem] = useState('id');
  const [pageNo, setPageNo] = useState(0);
  const [error, setError] = useState(null);
  const [rowindex, setRowIndex] = useState();
  const [showMenu, setShowMenu] = useState(null);
  const [loader, setLoader] = useState(false);
  const open = Boolean(showMenu);

  const [currentResponseData, setCurrentResponseData] = useState(null);

  const [openDeleteResponseModal, setOpenDeleteResponseModal] = useState(false);
  const [openViewResponseModal, setOpenViewResponseModal] = useState(false);

  /**
   * Search data on value change
   * @param {*} data input value
   */
  const searchHandler = data => {
    setSearch(data?.target?.value);
  };

  /**
   * Pagination of user table
   * @param {*} value page number
   */
  const PagehandleChange = value => {
    setPageNo(value - 1);
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
   * retrieve list of responses
   */
  const retrieveData = () => {
    ReactGA.event({
      category: 'response',
      action: 'api call',
    });
    // const gaEventTracker = useAnalyticsEventTracker('fetch forms');
    BackendService.retrieveListOfResponses({
      search,
      pageNo,
      sortItem,
      sortOrder,
      date: date ? new Date(date).toISOString() : '',
      id: formId,
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
        setError(err?.response?.data?.details[0] || 'An error occured.');
      });
  };

  const deleteResponseHandler = data => {
    setCurrentResponseData(data);
    setOpenDeleteResponseModal(true);
    closeMenu();
  };

  const viewResponseHandler = data => {
    setCurrentResponseData(data);
    setOpenViewResponseModal(true);
    closeMenu();
  };

  useEffect(() => {
    // setLoader(true);
    if (formId && data?.version) retrieveData();
  }, [search, sortItem, sortOrder, date]);

  return (
    <div style={{padding: '16px 24px', paddingTop: 0}}>
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
          onClose={() => setError(false)}
        />
      )}
      <DeleteResponseModal
        open={openDeleteResponseModal}
        getData={retrieveData}
        closeModal={() => setOpenDeleteResponseModal(false)}
        currentResponseData={currentResponseData}
      />
      <ViewResponseModal
        open={openViewResponseModal}
        closeModal={() => setOpenViewResponseModal(false)}
        currentResponseData={currentResponseData}
      />

      {(!formId || !data?.version) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginTop: '18px',
            flexDirection: 'column',
            gap: '28px',
          }}>
          <Text style={{fontSize: '16px', color: '#949494'}}>
            No Responses Found
          </Text>
          <img
            style={{width: '210px', height: '135px', marginBottom: '1%'}}
            src={noResponses}
            alt=""
          />
        </div>
      )}

      {formId && data?.version && (
        <div
          className={classes.container}
          style={{
            borderBottom:
              currentComponentsArray?.length > 0 ? 'none' : '1px solid #d7d7d7',
          }}>
          <Grid container display="flex" flexDirection="row">
            <Grid
              item
              xs={12}
              md={4}
              lg={2.3}
              marginRight="16px"
              display="flex"
              alignItems="center"
              marginBottom={isSmalll ? '8px' : '0px'}>
              <TextField
                // label="Search Response ID"
                width="100%"
                id="search"
                type="search"
                placeholder="Search Response ID"
                name="search"
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
            <Grid
              item
              xs={12}
              md={4}
              lg={2.3}
              marginRight="16px"
              display="flex"
              alignItems="center">
              {/* <InputLabel>Date</InputLabel> */}
              <DatePicker
                format="MM-dd-yyyy"
                placeholder="mm-dd-yyyy"
                size="md"
                style={{width: '100%', height: '36px'}}
                // placeholder="Date"
                // cleanable={false}
                onClean={e => {
                  e.target.value = '';
                  setDate(null);
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
            <Grid item xs={12} md={4} lg={2} display="flex" alignItems="center">
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
      )}

      {formId && data?.version && (
        <div
          style={{
            border: '1px solid #d7d7d7',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px 0px #a5a5a5',
          }}>
          <Table
            columns={currentComponentsArray}
            data={tableData?.content ? tableData?.content : []}
            // data={tableData?.content}
            // data={sampleResponse}
            sortHandler={sortHandler}
            sortItem={sortItem}
            sortOrder={sortOrder}
            actionHandler={actionHandler}
            loading={loader}
            progressCircleStyle={{color: '#0a5b99'}}
            message={
              tableData?.content?.length === 0 || !tableData ? (
                <NoDataFound />
              ) : (
                ''
              )
            }
            style={{
              border: '0px',
              minWidth: '1000px',
            }}
            tableContainerStyle={{
              border: '1px solid #d7d7d7',
              borderRadius: '5px',
            }}
            tableHeaderStyle={{height: '40px ', backgroundColor: '#E6EBF2'}}
            tableRowStyles={{height: '40px'}}
          />
        </div>
      )}
      {formId && data?.version && (
        <TablePagination
          PagehandleChange={PagehandleChange}
          currentPage={tableData?.content?.number + 1}
          data={tableData}
          pageNo={pageNo}
        />
      )}

      <Menu
        anchorEl={showMenu}
        open={open}
        onClose={closeMenu}
        data-testid="action-menu"
        id="action-menu"
        style={{
          minWidth: '118px',
        }}>
        <MenuItem
          onClick={() => viewResponseHandler(tableData?.content[rowindex])}
          className={classes.menuItem}
          id="preview-opt"
          icon={
            <span
              style={{color: ' #0A5B99', marginRight: '8px'}}
              className="material-symbols-outlined">
              play_arrow
            </span>
          }>
          View
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => deleteResponseHandler(tableData?.content[rowindex])}
          className={classes.menuItem}
          id="publish-opt"
          icon={
            <span
              style={{color: ' #DF2D43', marginRight: '8px'}}
              className="material-symbols-outlined">
              delete
            </span>
          }>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid #DDD',
    borderRadius: '5px',
    // borderBottom: 'none',
    padding: '16px 24px',
    boxShadow: '0px 0px 5px 0px #a5a5a5',
    marginBottom: '16px',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
}));
