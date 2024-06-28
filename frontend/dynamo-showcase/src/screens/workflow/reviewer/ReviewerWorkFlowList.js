import {Grid} from '@mui/material';
import {
  Button,
  Pagination,
  Snackbar,
  Tab,
  Text,
  TextField,
} from 'glide-design-system';
import {Breadcrumbs} from 'glide-design-system/dist/components/breadcrumbs/Breadcrumbs';
import {makeStyles} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import {DateRangePicker} from 'rsuite';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import ReviewerWorkFlowTable from '../../../components/workflow/reviewer/ReviewerWorkFlowTable';
import {
  fetchReviewerWorkflowCount,
  fetchReviewerWorkflowData,
  reviewerWorkflowActions,
} from '../../../components/workflow/reviewer/ReviewerWorkflowSlice';
import styles from '../ApplicantWorkflow.module.css';
import {reviewerWorkflowFormSliceActions} from './ReviewweWorkflowSlice';
import HomeIcon from '../../../assets/icon/home.svg';
import searchIcon from '../../../assets/icon/search_icon.svg';
import Layout from '../../../components/layout/Layout';

const options = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'GMT',
};

function convertDate(str) {
  const date = new Date(str);
  const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return [date.getFullYear(), mnth, day].join('-') + `T00:00:00.000000Z`;
}
const ReviewerWorkFlowList = ({user}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // sort handlers
  const [sortItem, setSortItem] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const sortHandler = (order, item) => {
    setSortItem(item);
    setSortOrder(order);
    fetchWorkflowData({
      sortItem: item,
      sortOrder: order,
    });
  };

  // Tab Handlers
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = index => {
    setTabIndex(index);
    fetchWorkflowData({tabIndex: index});
  };

  // filter opptions
  const [filterRange, setFilterRange] = useState();
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  // selectors
  const workflowNotification = useSelector(
    state => state.reviewerWorkflow.notification,
  );
  const workflowMessage = useSelector(state => state.reviewerWorkflow.message);
  const workflowError = useSelector(state => state.reviewerWorkflow.error);
  const workflowStatus = useSelector(state => state.reviewerWorkflow.status);

  const reviewerWorkflowData = useSelector(
    state => state.reviewerWorkflow.workflowData,
  );

  const workflowDataCount = useSelector(
    state => state.reviewerWorkflow.workflowDataCount,
  );

  const fetchWorkflowData = args => {
    const params = {
      userId: user?.username,
      searchText: args?.searchText || '',
      filterFromDate:
        args?.filterFromDate === null
          ? null
          : args?.filterFromDate
          ? convertDate(args?.filterFromDate)
          : filterRange?.length > 0
          ? convertDate(filterRange[0])
          : null,
      filterToDate:
        args?.filterToDate === null
          ? null
          : args?.filterToDate
          ? convertDate(args?.filterToDate)
          : filterRange?.length > 0
          ? convertDate(filterRange[1])
          : null,
      sortItem: args?.sortItem || sortItem,
      sortOrder: args?.sortOrder || sortOrder,
      page:
        Number(args?.page) - 1 === 0 ? 0 : Number(args?.page) - 1 || page - 1,
      status:
        args?.tabIndex === 0
          ? 'all'
          : args?.tabIndex === 1
          ? 'in_progress'
          : args?.tabIndex === 2
          ? 'completed'
          : 'all',
    };
    dispatch(fetchReviewerWorkflowData(params));
  };

  const PagehandleChange = value => {
    if (value !== page) {
      setPage(value);
    }
  };

  const fetchWorkflowCount = () => {
    const params = {
      userId: user?.username,
    };

    dispatch(fetchReviewerWorkflowCount(params));
  };

  const startWorkflowHandler = () => {
    dispatch(reviewerWorkflowFormSliceActions.handleIsStartApplication(true));
    dispatch(reviewerWorkflowFormSliceActions.setStatus('loading'));
    navigate(`/start-workflow/${user?.username}`);
  };

  useEffect(() => {
    fetchWorkflowData();
    fetchWorkflowCount();
  }, [page]);

  return (
    <Layout>
      <Grid
        //   spacing={1}
        item
        container
        style={{paddingInline: '25px', marginTop: '15px'}}>
        {workflowNotification && (
          // <Snackbar
          //   id="alert-message"
          //   style={{zIndex: '1'}}
          //   open
          //   message={workflowMessage}
          //   type={workflowError ? 'error' : 'success'}
          //   autoHideDuration={5000}
          //   onClose={() =>
          //     dispatch(reviewerWorkflowActions.closeNotification())
          //   }
          // />
          <Snackbar
            open
            message={workflowMessage}
            type={workflowError ? 'error' : 'success'}
            onClose={() =>
              dispatch(reviewerWorkflowActions.closeNotification())
            }
          />
        )}
        <Grid item xs={12} marginBottom="16px">
          <Breadcrumbs separator=">" style={{margin: 0}}>
            <Text href="/" style={{color: ' #aaaaaa', fontSize: '14px'}}>
              <img style={{marginRight: '5px'}} src={HomeIcon} alt="" />
              Home
            </Text>
            <Text style={{color: ' #aaaaaa', fontSize: '14px'}}>Workflow</Text>
          </Breadcrumbs>
        </Grid>

        <div className={classes.container} id="head-container">
          <Text type="h1" className={classes.header} id="header">
            Workflow - Reviewer
          </Text>
          {/* <Button
          className={classes.addBtn}
          id="add-btn"
          onClick={startWorkflowHandler}
          style={{fontSize: '16px'}}
          icon={<span className="material-symbols-outlined">play_arrow</span>}>
          Start New Application
        </Button> */}
        </div>

        <Grid item xs={12}>
          <Tab
            data-testid="custom-element" // update glide to access this property
            key="workflow-tabs"
            onTabChange={handleTabChange}
            activeIndex={tabIndex}
            containerClass={classes.workflowTab}
            // indicatorStyle="bottomLine"
            // disabled
            // style={{
            //   width: '106px',
            //   marginBottom: 0,
            //   borderBottom: '0px',
            // }}
            className={styles.tabs}>
            <div
              id="tab-all-workflow" // update glide to access the ID property instead of default one
              label={`All (${
                workflowDataCount?.all ? workflowDataCount?.all : '0'
              })`}
            />

            <div
              id="tab-in-progress-workflow"
              label={`In-Progress (${
                workflowDataCount?.in_progress
                  ? workflowDataCount?.in_progress
                  : '0'
              })`}
            />

            <div
              id="tab-completed-workflow"
              label={`Completed (${
                workflowDataCount?.completed
                  ? workflowDataCount?.completed
                  : '0'
              })`}
            />
          </Tab>
        </Grid>
        <Grid item container xs={12} className={classes.tableContainer}>
          <Grid item xs={12} md={3} padding={2}>
            <TextField
              id="search-workflow"
              placeholder="Search Application ID"
              width="100%"
              icon={<img src={searchIcon} alt="" />}
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value);
                setPage(1);
                fetchWorkflowData({
                  searchText: e.target.value,
                  page: 1,
                });
              }}
              className={classes.field}
              search-workflow
            />
          </Grid>
          <Grid item xs={12} md={3} padding={2}>
            {/* <DatePicker
                placeholder="dd-mm-yyyy"
                format="dd-MM-yyyy"
                size="md"
                character="-"
                className={classes.field}
                onChange={value => {
                  setFilterDate(value);
                  fetchWorkflowData({filterDate: value});
                }}
                value={filterDate}
                renderValue={date => {
                  return `${new Date(date).toLocaleDateString('en-EN', options)}`;
                }}
              /> */}
            <DateRangePicker
              id="applicant-create-date-picker"
              className={classes.field}
              value={filterRange?.length > 0 ? filterRange : []}
              renderValue={range => {
                return `${new Date(range[0]).toLocaleDateString(
                  'en-EN',
                  options,
                )} - ${new Date(range[1]).toLocaleDateString(
                  'en-EN',
                  options,
                )}`;
              }}
              character="-"
              placeholder="dd-mm-yyyy"
              format="MMM-dd-yyyy"
              onChange={value => {
                setFilterRange(value);
                setPage(1);
                if (value?.length > 0) {
                  fetchWorkflowData({
                    filterFromDate: value[0],
                    filterToDate: value[1],
                    page: 1,
                  });
                } else {
                  fetchWorkflowData({
                    filterFromDate: null,
                    filterToDate: null,
                    page: 1,
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ReviewerWorkFlowTable
              loading={workflowStatus === 'loading'}
              data={reviewerWorkflowData || []}
              message={
                (reviewerWorkflowData?.content?.length === 0 ||
                  !reviewerWorkflowData) &&
                'No Data Found'
              }
              status={
                tabIndex === 0
                  ? 'all'
                  : tabIndex === 1
                  ? 'in-progress'
                  : tabIndex === 2
                  ? 'completed'
                  : 'all'
              }
              sortHandler={sortHandler}
              sortItem={sortItem}
              sortOrder={sortOrder}
              user={user}
            />
          </Grid>
        </Grid>

        {/* <Grid item container xs={12} marginTop={2}>
            <Grid item xs={6}>
              <Text style={{fontWeight: 400}}>
                Showing {applicantWorkflowData?.numberOfElements} of{' '}
                {applicantWorkflowData?.totalElements || 0} results
              </Text>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
              <Pagination
                count={applicantWorkflowData?.totalPages || 0}
                variant="outlined"
                color="#0a5b99"
                // style={{width: '24px', height: '24px'}}
                page={page}
                onChange={value => {
                  console.log('value', value);
                  setPage(value);
                  fetchWorkflowData({page: value});
                }}
              />
            </Grid>
          </Grid> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: '14px',
            width: '100%',
          }}>
          <p className={classes.pageInfo} id="page-info">
            Showing {'  '}
            {reviewerWorkflowData?.length !== 0
              ? reviewerWorkflowData?.content?.length !== 0
                ? String(page > 1 ? (page - 1) * 15 + 1 : 1).padStart(2, '0')
                : '0'
              : '0'}
            -
            {reviewerWorkflowData?.length !== 0
              ? reviewerWorkflowData?.content?.length !== 0
                ? String(
                    page > 1
                      ? (page - 1) * 15 + reviewerWorkflowData?.content?.length
                      : reviewerWorkflowData?.content?.length,
                  ).padStart(2, '0')
                : '0'
              : '0'}{' '}
            {'  '}
            of {'  '}
            {reviewerWorkflowData?.length !== 0
              ? reviewerWorkflowData?.totalElements !== 0
                ? String(reviewerWorkflowData?.totalElements).padStart(2, '0')
                : '0'
              : '0'}{' '}
            {'  '}
            entries
          </p>
          <Pagination
            count={reviewerWorkflowData?.totalPages || 0}
            variant="outlined"
            color="#0a5b99"
            page={page}
            onChange={PagehandleChange}
          />
        </div>
      </Grid>
    </Layout>
  );
};

export default ReviewerWorkFlowList;

const useStyles = makeStyles(() => ({
  workflowTab: {
    borderBottom: '0px !important',
  },
  tableContainer: {
    border: '1px solid #d7d7d7',
    borderRadius: '5px',
    borderTopLeftRadius: '0px',
  },

  field: {
    color: 'black',
    width: '340px',
  },
  addBtn: {
    marginLeft: 'auto !important',
    backgroundColor: '#2067a7 !important',
    color: 'white !important',
    fontSize: '16px !important',
    textTransform: 'none !important',
    borderRadius: '5px !important',
    fontWeight: '400',
  },
  header: {
    fontSize: '24px !important',
    fontWeight: '700 !important',
    fontFamily: '"Roboto Bold", "Roboto", sans-serif !important',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100% !important',
    marginBottom: '11px !important',
  },
}));
