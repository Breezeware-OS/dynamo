import React, {memo, useEffect, useState} from 'react';
import {
  Grid,
  IconButton,
  TextField,
  InputLabel,
  Typography,
  Divider,
  Button as MuiButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {
  Checkbox,
  Select,
  MenuItem,
  Button,
  Drawer,
  Tab,
  Text,
} from 'glide-design-system';
import {v4 as uuidv4, v4} from 'uuid';

function PropertiesDrawer({
  open,
  onClose,
  components,
  updateComponentHanlder,
  removeFieldOption,
  updatedOptionHandler,
  deletComponentHandler,
  currentField,
  setCurrentField,
  formId,
  uniqueId,
}) {
  const [currentComponent, setCurrentComponent] = useState(currentField);
  useEffect(() => {
    setCurrentComponent(currentField);
  }, [components]);

  useEffect(() => {
    setFieldSize(
      currentField?.layout === 4
        ? 'small'
        : currentField?.layout === 8
        ? 'medium'
        : 'large',
    );
  }, [currentField]);

  const [activePropertyIndex, setActivePropetyIndex] = useState(0);

  const onTabChange = idx => {
    // setIndex(idx);
    setActivePropetyIndex(idx);
  };

  const [fieldSize, setFieldSize] = useState(
    currentField?.layout === 4
      ? 'small'
      : currentField?.layout === 8
      ? 'medium'
      : 'large',
  );
  const [alignment, setAlignment] = useState('left');

  const changeFieldSize = (field, fieldSize) => {
    setFieldSize(fieldSize);
    updateComponentHanlder({
      ...field,
      layout: fieldSize === 'small' ? 4 : fieldSize === 'medium' ? 8 : 12,
    });
    setCurrentField({
      ...field,
      layout: fieldSize === 'small' ? 4 : fieldSize === 'medium' ? 8 : 12,
    });
  };

  const renderFieldProperties = field => {
    return (
      <div
        style={{
          height: '700px',
          overflow: 'auto',
        }}>
        <Grid item xs={12} container padding={2} paddingTop={0.2}>
          <Grid item xs={12}>
            <Typography sx={{fontWeight: 600, color: '#999999', fontSize: 20}}>
              Element Property
            </Typography>
            <Divider sx={{borderWidth: 2, borderColor: '#ececec'}} />
            {!field && (
              <Typography sx={{color: '#999999', marginTop: 1}}>
                There are no elements on this page. Once you select an element,
                its properties will be displayed for customization
              </Typography>
            )}
          </Grid>
          {/* {!field && (
            <Grid item xs={12} container spacing={1}>
              <Grid item xs={12}>
                <Typography sx={{fontWeight: 600, color: 'black'}} variant="h5">
                  Form
                </Typography>
                <Typography sx={{color: 'black'}}>
                  Form_{uniqueId || formId}
                </Typography>
              </Grid>
            </Grid>
          )} */}
          {field && (
            <Grid item xs={12} container marginTop={1}>
              <Grid item container xs={12} spacing={1}>
                <Grid item xs={6}>
                  <Typography className="form-field-label">ID</Typography>
                  <Typography style={{wordWrap: 'break-word'}}>
                    {field?.key}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className="form-field-label">Type</Typography>
                  <Typography style={{wordWrap: 'break-word'}}>
                    {field?.fieldName}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item xs={12} marginBottom={1} marginTop={2}>
                <Tab
                  containerClass="form-properties-tab"
                  style={{width: '100%'}}
                  onTabChange={onTabChange}
                  activeIndex={activePropertyIndex}
                  id="tab"
                  indicatorStyle="bottomLine"
                  showIndicator>
                  <div
                    id="generalSettings"
                    label={
                      <div>
                        <span
                          style={{
                            color: '#1B3764',
                            fontSize: '16px',
                            width: '100%',
                          }}>
                          General Settings
                        </span>
                      </div>
                    }
                  />
                  {/* <div
                    id="advancedSettings"
                    label={
                      <div>
                        <span
                          style={{
                            color: '#1B3764',
                            fontSize: '16px',
                            width: '100%',
                          }}>
                          Advanced Settings
                        </span>
                      </div>
                    }
                  /> */}
                </Tab>
                {/* <Text type="h2" style={{color: '#1b3764'}}>
                  General Settings
                </Text> */}
              </Grid>

              {activePropertyIndex === 0 && (
                <Grid item container xs={12}>
                  {field?.type === 'divider' && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">
                        Width
                      </InputLabel>
                      <TextField
                        size="small"
                        variant="outlined"
                        style={{width: '90%'}}
                        id={`${field?.key}_divider`}
                        value={field?.width}
                        onChange={e => {
                          updateComponentHanlder({
                            ...field,
                            width: `${e.target.value}`,
                          });
                          setCurrentField({
                            ...field,
                            width: `${e.target.value}`,
                          });
                        }}
                      />
                    </Grid>
                  )}
                  {field?.type === 'divider' && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">
                        Color
                      </InputLabel>
                      <input
                        style={{marginTop: '2%', width: '100px'}}
                        value={field?.color}
                        type="color"
                        onChange={e => {
                          console.log('color change', e.target.value);
                          updateComponentHanlder({
                            ...field,
                            color: `${e.target.value}`,
                          });
                          setCurrentField({
                            ...field,
                            color: `${e.target.value}`,
                          });
                        }}
                      />
                    </Grid>
                  )}
                  {(field?.type === 'heading' ||
                    field?.type === 'text' ||
                    field?.type === 'paragraph') && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">Text</InputLabel>
                      <TextField
                        size="small"
                        variant="outlined"
                        style={{width: '90%'}}
                        id={`${field?.key}_heading`}
                        value={field?.text}
                        onChange={e => {
                          updateComponentHanlder({
                            ...field,
                            text: e.target.value,
                          });
                          setCurrentField({
                            ...field,
                            text: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  )}
                  {(field?.type === 'heading' ||
                    field?.type === 'text' ||
                    field?.type === 'paragraph') && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">
                        Font Size
                      </InputLabel>
                      <TextField
                        style={{width: '90%'}}
                        id={`${field?.key}_heading_fontSizet`}
                        size="small"
                        variant="outlined"
                        value={field?.fontSize}
                        onChange={e => {
                          setCurrentField({
                            ...field,
                            fontSize: e.target.value,
                          });
                          updateComponentHanlder({
                            ...field,
                            fontSize: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  )}
                  {(field?.type === 'heading' ||
                    field?.type === 'text' ||
                    field?.type === 'paragraph') && (
                    <Grid item xs={12} className="field-property">
                      <Checkbox
                        sx={{fontWeight: 500, color: 'black'}}
                        onChange={e => {
                          updateComponentHanlder({
                            ...field,
                            bold: e.target.checked,
                          });
                          setCurrentField({
                            ...field,
                            bold: e.target.checked,
                          });
                        }}
                        label="Bold"
                        checked={field?.bold}
                      />
                    </Grid>
                  )}
                  {(field?.type === 'heading' ||
                    field?.type === 'text' ||
                    field?.type === 'paragraph') && (
                    <Grid item xs={12} className="field-property">
                      <Checkbox
                        sx={{fontWeight: 500, color: 'black'}}
                        onChange={e => {
                          updateComponentHanlder({
                            ...field,
                            italic: e.target.checked,
                          });
                          setCurrentField({
                            ...field,
                            italic: e.target.checked,
                          });
                        }}
                        label="Italic"
                        checked={field?.italic}
                      />
                    </Grid>
                  )}

                  {field?.type !== 'text' &&
                    field?.type !== 'heading' &&
                    field.type !== 'address' &&
                    field?.type !== 'divider' &&
                    field?.type !== 'paragraph' &&
                    field?.type !== 'fullname' && (
                      <>
                        <Grid item xs={12}>
                          <Typography sx={{fontSize: 14, color: 'black'}}>
                            Label Options
                          </Typography>
                        </Grid>
                        <Grid item xs={12} className="field-property">
                          <InputLabel className="form-field-label">
                            Label
                          </InputLabel>
                          <TextField
                            style={{width: '90%'}}
                            id={`${field?.key}_label`}
                            size="small"
                            variant="outlined"
                            placeholder={field?.label}
                            // style={{ border: "none" }}
                            value={field?.label}
                            onChange={e => {
                              updateComponentHanlder({
                                ...field,
                                label: e.target.value,
                              });
                              setCurrentField({
                                ...field,
                                label: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </>
                    )}

                  {(field?.type === 'textField' ||
                    field?.type === 'textarea' ||
                    field?.type === 'multiSelect' ||
                    field?.type === 'email') && (
                    <>
                      <Grid item xs={12}>
                        <Typography sx={{fontSize: 14, color: 'black'}}>
                          Placeholder Options
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Placeholder
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.placeholder}
                          // style={{ border: "none" }}
                          value={field?.placeholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              placeholder: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              placeholder: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {field?.type === 'fullname' && (
                    <Grid item xs={12} container spacing={1}>
                      <Grid item xs={12}>
                        <Typography sx={{fontSize: 14, color: 'black'}}>
                          Label Options
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Label
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.label}
                          // style={{ border: "none" }}
                          value={field?.label}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              label: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              label: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          First Name Label
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.firstNameLabel}
                          // style={{ border: "none" }}
                          value={field?.firstNameLabel}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              firstNameLabel: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              firstNameLabel: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Last Name Label
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.lastNameLabel}
                          // style={{ border: "none" }}
                          value={field?.lastNameLabel}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              lastNameLabel: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              lastNameLabel: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{fontSize: 14, color: 'black'}}>
                          Placeholder Options
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          First Name Placeholder
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.firstNamePlaceholder}
                          // style={{ border: "none" }}
                          value={field?.firstNamePlaceholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              firstNamePlaceholder: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              firstNamePlaceholder: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Last Name Placeholder
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.lastNamePlaceholder}
                          // style={{ border: "none" }}
                          value={field?.lastNamePlaceholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              lastNamePlaceholder: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              lastNamePlaceholder: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {field?.type === 'address' && (
                    <Grid item xs={12} container spacing={1}>
                      <Grid item xs={12}>
                        <Typography sx={{fontSize: 14, color: 'black'}}>
                          Label Options
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Address
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.parentLabel}
                          // style={{ border: "none" }}
                          value={field?.parentLabel}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              parentLabel: e.target.value,
                            });
                            setCurrentField({
                              ...field,
                              parentLabel: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Address Line 1
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.label?.addressLine1}
                          // style={{ border: "none" }}
                          value={field?.label?.addressLine1}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              label: {
                                ...field.label,
                                addressLine1: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              label: {
                                ...field.label,
                                addressLine1: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Address Line 2
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.label?.addressLine2}
                          // style={{ border: "none" }}
                          value={field?.label?.addressLine2}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              label: {
                                ...field.label,
                                addressLine2: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              label: {
                                ...field.label,
                                addressLine2: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          City
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.label?.city}
                          // style={{ border: "none" }}
                          value={field?.label?.city}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              label: {
                                ...field.label,
                                city: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              label: {
                                ...field.label,
                                city: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          State
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.label?.state}
                          // style={{ border: "none" }}
                          value={field?.label?.state}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              label: {
                                ...field.label,
                                state: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              label: {
                                ...field.label,
                                state: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Postal Code
                        </InputLabel>
                        <TextField
                          style={{width: '90%'}}
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.label?.postalCode}
                          // style={{ border: "none" }}
                          value={field?.label?.postalCode}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              label: {
                                ...field.label,
                                postalCode: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              label: {
                                ...field.label,
                                postalCode: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {field?.type === 'address' && (
                    <Grid item xs={12} container spacing={1}>
                      <Grid item xs={12}>
                        <Typography sx={{fontSize: 14, color: 'black'}}>
                          Placeholder Options
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Address Line 1
                        </InputLabel>
                        <TextField
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={
                            field?.placeholder?.addressLine1Placeholder
                          }
                          // style={{ border: "none" }}
                          value={field?.placeholder?.addressLine1Placeholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                addressLine1Placeholder: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                addressLine1Placeholder: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Address Line 2
                        </InputLabel>
                        <TextField
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={
                            field?.placeholder?.addressLine2Placeholder
                          }
                          // style={{ border: "none" }}
                          value={field?.placeholder?.addressLine2Placeholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                addressLine2Placeholder: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                addressLine2Placeholder: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          City
                        </InputLabel>
                        <TextField
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.placeholder?.cityPlaceholder}
                          // style={{ border: "none" }}
                          value={field?.placeholder?.cityPlaceholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                cityPlaceholder: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                cityPlaceholder: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          State
                        </InputLabel>
                        <TextField
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={field?.placeholder?.statePlaceholder}
                          // style={{ border: "none" }}
                          value={field?.placeholder?.statePlaceholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                statePlaceholder: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                statePlaceholder: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className="field-property">
                        <InputLabel className="form-field-label">
                          Postal Code
                        </InputLabel>
                        <TextField
                          id={`${field?.key}_label`}
                          size="small"
                          variant="outlined"
                          placeholder={
                            field?.placeholder?.postalCodePlaceholder
                          }
                          // style={{ border: "none" }}
                          value={field?.placeholder?.postalCodePlaceholder}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                postalCodePlaceholder: e.target.value,
                              },
                            });
                            setCurrentField({
                              ...field,
                              placeholder: {
                                ...field.placeholder,
                                postalCodePlaceholder: e.target.value,
                              },
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {field?.type === 'email' && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">
                        Error Message
                      </InputLabel>
                      <TextField
                        style={{width: '90%'}}
                        id={`${field?.key}_label`}
                        size="small"
                        variant="outlined"
                        placeholder={field?.errorMessage}
                        // style={{ border: "none" }}
                        value={field?.errorMessage}
                        onChange={e => {
                          updateComponentHanlder({
                            ...field,
                            errorMessage: e.target.value,
                          });
                          setCurrentField({
                            ...field,
                            errorMessage: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  )}

                  {field?.type === 'checkbox' && (
                    <Grid item xs={12} className="field-property">
                      <Checkbox
                        sx={{fontWeight: 500, color: 'black'}}
                        onChange={e => {
                          updateComponentHanlder({
                            ...field,
                            checked: e.target.checked,
                          });
                          setCurrentField({
                            ...field,
                            checked: e.target.checked,
                          });
                        }}
                        label="Checked"
                        checked={field?.checked}
                      />
                    </Grid>
                  )}

                  {(field?.type === 'select' ||
                    field?.type === 'radio' ||
                    field?.type === 'checkboxGroup' ||
                    field?.type === 'multiSelect') && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">
                        Options
                      </InputLabel>
                      {field?.options.map(option => {
                        return (
                          <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="space-between"
                            marginBottom={2}>
                            <TextField
                              style={{width: '90%'}}
                              id={option.key}
                              size="small"
                              variant="outlined"
                              // style={{ border: "none" }}
                              value={option.label}
                              onChange={e => {
                                updatedOptionHandler(
                                  field?.key,
                                  option?.key,
                                  e.target.value,
                                );
                              }}
                            />
                            <IconButton
                              aria-label="delete"
                              onClick={() =>
                                removeFieldOption(field, option?.key)
                              }>
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        );
                      })}

                      <Button
                        iconPosition="start"
                        variant="outlined"
                        onClick={() => {
                          const fieldUpdated = {
                            ...field,
                            options: [
                              ...field?.options,
                              {
                                id: `option_${uuidv4().slice(0, 8)}`,
                                label: `Label ${
                                  Object.keys(field?.options).length + 1
                                }`,
                                value: `Value ${
                                  Object.keys(field?.options).length + 1
                                }`,
                              },
                            ],
                          };
                          updateComponentHanlder(fieldUpdated);

                          setCurrentField(fieldUpdated);
                        }}>
                        <AddCircleOutlineRoundedIcon /> Add Option
                      </Button>
                    </Grid>
                  )}

                  {(field?.type === 'select' || field?.type === 'radio') && (
                    <Grid item xs={12} className="field-property">
                      <InputLabel className="form-field-label">
                        Default Value
                      </InputLabel>
                      <Select
                        style={{width: '90%'}}
                        onChange={value => {
                          updateComponentHanlder({
                            ...field,
                            defaultValue: value,
                          });
                          setCurrentField({...field, defaultValue: value});
                        }}>
                        {field?.options.map(option => {
                          return (
                            <MenuItem value={option.value}>
                              {option.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  )}

                  {field?.type !== 'heading' &&
                    field?.type !== 'divider' &&
                    field?.type !== 'text' &&
                    field?.type !== 'paragraph' && (
                      <Grid item xs={12}>
                        <Typography
                          sx={{fontWeight: 600, color: 'black'}}
                          variant="subtitle1">
                          Field
                        </Typography>
                      </Grid>
                    )}

                  {field?.type !== 'heading' &&
                    field?.type !== 'divider' &&
                    field?.type !== 'text' &&
                    field?.type !== 'paragraph' && (
                      <Grid item xs={6} className="field-property">
                        <Checkbox
                          sx={{fontWeight: 500, color: 'black'}}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              required: e.target.checked,
                            });
                            setCurrentField({
                              ...field,
                              required: e.target.checked,
                            });
                          }}
                          label="Required"
                          checked={field?.required}
                        />
                      </Grid>
                    )}

                  {field?.type !== 'heading' &&
                    field?.type !== 'divider' &&
                    field?.type !== 'text' &&
                    field?.type !== 'paragraph' &&
                    field?.type !== 'fullname' &&
                    field?.type !== 'phoneNumber' &&
                    field?.type !== 'checkboxGroup' &&
                    field?.type !== 'multiSelect' && (
                      <Grid item xs={6} className="field-property">
                        <Checkbox
                          sx={{fontWeight: 500, color: 'black'}}
                          onChange={e => {
                            updateComponentHanlder({
                              ...field,
                              disabled: e.target.checked,
                            });
                            setCurrentField({
                              ...field,
                              disabled: e.target.checked,
                            });
                          }}
                          label="Disabled"
                          checked={field?.disabled}
                        />
                      </Grid>
                    )}
                </Grid>
              )}

              {/* {activePropertyIndex === 1 && (
                <Grid item container xs={12}>
                  <Grid item container xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <InputLabel className="form-field-label">
                        Field Size
                      </InputLabel>
                    </Grid>
                    <Grid item xs={12} container>
                      <Grid item xs={3}>
                        <div
                          onClick={() => changeFieldSize(field, 'small')}
                          className={`form-property-radio ${
                            fieldSize === 'small'
                              ? 'form-property-radio-active'
                              : ''
                          }`}>
                          <Typography
                            className={`form-property-radio-label ${
                              fieldSize === 'small'
                                ? 'form-property-radio-label-active'
                                : ''
                            }`}>
                            Small
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={3.7}>
                        <div
                          onClick={() => changeFieldSize(field, 'medium')}
                          className={`form-property-radio ${
                            fieldSize === 'medium'
                              ? 'form-property-radio-active'
                              : ''
                          }`}>
                          <Typography
                            className={`form-property-radio-label ${
                              fieldSize === 'medium'
                                ? 'form-property-radio-label-active'
                                : ''
                            }`}>
                            Medium
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          onClick={() => changeFieldSize(field, 'large')}
                          className={`form-property-radio ${
                            fieldSize === 'large'
                              ? 'form-property-radio-active'
                              : ''
                          }`}>
                          <Typography
                            className={`form-property-radio-label ${
                              fieldSize === 'large'
                                ? 'form-property-radio-label-active'
                                : ''
                            }`}>
                            Large
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                 <Grid item container xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <InputLabel className="form-field-label">
                        Alignment
                      </InputLabel>
                    </Grid>
                    <Grid item xs={12} container spacing={1}>
                      <Grid item xs={4}>
                        <div
                          onClick={() => setAlignment('left')}
                          className={`form-property-radio ${
                            alignment === 'left'
                              ? 'form-property-radio-active'
                              : ''
                          }`}>
                          <Typography
                            className={`form-property-radio-label ${
                              alignment === 'left'
                                ? 'form-property-radio-label-active'
                                : ''
                            }`}>
                            Left
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          onClick={() => setAlignment('center')}
                          className={`form-property-radio ${
                            alignment === 'center'
                              ? 'form-property-radio-active'
                              : ''
                          }`}>
                          <Typography
                            className={`form-property-radio-label ${
                              alignment === 'center'
                                ? 'form-property-radio-label-active'
                                : ''
                            }`}>
                            Center
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          onClick={() => setAlignment('right')}
                          className={`form-property-radio ${
                            alignment === 'right'
                              ? 'form-property-radio-active'
                              : ''
                          }`}>
                          <Typography
                            className={`form-property-radio-label ${
                              alignment === 'right'
                                ? 'form-property-radio-label-active'
                                : ''
                            }`}>
                            Right
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid> 
                </Grid>
              )} */}

              {/* <Grid item xs={12}>
                <Typography sx={{fontWeight: 600, color: 'black'}} variant="h6">
                  Properties
                </Typography>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  sx={{fontWeight: 600, color: 'black'}}
                  variant="subtitle1">
                  General
                </Typography>
              </Grid> */}

              {/* {field?.type === 'text' && (
                <Grid item xs={12} className="field-property">
                  <InputLabel sx={{fontWeight: 500, color: 'black'}}>
                    Text
                  </InputLabel>
                  <TextField
                    style={{width: '90%'}}
                    id={`${field?.key}_text`}
                    variant="standard"
                    value={field?.text}
                    onChange={e => {
                      updateComponentHanlder({
                        ...field,
                        text: e.target.value,
                      });
                      setCurrentField({
                        ...field,
                        text: e.target.value,
                      });
                    }}
                  />
                </Grid>
              )} */}
              {/* {field?.type === 'text' && (
                <Grid item xs={12} className="field-property">
                  <InputLabel sx={{fontWeight: 500, color: 'black'}}>
                    Font Size
                  </InputLabel>
                  <TextField
                    style={{width: '90%'}}
                    id={`${field?.key}_text_fontSizet`}
                    variant="standard"
                    value={field?.fontSize}
                    onChange={e => {
                      setCurrentField({
                        ...field,
                        fontSize: e.target.value,
                      });
                      updateComponentHanlder({
                        ...field,
                        fontSize: e.target.value,
                      });
                    }}
                  />
                </Grid>
              )} */}

              {/* {(field?.type === 'textField' ||
                field?.type === 'textarea' ||
                field?.type === 'multiSelect') && (
                <Grid item xs={12} className="field-property">
                  <InputLabel sx={{fontWeight: 500, color: 'black'}}>
                    Placeholder
                  </InputLabel>
                  <TextField
                    style={{width: '90%'}}
                    id={`${field?.key}_label`}
                    variant="standard"
                    placeholder={field?.placeholder}
                    // style={{ border: "none" }}
                    value={field?.placeholder}
                    onChange={e => {
                      updateComponentHanlder({
                        ...field,
                        placeholder: e.target.value,
                      });
                      setCurrentField({
                        ...field,
                        placeholder: e.target.value,
                      });
                    }}
                  />
                </Grid>
              )} */}

              {/* {field?.type === 'email' && (
                <Grid item xs={12} className="field-property">
                  <InputLabel sx={{fontWeight: 500, color: 'black'}}>
                    Placeholder
                  </InputLabel>
                  <TextField
                    style={{width: '90%'}}
                    id={`${field?.key}_label`}
                    variant="standard"
                    placeholder={field?.placeholder}
                    // style={{ border: "none" }}
                    value={field?.placeholder}
                    onChange={e => {
                      updateComponentHanlder({
                        ...field,
                        placeholder: e.target.value,
                      });
                      setCurrentField({
                        ...field,
                        placeholder: e.target.value,
                      });
                    }}
                  />
                </Grid>
              )} */}

              {/* {field?.type != "text" && (
                <Grid item xs={12} className="field-property">
                  <InputLabel sx={{ fontWeight: 500, color: "black" }}>
                    Size
                  </InputLabel>
                  <Select
                    style={{ width: "90%" }}
                    onChange={(value) => {
                      updateComponentHanlder({ ...field, size: value });
                      setCurrentField({
                        ...field,
                        size: value,
                      });
                    }}
                  >
                    <MenuItem value="lg">Lg</MenuItem>
                    <MenuItem value="md">Md</MenuItem>
                    <MenuItem value="sm">Sm</MenuItem>
                  </Select>
                </Grid>
              )} */}

              {/* {field?.type !== 'text' && (
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              )} */}

              {/* <Grid item xs={12}>
                <Typography
                  sx={{fontWeight: 600, color: 'black'}}
                  variant="subtitle1">
                  Options
                </Typography>
              </Grid>

              <Grid item xs={12} className="field-property">
                <Checkbox
                  sx={{fontWeight: 500, color: 'black'}}
                  onChange={e => {
                    console.log('onChange Checkbox', e.target.checked);
                    updateComponentHanlder({
                      ...field,
                      required: e.target.checked,
                    });
                    setCurrentField({
                      ...field,
                      required: e.target.checked,
                    });
                  }}
                  label="Required"
                  checked={field?.required}
                />
              </Grid>

              <Grid item xs={12} className="field-property">
                <Checkbox
                  sx={{fontWeight: 500, color: 'black'}}
                  onChange={e => {
                    updateComponentHanlder({
                      ...field,
                      disabled: e.target.checked,
                    });
                    setCurrentField({
                      ...field,
                      disabled: e.target.checked,
                    });
                  }}
                  label="Disabled"
                  checked={field?.disabled}
                />
              </Grid> */}

              {/* <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid tem xs={12} textAlign="end" marginTop={2}>
                <MuiButton
                  sx={{
                    backgroundColor: '#ef5350',
                    ':hover': {
                      backgroundColor: '#ef5350',
                    },
                  }}
                  onClick={() => deletComponentHandler(field?.key)}
                  variant="contained"
                  startIcon={<DeleteIcon />}>
                  Delete
                </MuiButton>
              </Grid> */}
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  return <div>{renderFieldProperties(currentField)}</div>;
}

export default memo(PropertiesDrawer);
