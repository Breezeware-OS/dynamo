import {Backdrop, CircularProgress, Grid} from '@mui/material';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Button, Text} from 'glide-design-system';
import {useNavigate, useParams} from 'react-router-dom';
import React, {useState} from 'react';
import renderComponents from '../applicant/ApplicantUtils';
import {ButtonComponent} from '../../formComponents/Components';
import BackendService from '../../../service/BackendService';
import WorkflowSkeleton from '../../../screens/workflow/WorkflowSkeleton';

const ReviewerForm = ({data}) => {
  const navigate = useNavigate();
  const {applicationId} = useParams();
  const [loader, setLoader] = useState(false);

  const validationSchema = Yup.object().shape(
    JSON.parse(data?.taskForm?.formSchemaAndDataJson).components.reduce(
      (shape, field) => {
        if (field?.validate?.required) {
          const value = field.key?.split('.');
          const shapeValue = value?.length > 1 ? value[1] : value[0];
          shape[shapeValue] = Yup.mixed().required(`${shapeValue} is required`);
        }
        return shape;
      },
      {},
    ),
  );

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: async values => {
      // setLoader(true);
      let formJsonData = JSON.parse(
        data?.taskForm?.formSchemaAndDataJson,
      ).components;

      // eslint-disable-next-line no-restricted-syntax
      for (const obj of formJsonData) {
        const value = obj.key?.split('.');
        const shapeValue = value?.length > 1 ? value?.[1] : value?.[0];
        const key = obj.key || obj.id; // Get the key from 'key' or 'id' property
        // eslint-disable-next-line no-prototype-builtins
        if (values?.hasOwnProperty(shapeValue)) {
          obj.value = values[shapeValue];
        }
      }
      const updatedData = {
        ...data,
        id: data?.application?.id,
      };
      updatedData.taskForm = {
        ...updatedData.taskForm,
        formSchemaAndDataJson: JSON.stringify({
          components: formJsonData,
        }),
      };
      const {contextData, ...updatedFormData} = updatedData;
      // data.formData.data = values
      const submitData = {
        applicationId: applicationId,
        body: updatedData?.taskForm,
      };

      if (window.location.pathname.includes('document')) {
        setLoader(true);

        BackendService.submitReviewConsentDocument(submitData)
          .then(response => {
            setLoader(false);

            navigate('/reviewer-workflow');
          })
          .catch(error => {
            setLoader(false);
          });
      } else {
        setLoader(true);

        BackendService.submitReviewApplication(submitData)
          .then(response => {
            setLoader(false);

            navigate('/reviewer-workflow');
          })
          .catch(error => {
            setLoader(false);
          });
      }
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  return (
    <form
      style={{
        width: '100%',
      }}
      // onSubmit={formik.handleSubmit}
    >
      <Backdrop
        open={loader}
        sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}>
        <CircularProgress />
      </Backdrop>
      <Grid
        container
        style={{
          width: '100%',
          border: '1px solid #d7d7d7',
          borderRadius: '5px',
          padding: '20px',
          display: 'flex',
        }}>
        <Grid
          item
          xs={12}
          padding="12px"
          display={!data?.formData?.formTitle ? 'none' : ''}>
          <Text
            style={{
              textAlign: 'left',
              fontSize: '24px',
              fontWeight: '700',
              // display: !data?.formData?.formTitle ? 'none' : '',
            }}>
            {data?.formData?.formTitle}
          </Text>
        </Grid>
        {JSON.parse(data?.taskForm?.formSchemaAndDataJson).components?.map(
          field => (
            <Grid
              item
              xs={12}
              md={field?.type === 'text' ? 12 : 4}
              paddingRight="16px"
              key={field.id}
              textAlign="center"
              // display="flex"
              // justifyContent="center"
            >
              {renderComponents(field, formik)}
            </Grid>
          ),
        )}
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
          onClick={() => navigate('/reviewer-workflow')}
          color="secondary"
          id="exit-btn">
          Cancel
        </Button>
        <ButtonComponent
          key="form-submit"
          label="Submit"
          // className={component.properties.class}
          onClick={formik.handleSubmit}
        />
      </div>
    </form>
  );
  // </Grid>
};

export default ReviewerForm;
