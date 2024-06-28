import React, {useEffect} from 'react';
import {Grid} from '@mui/material';
import {Text, Breadcrumbs, Snackbar} from 'glide-design-system';
import {useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import HomeIcon from '../../assets/icon/home.svg';
import ApplicantDetailsForm from '../../components/workflow/applicant/ApplicantDetailsForm';
import {
  applicantWorkflowFormSliceActions,
  fetchWorkflowApplicantDetail,
  fetchWorkflowApplicantForm,
} from './ApplicantWorkflowFormSlice';
import WorkflowSkeleton from './WorkflowSkeleton';
import Layout from '../../components/layout/Layout';

export default function StartApplicantWorkflow() {
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const workflowNotification = useSelector(
    state => state.applicantWorkflowForm.notification,
  );
  const workflowMessage = useSelector(
    state => state.applicantWorkflowForm.message,
  );
  const workflowError = useSelector(state => state.applicantWorkflowForm.error);
  const applicantData = useSelector(
    state => state.applicantWorkflowForm.applicantDetail,
  );

  const workflowStatus = useSelector(
    state => state.applicantWorkflowForm.status,
  );

  const applicationForm = useSelector(
    state => state.applicantWorkflowForm.formData,
  );

  const isStartApplication = useSelector(
    state => state.applicantWorkflowForm.isStartApplication,
  );

  useEffect(() => {
    if (isStartApplication) {
      dispatch(fetchWorkflowApplicantDetail(id))
        .then(res => {
          setTimeout(() => {
            dispatch(
              fetchWorkflowApplicantForm(res?.payload?.applicationId),
            ).catch(err => {
              navigate('/applicant-workflow');
            });
          }, 10000);
        })
        .catch(err => {
          navigate('/applicant-workflow');
        });
    }
  }, []);

  if (workflowStatus === 'loading' || applicationForm?.length === 0) {
    return <WorkflowSkeleton />;
  }

  return (
    <Layout>
      <Grid
        container
        style={{paddingInline: '25px', marginTop: '10px'}}
        spacing={1}>
        {workflowNotification && (
          // <Snackbar
          //   id="alert-message"
          //   style={{zIndex: '1'}}
          //   open
          //   message={workflowMessage}
          //   type={workflowError ? 'error' : 'success'}
          //   autoHideDuration={5000}
          //   onClose={() =>
          //     dispatch(applicantWorkflowFormSliceActions.closeNotification())
          //   }
          // />
          <Snackbar
            open
            message={workflowMessage}
            type={workflowError ? 'error' : 'success'}
            onClose={() =>
              dispatch(applicantWorkflowFormSliceActions.closeNotification())
            }
          />
        )}
        {applicationForm?.length !== 0 && (
          <Grid item xs={12}>
            <Breadcrumbs separator=">" style={{margin: 0}}>
              <Text href="/" style={{color: ' #aaaaaa', fontSize: '14px'}}>
                <img style={{marginRight: '5px'}} src={HomeIcon} alt="" />
                Home
              </Text>
              <Text
                href="/applicant-workflow"
                style={{color: ' #aaaaaa', fontSize: '14px'}}>
                Workflow
              </Text>
              <Text style={{color: ' #aaaaaa', fontSize: '14px'}}>
                Task #{applicantData?.id}
              </Text>
            </Breadcrumbs>
          </Grid>
        )}

        <Grid item xs={12}>
          <Text type="h1">Application #{applicantData?.id}</Text>
        </Grid>

        <Grid item xs={12}>
          <ApplicantDetailsForm />
        </Grid>
      </Grid>
    </Layout>
  );
}
