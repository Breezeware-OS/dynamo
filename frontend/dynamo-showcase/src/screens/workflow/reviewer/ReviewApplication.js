import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Grid} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import {Breadcrumbs, Snackbar, Text} from 'glide-design-system';
import BackendService from '../../../service/BackendService';
import HomeIcon from '../../../assets/icon/home.svg';
import ReviewApplicantData from '../../../components/workflow/reviewer/ReviewApplicantData';
import ReviewerForm from '../../../components/workflow/reviewer/ReviewerForm';
import WorkflowSkeleton from '../WorkflowSkeleton';
import Layout from '../../../components/layout/Layout';

const sampleData = {
  contextData: {
    application: {
      id: 1006,
      entityName: 'application',
      entityProperties: {
        firstName: 'Bob',
        middleInitial: 'K',
        lastName: 'Smith',
        gender: 'male',
        dateOfBirth: '01/19/1967',
        language: 'English',
        phoneNumber: '490-232-2322',
        addressLine1: '1101,SpringCreekLane',
        addressLine2: 'Apt3456',
        city: 'Pandora',
        state: 'Navi',
        zipCode: '123456',
        annualIncome: '81000',
        loanAmount: '400000',
        loanTermInYears: '6',
        documentSubmissionOption: 'uploadDocument',
      },
      processInstanceUserDefinitionKey: 'eb6521ac-3044-403e-b3fb-0d100b20f582',
      createdOn: '2023-11-01T06:33:17.586061Z',
      modifiedOn: '2023-11-01T06:33:17.586062Z',
    },
  },
  taskForm: {
    processInstanceUserDefinedKey: 'eb6521ac-3044-403e-b3fb-0d100b20f582',
    taskId: '2251799813689732',
    processName: 'DynamoShowcaseAppProcess',
    taskDefinitionId: 'review-application',
    formSchemaAndDataJson:
      '{"components":[{"text":"# Review Application","type":"text","id":"Field_1mc9kqh","layout":{"row":"Row_1787heu"}},{"key":"applicationReview.reviewerName","label":"Reviewer Name","type":"textfield","validate":{"required":true},"id":"Field_0v13w6h","layout":{"row":"Row_178kayf","columns":3}},{"values":[{"label":"Provided data is correct","value":"providedDataIsCorrect"},{"label":"Data Verified","value":"dataVerified"}],"label":"Verify Data","type":"checklist","layout":{"row":"Row_1rmfa0u","columns":null},"id":"Field_1t2mou1","key":"applicationReview.verifyData","validate":{"required":true}},{"label":"Comments","type":"textarea","layout":{"row":"Row_0m8v245","columns":null},"id":"Field_1977ok2","key":"applicationReview.reviewerComments"}],"schemaVersion":10,"exporter":{"name":"Camunda Modeler","version":"5.14.0"},"type":"default","id":"Form_06wdn7g"}',
    createdOn: '2023-11-01T06:33:21.897+00:00',
    modifiedOn: '2023-11-01T06:33:21.897+00:00',
  },
};

const ReviewApplication = () => {
  const classes = useStyles();
  const {applicationId} = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    if (window.location.pathname.includes('document')) {
      BackendService.fetchReviewApplicationDocumentData({applicationId})
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          setError(err?.response?.data?.message);
        });
    } else {
      BackendService.fetchReviewApplicationData({applicationId})
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          setError(err?.response?.data?.message);
        });
    }
  }, []);

  if (data === null || Object.keys(data).length === 0) {
    return <WorkflowSkeleton />;
  }

  return (
    <Layout>
      <Grid
        //   spacing={1}
        item
        container
        style={{paddingInline: '24px', marginTop: '16px'}}>
        {/* <Snackbar
          id="alert-message"
          style={{zIndex: '1'}}
          open={error}
          message={error}
          type={error ? 'error' : 'success'}
          autoHideDuration={5000}
          onClose={() => setError(null)}
        /> */}
        {error && (
          <Snackbar
            open={error}
            message={error}
            type={error ? 'error' : 'success'}
            onClose={() => setError(null)}
          />
        )}

        <Grid item xs={12} marginBottom="16px">
          <Breadcrumbs separator=">" style={{margin: 0}}>
            <Text href="/" style={{color: ' #aaaaaa', fontSize: '14px'}}>
              <img style={{marginRight: '5px'}} src={HomeIcon} alt="" />
              Home
            </Text>
            <Text style={{color: ' #aaaaaa', fontSize: '14px'}}>Workflow</Text>
            <Text style={{color: ' #aaaaaa', fontSize: '14px'}}>Task</Text>
          </Breadcrumbs>
        </Grid>
        <div className={classes.container} id="head-container">
          <Text type="h1" className={classes.header} id="header">
            Application #12345
          </Text>
        </div>
        <Grid item xs={12} paddingY={1}>
          <ReviewApplicantData
            data={data?.contextData ? data?.contextData : {}}
          />
        </Grid>
        <Grid item xs={12} paddingY={1}>
          <ReviewerForm data={data ? data : {}} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ReviewApplication;

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
