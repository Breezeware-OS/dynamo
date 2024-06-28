import {Typography} from '@mui/material';
import {Text, TextField} from 'glide-design-system';
import React from 'react';

export default function NumberFieldComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
}) {
  return (
    <div>
      <Text style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </Text>
      <TextField
        name={name}
        style={{width: '100%'}}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
