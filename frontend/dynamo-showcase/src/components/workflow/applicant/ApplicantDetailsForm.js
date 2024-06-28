/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import React, {useState} from 'react';
import {Card, Text, Button} from 'glide-design-system';
import {Backdrop, CircularProgress, Grid} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
// import {applicationForm} from './ApplicationForm';
import renderComponents from './ApplicantUtils';
import WorkflowSkeleton from '../../../screens/workflow/WorkflowSkeleton';
import {
  applicantWorkflowFormSliceActions,
  completeWorkflowApplicantForm,
} from '../../../screens/workflow/ApplicantWorkflowFormSlice';
import ButtonComponent from './formElements/ButtonComponent';
import BackendService from '../../../service/BackendService';

export default function ApplicantDetailsForm() {
  const [initialData, setInitialData] = useState();
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();

  const applicantData = useSelector(
    state => state.applicantWorkflowForm.applicantDetail,
  );

  const applicationForm = useSelector(
    state => state.applicantWorkflowForm.formData,
  );

  const validationSchema = Yup.object().shape(
    JSON.parse(
      applicationForm?.taskForm?.formSchemaAndDataJson,
    ).components.reduce((shape, field) => {
      if (field?.validate?.required) {
        const value = field.key?.split('.');
        const shapeValue = value?.length > 1 ? value[1] : value[0];
        shape[shapeValue] = Yup.mixed().required(`${shapeValue} is required`);
      }
      return shape;
    }, {}),
  );

  const formik = useFormik({
    initialValues: {...initialData},
    validationSchema: validationSchema,
    onSubmit: async values => {
      if (!values?.documentSubmissionOption) {
        values.documentSubmissionOption = 'uploadDocument';
      } else {
        values.documentSubmissionOption = 'uploadDocument';
      }

      let formJsonData = JSON.parse(
        applicationForm?.taskForm?.formSchemaAndDataJson,
      ).components;
      for (const obj of formJsonData) {
        const value = obj.key?.split('.');
        const shapeValue = value?.length > 1 ? value?.[1] : value?.[0];
        const key = obj.key || obj.id; // Get the key from 'key' or 'id' property
        if (values?.hasOwnProperty(shapeValue)) {
          obj.value = values[shapeValue];
        }
      }
      const updatedData = {
        ...applicationForm,
        id: applicantData?.applicationId,
      };
      updatedData.taskForm = {
        ...updatedData.taskForm,
        formSchemaAndDataJson: JSON.stringify({
          components: formJsonData,
        }),
      };
      const {contextData, ...updatedFormData} = updatedData;
      // data.formData.data = values
      if (window.location.pathname.includes('APPLICATION_REVIEWED')) {
        setLoader(true);
        BackendService.completeWorkflowApplicantDocument({
          applicationId: id,
          body: updatedFormData?.taskForm,
        })
          .then(() => {
            setLoader(false);
            dispatch(applicantWorkflowFormSliceActions.setFormData([]));
            navigate('/applicant-workflow');
          })
          .catch(() => {
            setLoader(false);

            dispatch(applicantWorkflowFormSliceActions.setFormData([]));
            navigate('/applicant-workflow');
          });
      } else {
        setLoader(false);
        dispatch(completeWorkflowApplicantForm(updatedFormData))
          .then(() => {
            dispatch(applicantWorkflowFormSliceActions.setFormData([]));
            navigate('/applicant-workflow');
          })
          .catch(() => {
            dispatch(applicantWorkflowFormSliceActions.setFormData([]));
            navigate('/applicant-workflow');
          });
      }
      await axios
        .put('http://192.168.29.181:8080/api/update-form', data)
        .then(res => {
          // console.log(res);
        })
        .catch(err => {
          // console.log(err);
        });
      setData(values);
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  // if (loader) {
  //   return <WorkflowSkeleton />;
  // }

  return (
    <Grid container>
      <Backdrop
        open={loader}
        sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}>
        <CircularProgress />
      </Backdrop>
      <Grid item xs={12} padding={0}>
        <form
          style={{
            width: '100%',
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            // flexDirection: 'column',
          }}
          // onSubmit={formik.handleSubmit}
        >
          <Grid
            container
            display="flex"
            // flexDirection="row"
            // spacing={2}
            border="1px solid #d7d7d7"
            borderRadius="5px"
            marginLeft="3px"
            marginTop="10px"
            style={{width: '100%'}}>
            <Grid item xs={12} padding="12px">
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: '24px',
                  fontWeight: '700',
                }}>
                {applicationForm?.formData?.formTitle}
              </Text>
            </Grid>
            {JSON.parse(
              applicationForm?.taskForm?.formSchemaAndDataJson,
            ).components?.map(field => (
              <Grid
                item
                xs={12}
                md={field?.type === 'text' ? 12 : 4}
                paddingRight="16px"
                key={field.id}
                textAlign="center"
                padding={2}
                // display="flex"
                // justifyContent="center"
              >
                {renderComponents(field, formik)}
              </Grid>
            ))}
          </Grid>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              marginTop: '14px',
              width: '100%',
            }}>
            <Button
              onClick={() => navigate('/applicant-workflow')}
              color="secondary"
              id="exit-btn">
              Exit
            </Button>
            <ButtonComponent
              key="form-submit"
              label="Submit"
              // className={component.properties.class}
              onClick={formik.handleSubmit}
            />
          </div>
        </form>
      </Grid>
    </Grid>
  );
}

// cancelBtn: {
//   fontSize: '14px !important',
//   fontFamily: 'Roboto, sans-serif !important',
//   padding: '5px 10px !important',
//   textAlign: 'center !important',
//   textTransform: 'none !important',
// },
