import {useParams, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Alert, Backdrop, Grid} from '@mui/material';
import {Button, ProgressCricle, Text, Snackbar} from 'glide-design-system';
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

import useDocumentTitle from '../../helpers/useDocumentTitle';
import DynamoLogo from '../../assets/logo/dynamo.png';

import BackendService from '../../service/BackendService';
import FormUnauthorized from './FormUnauthorized';

function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Renders the component based on the Json given
 * @param {*} component Json Object
 * @param {*} formik to handel errors
 * @returns component of given json type
 */
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

export default function ViewForm() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState();
  const [data, setData] = useState();
  const [initialData, setInitialData] = useState();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [error, setError] = useState(false);

  const [userNotFound, setUserNotFound] = useState(false);

  useDocumentTitle('Submit response');

  /**
   * Retrievs data from localstorage or from api
   */
  const getData = async () => {
    setLoading(true);
    localStorage.setItem('formId', id);

    BackendService.getFormForUser(id)
      .then(async res => {
        // loginfo('Retrieve form Data from Api', res);
        setInitialData(res.data);
        await sleep(2000);
        setLoading(false);
        setFormData(res.data);
      })
      .catch(err => {
        // loginfo('Retrieve form Data from Api Error', err);
        if (err?.response?.data?.details[0] === 'User not authenticated.') {
          navigate('/');
        } else if (
          err?.response?.data?.details[0] === 'User not found in the system.' ||
          err?.response?.data?.details[0] ===
            'You do not have access to the form.'
        ) {
          setUserNotFound(true);
        }
      });
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
      initial[field.key] = '';
    }
  });

  const formik = useFormik({
    initialValues: {...initial},
    validationSchema: validationSchema,
    onSubmit: async values => {
      const data = formData;
      // data.formData.data = values;

      const responseComponents = [];
      formData?.formJson?.components.map(component => {
        if (values.hasOwnProperty(component?.key)) {
          const newComponent = {
            ...component,
            value: values[component?.key],
          };
          responseComponents.push(newComponent);
        }
      });

      const postData = {
        formUniqueId: id,
        responseJson: {components: responseComponents},
        email: localStorage.getItem('userEmail'),
      };

      BackendService.submitUserResponse(postData)
        .then(() => {
          setNotification(true);
          setNotificationMessage('Form Submitted Successfully');
          setError(false);
          localStorage.removeItem('formId');
          localStorage.removeItem('userEmail');
          navigate('/form/feedback');
        })
        .catch(error => {
          setNotification(true);
          setNotificationMessage(
            'An error occured while saving form. Please try again.',
          );
          setError(true);
        });

      setData(values);
      setNotification(true);
      setNotificationMessage('Form Submitted Successfully');
      setError(false);
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {userNotFound && <FormUnauthorized />}
      {!userNotFound && (
        <>
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
              rowGap={1}
              columnSpacing={1}
              marginBottom={2}
              style={{
                width: '50%',
                padding: '24px',
                paddingTop: '16px',
                paddingBottom: '16px',
                border: '1px solid #d7d7d7',
                borderRadius: '5px',
                marginLeft: '15px',
                marginTop: '15px',
                boxShadow: '0px 0px 5px 0px #a5a5a5',
              }}>
              {/* <Grid item xs={12}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: '24px',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                  }}>
                  {formData?.name}
                </Text>
              </Grid> */}
              {formData?.formJson?.components?.map(field => (
                <Grid item xs={12} key={field.id}>
                  {renderComponents(field, formik)}
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  // onClick={() => formik.handleSubmit()}
                  containerStyle={{display: 'flex', justifyContent: 'end'}}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>

          <div
            style={{
              //   bottom: 0,
              //   position: 'fixed',
              //   left: '48%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
            }}>
            <p style={{marginTop: '8px', marginRight: '4px'}}>Powered by </p>
            <img style={{width: '100px', height: '40px'}} src={DynamoLogo} />
          </div>
        </>
      )}
    </div>
  );
}
