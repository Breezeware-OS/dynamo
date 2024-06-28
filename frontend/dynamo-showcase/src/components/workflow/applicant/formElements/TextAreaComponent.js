import {Typography} from '@mui/material';
import {Text} from 'glide-design-system';
import React from 'react';

export default function TextAreaComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  pattern,
}) {
  return (
    <div>
      <Text style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </Text>
      <textarea
        name={name}
        style={{width: '100%'}}
        pattern={pattern}
        type="text"
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
