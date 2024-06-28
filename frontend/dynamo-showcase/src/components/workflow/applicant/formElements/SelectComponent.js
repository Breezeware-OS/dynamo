import {Typography} from '@mui/material';
import {Select, Text} from 'glide-design-system';
import React from 'react';

export default function SelectComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  values,
  label,
  required,
}) {
  return (
    <div>
      <Text style={{textAlign: 'left'}}>
        {label} {required && <span style={{color: 'red'}}>*</span>}
      </Text>
      <Select
        name={name}
        style={{width: '100%', color: 'black'}}
        value={value}
        // onChange={onChange?.handleChange()}
        onChange={e => {
          onChange.setFieldValue(name, e);
        }}>
        {values.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
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
