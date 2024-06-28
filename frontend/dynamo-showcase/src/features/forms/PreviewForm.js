import {useParams, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Alert, Backdrop, Grid, IconButton} from '@mui/material';
import {Button, ProgressCricle, Text, Snackbar} from 'glide-design-system';
import BackendService from '../../service/BackendService';
import {logdebug, loginfo, traceSpan} from '../../helpers/tracing';
import Layout from '../../components/layout/Layout';
import {
  AddressComponent,
  CheckboxComponent,
  CheckboxGroupComponent,
  DateComponent,
  DividerComponent,
  EmailComponent,
  FullnameComponent,
  MultiSelectComponent,
  NumberFieldComponent,
  ParagraphComponent,
  PhoneNumberComponent,
  RadioGroup,
  SelectComponent,
  TextAreaComponent,
  TextComponent,
  TextfieldComponent,
} from './RenderGlideComponents';

function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms));
}

function renderComponents(component, formik) {
  switch (component.type) {
    case 'heading':
      return (
        <TextComponent
          key={component.key}
          text={component.text}
          fontSize={component.fontSize}
          bold={component.bold}
          italic={component.italic}
        />
      );
    case 'textField':
      return (
        <TextfieldComponent
          name={component.key}
          placeholder={component.placeholder}
          label={component?.label}
          value={formik.values[component.key]}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e.target.value)}
          // onChange={(e) => {
          //   console.log("textField", e.target.value);
          // }}
          error={formik.errors[component.key]}
          required={component.required}
        />
      );
    case 'datetime':
      return (
        <DateComponent
          name={component.key}
          placeholder={component.label}
          label={component.label}
          value={formik.values[component.key]}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e.target.value)}
          // onChange={(e) => console.log("datetime", e.target.value)}
          error={formik.errors[component.key]}
          required={component?.required}
        />
      );
    case 'textarea':
      return (
        <TextAreaComponent
          name={component.key}
          placeholder={component.placeholder}
          value={formik.values[component.key]}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e.target.value)}
          // onChange={(e) => console.log("textarea", e.target.value)}
          error={formik.errors[component.key]}
          required={component?.required}
          label={component?.label}
        />
      );
    case 'fullname':
      return (
        <FullnameComponent
          name={component.key}
          label={component?.label}
          firstNameLabel={component?.firstNameLabel}
          lastNameLabel={component?.lastNameLabel}
          firstNamePlaceholder={component?.firstNamePlaceholder}
          lastNamePlaceholder={component?.lastNamePlaceholder}
          required={component?.required}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e)}
          // onChange={(e) => console.log("fullname", e)}
          value={formik?.values[component.key]}
          error={formik?.errors[component.key]}
        />
      );
    case 'select':
      return (
        <SelectComponent
          name={component.key}
          label={component.label}
          values={component.options}
          value={formik.values[component.key] || ''}
          onChange={e => formik.setFieldValue(component.key, e)}
          // onChange={(e) => console.log("select", e)}
          error={formik.errors[component.key]}
          required={component.required}
        />
      );
    case 'number':
      return (
        <NumberFieldComponent
          name={component.key}
          placeholder={component.label}
          value={formik.values[component.key]}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e)}
          // onChange={(e) => console.log("number", e)}
          error={formik.errors[component.key]}
          required={component?.required}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          label={component.label}
          name={component.key}
          required={component.required}
          options={component.options}
          key={component.key}
          value={formik.values[component.key]}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e.target.value)}
          // onChange={(e) => console.log("radio", e.target.value)}
          error={formik.errors[component.key]}
        />
      );
    case 'checkbox':
      return (
        <CheckboxComponent
          name={component.key}
          label={component.label}
          value={formik.values[component.key]}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e.target.checked)}
          // onChange={(e) => console.log("checkbox", e.target.checked)}
          error={formik.errors[component.key]}
          required={component?.required}
        />
      );
    case 'checkboxGroup':
      return (
        <CheckboxGroupComponent
          name={component.key}
          label={component?.label}
          options={component?.options}
          // onChange={formik.handleChange}
          // onChange={(e) => console.log("checkbox group", e)}
          onChange={e => formik.setFieldValue(component.key, e)}
          checkBoxValue={component?.value}
          required={component?.required}
          error={formik.errors[component.key]}
          value={formik.values[component.key]}
        />
      );
    case 'multiSelect':
      return (
        <MultiSelectComponent
          name={component.key}
          label={component?.label}
          options={component?.options}
          // onChange={() => {}}
          onChange={e => formik.setFieldValue(component.key, e)}
          required={component?.required}
          error={formik.errors[component.key]}
          value={formik.values[component.key] || ''}
        />
      );
    case 'phoneNumber':
      return (
        <PhoneNumberComponent
          name={component.key}
          label={component?.label}
          // onChange={(e) => console.log("phonenumber", e.target.value)}
          // onChange={formik.handleChange}
          onChange={e => formik.setFieldValue(component.key, e.target.value)}
          required={component?.required}
          setCountryCode={e => {}}
          error={formik.errors[component.key]}
          value={formik.values[component.key]}
        />
      );
    case 'address':
      return (
        <AddressComponent
          name={component.key}
          label={component?.label}
          // onChange={(e) => {}}
          // onChange={formik.handleChange}
          onChange={e => {
            formik.setFieldValue(component.key, e);
          }}
          required={component?.required}
          value={formik.values[component.key] || null}
          placeholder={component?.placeholder}
          error={formik.errors[component.key]}
        />
      );
    case 'email':
      return (
        <EmailComponent
          name={component.key}
          label={component?.label}
          // onChange={(e) => console.log("email", e)}
          onChange={e => formik.setFieldValue(component.key, e)}
          required={component?.required}
          errorMessage={component?.errorMessage}
          placeholder={component?.placeholder}
          value={formik.values[component.key]}
          error={formik.errors[component.key]}
        />
      );
    case 'text':
      return (
        <TextComponent
          key={component.key}
          text={component.text}
          fontSize={component.fontSize}
          bold={component.bold}
          italic={component.italic}
        />
      );
    case 'divider':
      return (
        <DividerComponent width={component?.width} color={component?.color} />
      );
    case 'paragraph':
      return (
        <ParagraphComponent
          key={component.key}
          text={component.text}
          fontSize={component.fontSize}
          bold={component.bold}
          italic={component.italic}
        />
      );
    default:
      console.error(`Unknown component type: ${component.type}`);
      return null;
  }
}

const PreviewForm = () => {
  const {id} = useParams();
  const [formData, setFormData] = useState();
  const [data, setData] = useState();
  // const [initialData, setInitialData] = useState();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  /**
   * Retrievs data from localstorage or from api
   */
  const getData = async () => {
    setLoading(true);
    if (!id) {
      await sleep(2000);
      setFormData(JSON.parse(sessionStorage.getItem('formJson')));
      setLoading(false);
      // loginfo(
      //   'Retrieve form Data from localstorage',

      //   JSON.parse(sessionStorage.getItem('formJson')),
      // );
    } else {
      BackendService.retrieveForm({id: id})
        .then(async res => {
          // loginfo('Retrieve form Data from Api', res);
          await sleep(2000);
          setLoading(false);
          await setFormData(res.data);
        })
        .catch(err => {
          // loginfo('Retrieve form Data from Api Error', err);

          console.log(err?.message);
        });
    }
  };

  /**
   * Validates field based on the given validation type in the json
   */
  const validationSchema = Yup.object().shape(
    formData?.formJson?.components?.reduce((shape, field) => {
      if (field?.required) {
        const fieldDataType = field.dataType;
        if (fieldDataType === 'string') {
          shape[field.key] = Yup.string().required(
            `${field.label} is required`,
          );
        }
        if (fieldDataType === 'array') {
          shape[field.key] = Yup.array()
            .min(1)
            .required(`${field.label} is required`);
        }
        if (fieldDataType === 'number') {
          shape[field.key] = Yup.number().required(
            `${field.label} is required`,
          );
        }
        if (fieldDataType === 'object') {
          shape[field.key] = Yup.object()
            .shape({
              addressline1: Yup.string()
                .trim()
                .required('Address Line 1 is required'),
              city: Yup.string().trim().required('City is required'),
              state: Yup.string().trim().required('State is required'),
              postalCode: Yup.string()
                .trim()
                .required('Postal Code is required'),
            })
            .required(`${Object.keys(field?.label)[0]} is required`);
        }
        if (fieldDataType === 'boolean') {
          shape[field.key] = Yup.bool().required(`${field.label} is required`);
        }
      }
      return shape;
    }, {}),
  );

  const initial = {};
  formData?.formJson?.components?.map(field => {
    if (field.defaultValue) {
      initial[field.key] = field.defaultValue;
    } else {
      initial[field.key] = null;
    }
  });

  const formik = useFormik({
    initialValues: {...initial},
    validationSchema: validationSchema,
    onSubmit: async values => {
      const data = formData;
      // data.formData.data = values;
      console.log('values', values);

      // values.formJson.map(field => {
      //   console.log('label', field.label, 'value', values[field.key]);
      //   if (values[field.key] !== undefined) {
      //     field.value = values[field.key];
      //   }
      //   if (values[field.key] === false) {
      //     field.value = values[field.key];
      //   }
      // });

      // console.log('values json', values.formJson);

      // setData(values);
      // setNotification(true);
      // setNotificationMessage('Form Submitted Successfully');
      // setError(false);
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  useEffect(() => {
    // traceSpan('Preview Form', async () => {
    getData();
    // });

    // Clears the localstorage when the tab is closed
    // const clearLocalStorage = () => {
    //   localStorage.removeItem('formJson');
    // };

    // window.addEventListener('beforeunload', clearLocalStorage);

    // // executed when component exit
    // return () => {
    //   window.removeEventListener('beforeunload', clearLocalStorage);
    // };
  }, []);

  return (
    <Layout>
      {/* <Snackbar
        autoHideDuration={3000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={notification}
        onClose={() => setNotification(false)}>
        <Alert
          id="alert"
          onClose={() => setNotification(false)}
          severity={error ? 'error' : 'success'}>
          {notificationMessage}
        </Alert>
      </Snackbar> */}
      {notification && (
        <Snackbar
          open={notification}
          message={notificationMessage}
          type={error ? 'error' : 'success'}
          onClose={() => setNotification(false)}
        />
      )}
      <Backdrop
        open={loading}
        sx={{backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 12}}>
        <ProgressCricle color="rgb(32, 103, 167)" />
      </Backdrop>

      <form
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        onSubmit={formik.handleSubmit}>
        <Grid
          container
          display="flex"
          flexDirection="row"
          // spacing={2}
          // rowGap={2}
          // columnSpacing={1}
          // border="1px solid #d7d7d7"
          padding="16px"
          borderRadius="5px"
          marginLeft="15px"
          marginTop="15px"
          style={{
            width: '50%',
            // padding: '24px',
            // paddingTop: '16px',
            // paddingBottom: '16px',
            // boxShadow: '0px 0px 5px 0px #a5a5a5',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: '700',
              textTransform: 'capitalize',
            }}>
            Preview
          </Text>
          <Grid
            item
            xs={12}
            container
            // spacing={1}
            style={{
              padding: '24px',
              paddingTop: '16px',
              paddingBottom: '16px',
              boxShadow: '0px 0px 5px 0px #a5a5a5',
              borderRadius: '5px',
            }}>
            {formData?.formJson?.components?.map(field => {
              return (
                <Grid
                  item
                  xs={12}
                  key={field.id}
                  style={{
                    // border: '1px solid #d7d7d7',
                    // borderRadius: '5px',
                    marginBottom: '16px',
                  }}>
                  {renderComponents(field, formik)}
                </Grid>
              );
            })}
            <Grid item xs={12} marginTop={2}>
              <Button
                type="submit"
                // onClick={() => formik.handleSubmit()}
                containerStyle={{display: 'flex', justifyContent: 'end'}}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
};

export default PreviewForm;
