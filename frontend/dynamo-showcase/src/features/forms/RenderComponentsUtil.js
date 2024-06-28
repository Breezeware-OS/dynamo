import React from 'react';
import {v4 as uuidv4, v4} from 'uuid';

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

const renderComponents = component => {
  switch (component?.type) {
    case 'fullname':
      return (
        <FullnameComponent
          label={component?.label}
          firstNameLabel={component?.firstNameLabel}
          lastNameLabel={component?.lastNameLabel}
          firstNamePlaceholder={component?.firstNamePlaceholder}
          lastNamePlaceholder={component?.lastNamePlaceholder}
          required={component?.required}
          onChange={e => console.log('fullname', e)}
          value={component?.value}
        />
      );
    case 'textField':
      return (
        <TextfieldComponent
          name={component.key}
          placeholder={component.placeholder}
          label={component?.label}
          // value={formik.values[component.key] || ""}
          // onChange={formik.handleChange}
          // error={formik.errors[component.key]}
          required={component.required}
          pattern={component?.validate?.regularExpressionPattern}
          disabled={component?.disabled}
        />
      );
    case 'textarea':
      return (
        <TextAreaComponent
          name={component.key}
          placeholder={component.placeholder}
          //   value={formik.values[component.key] || ""}
          //   onChange={formik.handleChange}
          //   error={formik.errors[component.key]}
          required={component?.required}
          pattern={component?.validate?.regularExpressionPattern}
          label={component?.label}
          disabled={component?.disabled}
        />
      );
    case 'select':
      return (
        <SelectComponent
          name={component.key}
          label={component.label}
          values={component.options}
          value={component.value || ''}
          //   onChange={formik}
          //   error={formik.errors[component.key]}
          required={component.required}
          disabled={component?.disabled}
        />
      );
    case 'datetime':
      return (
        <DateComponent
          name={component.key}
          placeholder={component.label}
          label={component.label}
          disabled={component.disabled}
          // value={formik.values[component.key] || ""}
          // onChange={formik.handleChange}
          // error={formik.errors[component.key]}
          required={component.required}
          pattern={component?.validate?.regularExpressionPattern}
        />
      );
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
    case 'number':
      return (
        <NumberFieldComponent
          name={component.key}
          placeholder={component.label}
          value={''}
          onChange={e => console.log('number', e)}
          // error={formik.errors[component.key]}
          required={component?.required}
          disabled={component?.disabled}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          label={component.label}
          name={component.name}
          required={component.required}
          options={component.options}
          key={component.key}
          disabled={component?.disabled}
        />
      );
    case 'checkbox':
      return (
        <CheckboxComponent
          checked={component.checked}
          disabled={component.disabled}
          label={component.label}
          key={component.key}
          required={component?.required}
        />
      );
    case 'checkboxGroup':
      return (
        <CheckboxGroupComponent
          label={component?.label}
          options={component?.options}
          groupCheckBoxHandler={e => console.log('checkboxGroup onchange', e)}
          checkBoxValue={component?.value}
          required={component?.required}
        />
      );
    case 'multiSelect':
      return (
        <MultiSelectComponent
          label={component?.label}
          options={component?.options}
          onChange={e => console.log('multiSelect onchange', e)}
          checkBoxValue={component?.value}
          required={component?.required}
          placeholder={component?.placeholder}
        />
      );
    case 'phoneNumber':
      return (
        <PhoneNumberComponent
          label={component?.label}
          onChange={e => console.log('phoneNumber onchange', e)}
          required={component?.required}
          setCountryCode={e => console.log('setCountryCode phoneNumber', e)}
        />
      );
    case 'address':
      return (
        <AddressComponent
          label={component?.label}
          onChange={e => console.log('address onchange', e)}
          required={component?.required}
          value={component?.value}
          placeholder={component?.placeholder}
          parentLabel={component?.parentLabel}
          disabled={component?.disabled}
        />
      );
    case 'email':
      return (
        <EmailComponent
          label={component?.label}
          onChange={e => console.log('email onchange', e)}
          required={component?.required}
          value={component?.value}
          errorMessage={component?.errorMessage}
          placeholder={component?.placeholder}
          disabled={component?.disabled}
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
      console.error(`Unknown component type: ${component?.type}`);
      return null;
  }
};

const addComponentsHandler = (component, setComponents, setCurrentField) => {
  let newComponent;

  if (component === 'fullname') {
    newComponent = {
      label: 'Fullname',
      firstNameLabel: 'First Name',
      lastNameLabel: 'Last Name',
      firstNamePlaceholder: 'First Name',
      lastNamePlaceholder: 'Last Name',
      value: '',
      required: false,
      size: 'lg',
      key: `fullname_${uuidv4().slice(0, 8)}`,
      type: 'fullname',
      fieldName: 'Fullname',
      dataType: 'string',
      layout: 12,
    };
  }

  if (component === 'textField') {
    newComponent = {
      label: 'Text Field',
      placeholder: 'Text',
      required: false,
      disabled: false,
      size: 'lg',
      key: `text_input_${uuidv4().slice(0, 8)}`,
      type: 'textField',
      fieldName: 'Text Field',
      dataType: 'string',
      layout: 12,
    };
  }

  if (component === 'select') {
    newComponent = {
      fieldName: 'Select',
      label: 'Select',
      placeholder: 'Select',
      required: false,
      size: 'lg',
      key: `select_${uuidv4().slice(0, 8)}`,
      type: 'select',
      value: '',
      options: [
        {
          key: `option_${uuidv4().slice(0, 8)}`,
          label: 'Label',
          value: 'Value',
        },
      ],
      defaultValue: 'Value',
      dataType: 'string',
      layout: 12,
      disabled: false,
    };
  }

  if (component === 'textarea') {
    newComponent = {
      fieldName: 'Text Area',
      label: 'Text  Area',
      placeholder: 'Text Area',
      required: false,
      size: 'lg',
      key: `text_area_${uuidv4().slice(0, 8)}`,
      type: 'textarea',
      dataType: 'string',
      layout: 12,
      disabled: false,
    };
  }

  if (component === 'datetime') {
    newComponent = {
      fieldName: 'Date',
      label: 'Date',
      placeholder: 'Date',
      required: false,
      size: 'lg',
      key: `date_${uuidv4().slice(0, 8)}`,
      type: 'datetime',
      dataType: 'string',
      layout: 12,
      disabled: false,
    };
  }

  if (component === 'heading') {
    newComponent = {
      fieldName: 'Heading',
      label: 'Heading',
      required: false,
      size: 'lg',
      key: `heading_${uuidv4().slice(0, 8)}`,
      type: 'heading',
      text: 'HEADING',
      fontSize: 18,
      layout: 12,
      bold: true,
      italic: false,
    };
  }

  if (component === 'text') {
    newComponent = {
      fieldName: 'Text',
      label: 'Text',
      required: false,
      size: 'lg',
      key: `text_${uuidv4().slice(0, 8)}`,
      type: 'text',
      text: 'text',
      fontSize: 14,
      layout: 12,
      bold: false,
      italic: false,
    };
  }

  if (component === 'number') {
    newComponent = {
      fieldName: 'Number',
      label: 'Number',
      required: false,
      size: 'lg',
      key: `number_${uuidv4().slice(0, 8)}`,
      type: 'number',
      dataType: 'number',
      layout: 12,
      disabled: false,
    };
  }

  if (component === 'radio') {
    newComponent = {
      fieldName: 'Radio',
      label: 'Radio',
      required: false,
      disabled: false,
      size: 'lg',
      key: `radio_${uuidv4().slice(0, 8)}`,
      type: 'radio',
      value: '',
      options: [
        {
          key: `option_${uuidv4().slice(0, 8)}`,
          label: 'Label',
          value: 'Value',
        },
      ],
      dataType: 'string',
      layout: 12,
    };
  }

  if (component === 'checkbox') {
    newComponent = {
      fieldName: 'Checkbox',
      label: 'Checkbox',
      required: false,
      size: 'lg',
      key: `checkbox_${uuidv4().slice(0, 8)}`,
      type: 'checkbox',
      checked: false,
      disabled: false,
      dataType: 'boolean',
      layout: 12,
    };
  }

  if (component === 'checkboxGroup') {
    newComponent = {
      fieldName: 'Checkbox Group',
      label: 'Checkbox Group',
      required: false,
      size: 'lg',
      key: `checkboxGroup_${uuidv4().slice(0, 8)}`,
      type: 'checkboxGroup',
      value: [],
      options: [
        {
          key: `checkboxGroupOption_${uuidv4().slice(0, 8)}`,
          label: 'Label',
          value: 'Label',
        },
      ],
      dataType: 'array',
      layout: 12,
    };
  }
  if (component === 'multiSelect') {
    newComponent = {
      fieldName: 'Multi Select Dropdown',
      label: 'Multi Select',
      placeholder: 'Multi Select',
      required: false,
      size: 'lg',
      key: `multiSelect_${uuidv4().slice(0, 8)}`,
      type: 'multiSelect',
      value: [],
      options: [
        {
          key: `option_${uuidv4().slice(0, 8)}`,
          label: 'Label',
          value: 'Value',
        },
      ],
      dataType: 'array',
      layout: 12,
    };
  }

  if (component === 'phoneNumber') {
    newComponent = {
      fieldName: 'Phone Number',
      label: 'Phone Number',
      required: false,
      size: 'lg',
      key: `phoneNumber_${uuidv4().slice(0, 8)}`,
      type: 'phoneNumber',
      value: '',
      dataType: 'string',
      layout: 12,
    };
  }

  if (component === 'address') {
    newComponent = {
      fieldName: 'Address',
      parentLabel: 'Address',
      label: {
        addressLine1: 'Adress Line1',
        addressLine2: 'Address Line2',
        city: 'City',
        postalCode: 'Postal Code',
        state: 'State',
      },
      required: false,
      size: 'lg',
      key: `address_${uuidv4().slice(0, 8)}`,
      type: 'address',
      value: {
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        postalCode: null,
      },
      placeholder: {
        addressLine1Placeholder: 'Address Line 1',
        addressLine2Placeholder: 'Address Line 2',
        cityPlaceholder: 'City',
        statePlaceholder: 'State',
        postalCodePlaceholder: 'Postal code',
      },
      dataType: 'object',
      layout: 12,
      disabled: false,
    };
  }
  if (component === 'email') {
    newComponent = {
      fieldName: 'Email',
      label: 'Email',
      required: false,
      size: 'lg',
      key: `email_${uuidv4().slice(0, 8)}`,
      type: 'email',
      value: '',
      errorMessage: 'Please enter a valid email address.',
      placeholder: 'Email',
      dataType: 'string',
      layout: 12,
      disabled: false,
    };
  }

  if (component === 'divider') {
    newComponent = {
      fieldName: 'Divider',
      label: 'Divider',
      size: 'lg',
      key: `divider_${uuidv4().slice(0, 8)}`,
      type: 'divider',
      dataType: 'string',
      layout: 12,
      width: '1',
      color: '#d7d7d7',
    };
  }

  if (component === 'paragraph') {
    newComponent = {
      fieldName: 'Paragraph',
      label: 'Paragraph',
      size: 'lg',
      key: `paragraph_${uuidv4().slice(0, 8)}`,
      type: 'paragraph',
      dataType: 'string',
      text: 'This is a sample paragraph',
      fontSize: 14,
      layout: 12,
      bold: false,
      italic: false,
    };
  }

  setComponents(prevComponents => [...prevComponents, newComponent]);

  setCurrentField(newComponent);
};

export {renderComponents, addComponentsHandler};
