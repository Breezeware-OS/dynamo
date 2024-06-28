import {Typography} from '@mui/material';
import {Text, TextField} from 'glide-design-system';
import React from 'react';

export default function TextfieldComponent({
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
  type,
}) {
  return (
    <div>
      {/* <Text style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </Text> */}
      <TextField
      label={placeholder}
      required={required}
        name={name}
        style={{width: '100%'}}
        pattern={pattern}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readonly={readonly}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
      />
      {error && (
        <Typography
          style={{
            color: 'red',
            textAlign: 'left',
            textTransform: 'capitalize',
          }}>
          {error}
        </Typography>
      )}
    </div>
  );
}
