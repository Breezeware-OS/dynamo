import {Backdrop, CircularProgress} from '@mui/material';
import {useParams} from 'react-router-dom';
import React, {useState} from 'react';
import TextComponent from './formElements/TextComponent';
import TextfieldComponent from './formElements/TextfieldComponent';
import TextAreaComponent from './formElements/TextAreaComponent';
import NumberFieldComponent from './formElements/NumberFieldComponent';
import SelectComponent from './formElements/SelectComponent';
import MultiSelectComponent from './formElements/MultiSelectComponent';
import RadioComponent from './formElements/RadioComponent';
import CheckListComponent from './formElements/CheckListComponent';
import CheckBoxComponent from './formElements/CheckBoxComponent';
import ButtonComponent from './formElements/ButtonComponent';
import FileComponent from './formElements/FileComponent';
import BackendService from '../../../service/BackendService';

function renderComponents(component, formik) {
  const {id} = useParams();
  const [loader, setLoader] = useState(false);

  //   if (!component || !formik) throw new Error('Missing component or Formik')
  // setTimeout(() => {

  const value = component.key?.split('.');
  const shapeValue = value?.length > 1 ? value?.[1] : value?.[0];

  const uploadDocuments = async data => {
    // formik.handleChange();
    setLoader(true);
    const submitData = {
      applicationId: id,
      body: data,
    };
    await BackendService.uploadFile(submitData)
      .then(response => {
        setLoader(false);
        formik.setValues(
          {...formik.values, [shapeValue]: response.data},
          false,
        );
        formik.setErrors({...formik.errors, [shapeValue]: null});
      })
      .catch(err => {
        setLoader(false);
      });
  };

  // console.log(shapeValue, formik.values, formik.values?.[shapeValue], 'df');
  switch (component.type) {
    // case component?.properties?.type === 'file':
    //   return (
    //     <FileComponent
    //       name={shapeValue}
    //       placeholder={component.label}
    //       value={formik.values[shapeValue] || ''}
    //       onChange={formik.handleChange}
    //       error={formik.errors[shapeValue]}
    //       required={component?.validate?.required}
    //       pattern={component?.validate?.pattern}
    //       validationType={component?.validate?.validationType}
    //       maxLength={component?.validate?.maxLength}
    //       minLength={component?.validate?.minLength}
    //       disabled={component.disabled}
    //       readonly={component.readonly}
    //     />
    //   );

    case 'text':
      return <TextComponent key={shapeValue} text={component.text} />;
    case 'textfield':
      if (component?.properties?.type === 'file') {
        return (
          <>
            <Backdrop
              open={loader}
              sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}>
              <CircularProgress />
            </Backdrop>

            <FileComponent
              name={shapeValue}
              placeholder={component.label}
              value={formik.values[shapeValue] || ''}
              onChange={uploadDocuments}
              error={formik.errors[shapeValue]}
              required={component?.validate?.required}
              pattern={component?.validate?.pattern}
              validationType={component?.validate?.validationType}
              maxLength={component?.validate?.maxLength}
              minLength={component?.validate?.minLength}
              disabled={component.disabled}
              readonly={component.readonly}
            />
          </>
        );
      }
      return (
        <TextfieldComponent
          name={shapeValue}
          placeholder={component.label}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
          pattern={component?.validate?.pattern}
          validationType={component?.validate?.validationType}
          maxLength={component?.validate?.maxLength}
          minLength={component?.validate?.minLength}
          disabled={component.disabled}
          readonly={component.readonly}
        />
      );

    case 'datetime':
      return (
        <TextfieldComponent
          name={shapeValue}
          placeholder={component.label}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          type="date"
          required={component?.validate?.required}
          pattern={component?.validate?.pattern}
          validationType={component?.validate?.validationType}
          maxLength={component?.validate?.maxLength}
          minLength={component?.validate?.minLength}
          disabled={component.disabled}
          readonly={component.readonly}
        />
      );

    case 'textarea':
      return (
        <TextAreaComponent
          name={shapeValue}
          placeholder={component.label}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
          pattern={component?.validate?.regularExpressionPattern}
        />
      );

    case 'number':
      return (
        <NumberFieldComponent
          name={shapeValue}
          placeholder={component.label}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
        />
      );

    case 'select':
      return (
        <SelectComponent
          name={shapeValue}
          label={component.label}
          values={component.values}
          value={formik.values[shapeValue] || ''}
          onChange={formik}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
        />
      );

    case 'taglist':
      return (
        <MultiSelectComponent
          name={shapeValue}
          label={component.label}
          values={component.values}
          value={formik?.values[component?.key] || ''}
          onChange={formik}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
        />
      );
    case 'radio':
      return (
        <RadioComponent
          name={shapeValue}
          label={component.label}
          values={component.values}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
          defaultValue={component?.defaultValue ? component.defaultValue : ''}
          properties={component?.properties}
        />
      );
    case 'checklist':
      return (
        <CheckListComponent
          name={shapeValue}
          label={component.label}
          values={component.values}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
        />
      );
    case 'checkbox':
      return (
        <CheckBoxComponent
          name={shapeValue}
          label={component.label}
          values={component.values}
          value={formik.values[shapeValue] || ''}
          onChange={formik.handleChange}
          error={formik.errors[shapeValue]}
          required={component?.validate?.required}
        />
      );
    case 'button':
      return (
        <ButtonComponent
          key={shapeValue}
          label={component.label}
          // className={component.properties.class}
          onClick={formik.handleSubmit}
        />
      );
    default:
      console.error(`Unknown component type: ${component.type}`);
      return null;
  }
  // }, 2000)
}

export default renderComponents;
