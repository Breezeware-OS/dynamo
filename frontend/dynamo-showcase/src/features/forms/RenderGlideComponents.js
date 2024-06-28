import {InputLabel, Typography} from '@mui/material';
import {type} from '@testing-library/user-event/dist/type';
import {
  Button,
  Checkbox,
  RadioButton,
  Select,
  Text,
  TextField,
  CheckboxGroup,
  PhoneNumberInput,
  Address,
  Email,
  Number,
  MultiSelect,
  FullName,
  Divider,
} from 'glide-design-system';
import React from 'react';

export function TextComponent({text, fontSize, bold, italic}) {
  return (
    <div
      style={{
        fontWeight: bold ? 700 : 400,
        fontSize: fontSize ? `${fontSize}px` : '18px',
        textAlign: 'left',
        padding: '1%',
        fontStyle: italic ? 'italic' : 'normal',
      }}>
      {text}
    </div>
  );
}

export function TextfieldComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  pattern,
  validationType,
  maxLength,
  minLength,
  readonly,
  label,
  disabled,
}) {
  return (
    <div style={{padding: '1%'}}>
      <TextField
        width="100%"
        name={name}
        style={{width: '100%'}}
        pattern={pattern}
        type={validationType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readonly={readonly}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        label={label}
        required={required}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function DateComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  pattern,
  validationType,
  maxLength,
  minLength,
  disabled,
  readonly,
  label,
}) {
  // console.log(name, value);
  return (
    <div style={{padding: '1%'}}>
      <TextField
        width="100%"
        name={name}
        style={{width: '100%'}}
        pattern={pattern}
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readonly={readonly}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        required={required}
        label={label}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function TextAreaComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  pattern,
  label,
  disabled,
}) {
  // console.log(name, value);
  return (
    <div style={{padding: '1%'}}>
      <InputLabel style={{textAlign: 'left'}}>
        {label} {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <textarea
        name={name}
        style={{width: '100%'}}
        pattern={pattern}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function NumberFieldComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
}) {
  // console.log(name, value);
  return (
    <div style={{padding: '1%'}}>
      <Number
        width="100%"
        name={name}
        value={value}
        onChange={onChange}
        label={placeholder}
        required={required}
        disabled={disabled}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function SelectComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  values,
  label,
  required,
  disabled,
}) {
  return (
    <div style={{padding: '1%'}}>
      <Select
        label={label}
        placeHolder={placeholder}
        required={required}
        disabled={disabled}
        name={name}
        style={{width: '100%', color: 'black'}}
        value={value}
        // onChange={onChange?.handleChange()}
        onChange={onChange}>
        {values?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function RadioGroup({
  name,
  placeholder,
  value,
  onChange,
  error,
  options,
  label,
  required,
  disabled,
}) {
  console.log('disabled', disabled);
  return (
    <div style={{padding: '1%'}}>
      <RadioButton
        name={name}
        label={label}
        required={required}
        onChange={onChange}
        disabled={disabled}
        value={value}>
        {options.map(option => {
          return (
            <label value={option.value} id={option.id}>
              {option.label}
            </label>
          );
        })}
      </RadioButton>
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function CheckboxComponent({
  label,
  value,
  disabled,
  onChange,
  required,
  name,
  error,
}) {
  return (
    <div style={{padding: '1%'}}>
      <Checkbox
        name={name}
        label={label}
        value={value}
        checked={value}
        disabled={disabled}
        onChange={onChange}
        required={required}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function FullnameComponent({
  label,
  firstNameLabel,
  lastNameLabel,
  firstNamePlaceholder,
  lastNamePlaceholder,
  required,
  onChange,
  value,
  error,
  name,
}) {
  return (
    <div style={{padding: '1%'}}>
      <FullName
        width="290px"
        name={name}
        label={label}
        firstNameLabel={firstNameLabel}
        lastNameLabel={lastNameLabel}
        firstNamePlaceholder={firstNamePlaceholder}
        lastNamePlaceholder={lastNamePlaceholder}
        required={required}
        onChange={onChange}
        value={''}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function CheckboxGroupComponent({
  name,
  label,
  options,
  onChange,
  checkBoxValue,
  required,
  error,
}) {
  return (
    <div style={{padding: '1%'}}>
      <CheckboxGroup
        name={name}
        options={options}
        label={label}
        onChange={onChange}
        required={required}
        value={checkBoxValue}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function MultiSelectComponent({
  name,
  label,
  required,
  options,
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div style={{padding: '1%'}}>
      <MultiSelect
        style={{width: '100%'}}
        name={name}
        label={label}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function PhoneNumberComponent({
  name,
  label,
  required,
  value,
  onChange,
  setCountryCode,
  error,
}) {
  return (
    <div style={{padding: '1%'}}>
      <PhoneNumberInput
        name={name}
        label={label}
        required={required}
        onChange={onChange}
        value={value}
        setCountryCode={setCountryCode}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function AddressComponent({
  label,
  onChange,
  required,
  value,
  placeholder,
  error,
  parentLabel,
  disabled,
}) {
  return (
    <div style={{padding: '1%'}}>
      <Address
        label={parentLabel}
        width="290px"
        labels={label}
        placeHolders={placeholder}
        address={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        // width="100%"
      />
      {error && (
        <>
          <Typography style={{color: 'red', textAlign: 'left'}}>
            {error.addressline1}
          </Typography>
          <Typography style={{color: 'red', textAlign: 'left'}}>
            {error.city}
          </Typography>
          <Typography style={{color: 'red', textAlign: 'left'}}>
            {error.postalCode}
          </Typography>
          <Typography style={{color: 'red', textAlign: 'left'}}>
            {error.state}
          </Typography>
          {typeof error === 'string' && (
            <Typography style={{color: 'red', textAlign: 'left'}}>
              {error}
            </Typography>
          )}
        </>
      )}
    </div>
  );
}

export function EmailComponent({
  name,
  label,
  onChange,
  required,
  value,
  errorMessage,
  placeholder,
  error,
  disabled,
}) {
  return (
    <div style={{padding: '1%'}}>
      <Email
        width="100%"
        name={name}
        label={label}
        onChange={onChange}
        required={required}
        value={value}
        errorMessage={errorMessage}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export function DividerComponent({width, color}) {
  return (
    <div style={{padding: '1%'}}>
      <Divider
        style={{
          borderWidth: width <= 0 ? '1px' : `${width}px`,
          borderColor: color,
        }}
      />
    </div>
  );
}

export function ParagraphComponent({text, fontSize, bold, italic}) {
  return (
    <div
      style={{
        padding: '1%',
      }}>
      <p
        style={{
          fontWeight: bold ? 700 : 400,
          fontSize: fontSize ? `${fontSize}px` : '18px',
          textAlign: 'left',
          fontStyle: italic ? 'italic' : 'normal',
        }}>
        {text}
      </p>
    </div>
  );
}
