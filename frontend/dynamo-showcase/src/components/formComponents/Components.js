import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import {Button, Select, Text, TextField} from 'glide-design-system';
import React from 'react';

export function TextComponent({text}) {
  return (
    <div style={{fontWeight: 700, fontSize: '18px', textAlign: 'left'}}>
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
  disabled,
  readonly,
}) {
  // console.log(name, value);
  return (
    <div>
      <InputLabel style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <TextField
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
}) {
  // console.log(name, value);
  return (
    <div>
      <InputLabel style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <TextField
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
}) {
  // console.log(name, value);
  return (
    <div>
      <InputLabel style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
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
}) {
  // console.log(name, value);
  return (
    <div>
      <InputLabel style={{textAlign: 'left'}}>
        {placeholder} {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <TextField
        name={name}
        style={{width: '100%'}}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
  placeholder,
  value,
  onChange,
  error,
  values,
  label,
  required,
}) {
  // console.log(value);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [personName, setPersonName] = React.useState([]);

  const handleChange = event => {
    const {
      target: {value},
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value?.split(',') : value,
    );
  };

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

  return (
    <div>
      <FormControl sx={{m: 1, width: 300}}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        {/* <MUISelect
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}>
          {names.map(name => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </MUISelect> */}
      </FormControl>
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
}) {
  // console.log(name, value);
  return (
    <>
      <InputLabel style={{textAlign: 'left'}}>
        {label || placeholder}{' '}
        {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <Select
        name={name}
        style={{width: '100%', color: 'black'}}
        value={value}
        // onChange={onChange?.handleChange()}
        onChange={e => {
          // console.log(value, name);
          onChange.setFieldValue(name, e);
        }}>
        {values.map(option => (
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
    </>
  );
}

export function RadioComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  values,
  label,
  required,
}) {
  // console.log(name, value);
  return (
    <>
      <InputLabel style={{textAlign: 'left'}}>
        {label || placeholder}{' '}
        {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <div style={{width: '100%'}}>
        <RadioGroup
          row
          name={name}
          id="attention"
          onChange={onChange}
          // className={classes.radio}
        >
          {values.map(option => (
            <FormControlLabel
              value={option.value}
              control={<Radio />}
              label={option?.label}
              checked={value === option.value}
            />
          ))}
        </RadioGroup>
      </div>
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </>
  );
}

export function CheckListComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  values,
  label,
  required,
}) {
  // console.log(name, value);
  return (
    <>
      <InputLabel style={{textAlign: 'left'}}>
        {label} {required && <span style={{color: 'red'}}>*</span>}
      </InputLabel>
      <div style={{width: '100%'}}>
        <FormGroup
          row
          name={name}
          id="check"
          onChange={onChange}
          // className={classes.radio}
        >
          {values.map(option => (
            <FormControlLabel
              value={option.value}
              name={name}
              control={<Checkbox />}
              label={option?.label}
              checked={value.indexOf(option.value) > -1}
            />
          ))}
        </FormGroup>
      </div>
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </>
  );
}

export function CheckBoxComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  values,
  label,
  required,
}) {
  // console.log(name, value);
  return (
    <>
      <div style={{width: '100%'}}>
        <FormGroup
          row
          name={name}
          id="check"
          onChange={onChange}
          // className={classes.radio}
        >
          {/* {values.map((option) => ( */}
          <FormControlLabel
            value={value}
            name={name}
            control={<Checkbox />}
            label={
              <Text style={{textAlign: 'left'}}>
                {label} {required && <span style={{color: 'red'}}>*</span>}
              </Text>
            }
            checked={value}
          />
          {/* ))} */}
        </FormGroup>
      </div>
      {error && (
        <Typography style={{color: 'red', textAlign: 'left'}}>
          {error}
        </Typography>
      )}
    </>
  );
}

export function ButtonComponent({
  name,
  placeholder,
  value,
  onChange,
  error,
  values,
  onClick,
  className,
  label,
  type,
}) {
  return (
    <Button
      type={type}
      style={{width: '100%'}}
      onClick={onClick}
      className={className}>
      {label}
    </Button>
  );
}

// module.exports= {
//   ButtonComponent,
//   CheckBoxComponent,
//   CheckListComponent,
//   RadioComponent,
//   SelectComponent,
//   MultiSelectComponent,
//   NumberFieldComponent,
//   TextAreaComponent,
//   TextfieldComponent,
//   TextComponent,
// };
