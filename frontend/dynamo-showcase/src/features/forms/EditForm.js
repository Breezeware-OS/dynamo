import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {
  Backdrop,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {Button, ProgressCricle, Tab, Text} from 'glide-design-system';
import {useNavigate, useParams} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import {v4 as uuidv4, v4} from 'uuid';
import BackendService from '../../service/BackendService';
import {handleNotification, handlePublishModal, setFormData} from './formSlice';
import {addComponentsHandler, renderComponents} from './RenderComponentsUtil';
// import {logError, loginfo, traceSpan} from '../../helpers/tracing';
import ResponsesTable from './ResponsesTable';
import InvitedUsersTable from './InvitedUsersTable';
import GlideComponentButtons from './GlideComponentButtons';
import DraggableComponent from './DraggableComponent';
import PropertiesDrawer from './PropertiesDrawer';
import DragDropIcon from '../../assets/icon/dragdrop.svg';
import DeleteFormElementModal from './DeleteFormElemenModal';
import editSquareFilled from '../../assets/icon/edit_square_filled.svg';
import settingsFilled from '../../assets/icon/settings_filled.svg';
import leaderboardFilled from '../../assets/icon/leaderboard_filled.svg';

function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms));
}

const BASE_DYNAMO_FORM_URL = process.env.REACT_APP_DYNAMO_FORM_URL + '/form';

const EditForm = () => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmalll = useMediaQuery(theme.breakpoints.down('md'));

  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const formRef = useRef(null);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [version, setVersion] = useState();
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedValue, setCopiedValue] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [openDeleteFormElementModal, setOpenDeleteFormElementModal] =
    useState(false);
  const [currentFormElement, setCurrentFormElement] = useState(null);

  // glide form builder states
  const [components, setComponents] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null); // Define draggedItemIndex state
  const [isComponentDragging, setIsComponentDragging] = useState(false);

  const [openPropertiesDrawer, setOpenPropertiesDrawer] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [formId, setFormId] = useState(uuidv4().slice(0, 8));

  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const [openPublishMenu, setOpenPublishMenu] = useState(null);
  const open = Boolean(openPublishMenu);
  const [publishSetting, setPublishSetting] = useState('private');

  const [isNewComponentDragging, setIsNewComponentDragging] = useState(false);
  const [
    currentComponentDraggingOverIndex,
    setCurrentComponentDraggingOverIndex,
  ] = useState(null);

  const formSchema = Yup.object().shape({
    name: Yup.string().required('Form Title is required.'),
    description: Yup.string().required('Form Description is required.'),
  });

  const [currentComponentsArray, setCurrentComponentsArray] = useState([]);

  const formik = useFormik({
    validationSchema: formSchema,
    onSubmit: async values => {
      await submitForm(values?.name, values?.description);
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  /**
   * Submits the form
   */
  const submitForm = async (name, description) => {
    const body = {
      id: id,
      name: name,
      description: description,
      formJson: {
        components: components,
      },
      version: data?.version,
    };
    await BackendService.saveForm(body)
      .then(res => {
        // loginfo('Edit Form Success', res);

        dispatch(
          handleNotification({
            error: false,
            notificationMessage: 'Form Saved as draft',
          }),
        );
        setTimeout(() => {
          navigate(`/edit-form/${res?.data?.id}`);
        }, 1000);
      })
      .catch(err => {
        // logError('Edit Form Error', err);

        dispatch(
          handleNotification({error: true, notificationMessage: err?.message}),
        );
      });
  };

  /**
   * Publishes the form
   */
  const publishForm = () => {
    dispatch(
      setFormData({
        id: id,
        name: title,
        description: description,
        formJson: {components: components},
        uniqueId: uniqueId,
      }),
    );
    dispatch(handlePublishModal());
  };

  /**
   * retrieves the data of the selected form to edit
   */
  const getData = async () => {
    setLoading(true);
    await BackendService.retrieveForm({id: id})
      .then(async res => {
        // loginfo('Retieve Edit Form data', res);

        setTitle(res?.data?.name);
        setDescription(res?.data?.description);
        setVersion(res?.data?.version);
        formik.setValues({
          name: res?.data?.name,
          description: res?.data?.description,
        });
        await sleep(2000);
        setLoading(false);
        // renderForm(res.data);
        setComponents(res?.data?.formJson?.components);
        await setFormData(res.data);
        setData(res.data);
        setUniqueId(res?.data?.uniqueId);
      })
      .catch(err => {
        // logError('Retieve Edit Form data', err);

        setLoading(false);
      });
  };

  const getLabels = () => {
    let currentLabels = [];

    BackendService.getCurrentFormLabels(id)
      .then(res => {
        // setLoader(false);
        currentLabels = res.data;
        const newArray = [];
        const labelCounts = {};
        let idCustomBodyRenderer = rowItem => {
          return (
            <div>
              <Text style={{fontSize: '16px'}}>{rowItem.id}</Text>
            </div>
          );
        };

        let submissionDateCustomBodyRenderer = rowItem => {
          return (
            <div>
              <Text style={{fontSize: '16px'}}>
                {new Date(rowItem?.submission_date).toLocaleDateString()}
              </Text>
            </div>
          );
        };

        newArray.push({
          label: 'id',
          key: 'id',
          fieldName: 'id',
          customBodyRenderer: idCustomBodyRenderer,
          style: {width: '400px'},
        });

        newArray.push({
          label: 'submissionDate',
          key: 'submissionDate',
          fieldName: 'submission_Date',
          customBodyRenderer: submissionDateCustomBodyRenderer,
          style: {width: '400px'},
        });

        currentLabels.forEach(item => {
          if (
            item !== 'id' &&
            item !== 'submission_date' &&
            item !== 'form_version' &&
            item !== 'form_id'
          ) {
            let label = typeof item === 'object' ? item : item;
            let key = item;
            let fieldName = typeof item === 'object' ? item : item;
            let style = {
              width: '400px',
            };
            let customBodyRenderer = rowItem => {
              return (
                <div>
                  {typeof rowItem[label] === 'number' && (
                    <Text style={{fontSize: '16px'}}>{rowItem[label]}</Text>
                  )}
                  {/* 
                  {label === 'submission_date' && (
                    <Text style={{fontSize: '16px'}}>
                      {new Date(rowItem[label]).toLocaleDateString()}
                    </Text>
                  )} */}

                  {rowItem[label] === null && (
                    <Text style={{fontSize: '16px'}}>-</Text>
                  )}

                  {typeof rowItem[label] === 'string' &&
                    rowItem[label].startsWith('{') && (
                      <Text style={{fontSize: '16px'}}>
                        {/* Parse the stringified object back to an object */}
                        {/* {JSON.parse(rowItem[label])} */}
                        {Object.values(JSON.parse(rowItem[label])).join(',')}
                      </Text>
                    )}

                  {rowItem[label] !== null &&
                    label !== 'submission_date' &&
                    typeof rowItem[label] === 'string' &&
                    !rowItem[label].startsWith('{') && (
                      <Text style={{fontSize: '16px'}}>{rowItem[label]}</Text>
                    )}
                </div>
              );
            };

            if (labelCounts[label] !== undefined) {
              labelCounts[label]++;
              label = `${label}_${labelCounts[label]}`;
            } else {
              labelCounts[label] = 0;
            }
            newArray.push({
              label,
              key,
              fieldName,
              customBodyRenderer,
              style,
            });
          }
        });

        setCurrentComponentsArray(newArray);
      })
      .catch(error => {
        setCurrentComponentsArray([]);
        // setLoader(false);
        // setError(error?.response?.data?.details[0] || 'An error occured.');
      });
  };

  /**
   * Preview of form when creating
   * set the form data in local storage to access in preview page
   * opens in a new tab
   */
  const previewForm = async () => {
    // loginfo('Entering Preview Form', '');

    sessionStorage.setItem(
      'formJson',
      JSON.stringify({
        name: title,
        description: description,
        formJson: {components: components},
        uniqueId: uniqueId,
      }),
    );
    window.open('/view-form', '_blank');
  };

  const onTabChange = idx => {
    setIndex(idx);
    if (idx === 0) {
      getData();
    }
  };

  const copyFormUrl = (url, id) => {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);
    setCopiedValue(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setCopiedValue(null);
    }, 1500);
  };

  useEffect(() => {
    // traceSpan('Get Form Data', async () => {
    getData();
    getLabels();
    // });
  }, []);

  // glide form builder methods start

  const removeFieldOption = (field, optionIdToRemove) => {
    let updatedField = {
      ...field,
      options: field?.options.filter(option => option.id !== optionIdToRemove),
    };

    setCurrentField(updatedField);
    updateComponentHanlder(updatedField);
  };

  const addNewComponentsHandler = component => {
    addComponentsHandler(component, setComponents, setCurrentField);
  };

  const updateComponentHanlder = updatedComponent => {
    setComponents(prevComponents =>
      prevComponents.map(component => {
        if (component.key === updatedComponent.key) {
          return updatedComponent;
        }
        return component;
      }),
    );
  };

  const updatedOptionHandler = (componentId, optionId, newLabel) => {
    setComponents(component => {
      const updatedFields = component.map(field => {
        if (field?.key === componentId) {
          const updatedOptions = field?.options.map(option => {
            if (option.key === optionId) {
              return {
                ...option,
                value: newLabel,
                label: newLabel,
              };
            }
            return option;
          });

          setCurrentField({...field, options: updatedOptions});

          return {
            ...field,
            options: updatedOptions,
          };
        }
        return field;
      });
      return updatedFields;
    });
  };

  const deletComponentHandler = componentId => {
    setComponents(prevComponents =>
      prevComponents.filter(component => component.key !== componentId),
    );
    setOpenPropertiesDrawer(false);
    setCurrentField(null);
  };

  const dropComponentHandler = buttonLabel => {
    const buttonLabels = [
      'textField',
      'select',
      'textarea',
      'datetime',
      'text',
      'number',
      'radio',
      'checkbox',
      'fullname',
      'checkboxGroup',
      'multiSelect',
      'phoneNumber',
      'address',
      'email',
      'heading',
      'divider',
      'paragraph',
    ];

    if (buttonLabels.includes(buttonLabel)) {
      // const newComponent = {
      //   id: `${buttonLabel}_${uuidv4().slice(0, 8)}`,
      //   type: buttonLabel,
      // };
      // setComponents((prevComponents) => [...prevComponents, newComponent]);
      addNewComponentsHandler(buttonLabel);
    }
  };

  const handleDrop = event => {
    setIsNewComponentDragging(false);
    setCurrentComponentDraggingOverIndex(null);
    event.preventDefault();
    const buttonLabel = event.dataTransfer.getData('text/plain');
    dropComponentHandler(buttonLabel);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDragStart = draggedIndex => {
    setIsComponentDragging(true);
    setDraggedItemIndex(draggedIndex);
  };

  const handleDragEnter = (event, droppedIndex) => {
    setCurrentComponentDraggingOverIndex(droppedIndex);
    event.preventDefault();

    const currentComponentsArray = components;
    const currentComponentsArrayLength = currentComponentsArray.length;

    if (isComponentDragging) {
      if (currentComponentsArrayLength - 1 === droppedIndex) {
        const elementToMove = currentComponentsArray.splice(
          draggedItemIndex,
          1,
        )[0];
        currentComponentsArray.push(elementToMove);
        setComponents(currentComponentsArray);
        // setIsComponentDragging(false);
      } else {
        const draggedItem = components[draggedItemIndex];

        const newComponents = [...components];
        newComponents.splice(draggedItemIndex, 1);
        newComponents.splice(droppedIndex, 0, draggedItem);

        setComponents(newComponents);
        // setIsComponentDragging(false);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setIsComponentDragging(false);
    setCurrentComponentDraggingOverIndex(null);
  };

  return (
    <>
      <Backdrop
        open={loading}
        sx={{backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 12}}>
        <ProgressCricle color="rgb(32, 103, 167)" />
      </Backdrop>

      <DeleteFormElementModal
        open={openDeleteFormElementModal}
        closeModal={() => setOpenDeleteFormElementModal(false)}
        currentFormElement={currentFormElement}
        deletComponentHandler={deletComponentHandler}
      />

      {/* <div
        style={{
          paddingBottom: 10,
          display: 'flex',
          alignItems: 'center',
          marginTop: '1%',
        }}>
        <Text style={{fontSize: '24px', color: '#333333'}} id="header">
          Edit Form - {title} {version ? '- ' + version : ''}{' '}
        </Text>

        <Chip
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '5px',
            fontSize: '12px',
            fontWeight: 400,
            textTransform: 'capitalize',
            backgroundColor: formStatusBackgroundColor(data?.status),
            color: '#333333',
            marginRight: '8px',
            marginLeft: '8px',
          }}>
          {data?.status}
        </Chip>

        {data?.accessType && (
          <Chip
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '5px',
              fontSize: '12px',
              fontWeight: 400,
              textTransform: 'capitalize',
              backgroundColor: '#d7d7d7',
              color: '#333333',
              marginRight: '8px',
              marginLeft: '8px',
            }}>
            {data?.accessType === 'public' && (
              <span
                style={{fontSize: '16px'}}
                class="material-symbols-outlined">
                public
              </span>
            )}
            {data?.accessType === 'private' && (
              <span
                style={{fontSize: '16px'}}
                class="material-symbols-outlined">
                lock
              </span>
            )}
            {data?.accessType === 'private'
              ? 'Private'
              : data?.accessType === 'public'
              ? 'Public'
              : ''}
          </Chip>
        )}
      </div>
      <div style={{marginBottom: 8, display: 'flex', alignItems: 'center'}}>
        Link -
        {data?.uniqueId && data?.status === 'Published' && (
          <a
            style={{
              cursor: 'pointer',
            }}>{`${BASE_DYNAMO_FORM_URL}/${data.uniqueId}`}</a>
        )}
        {data?.uniqueId && data?.status === 'Published' && !isCopied && (
          <span
            onClick={() =>
              copyFormUrl(`${BASE_DYNAMO_FORM_URL}/${data.uniqueId}`)
            }
            style={{
              cursor: 'pointer',
              fontSize: '17px',
              marginLeft: '5px',
              color: 'black',
            }}
            class="material-symbols-outlined">
            content_copy
          </span>
        )}
        {isCopied && (
          <span style={{marginLeft: '5px'}} class="material-symbols-outlined">
            done_all
          </span>
        )}
      </div> */}

      <form onSubmit={e => e.preventDefault()}>
        <div className={classes.container}>
          <Grid
            marginBottom={2}
            container
            padding="6px"
            paddingLeft="24px"
            paddingRight="24px"
            paddingBottom={isMedium ? '16px' : '0px'}
            // columnSpacing={2}
            width="100%"
            display="flex"
            border="1px solid #d7d7d7"
            alignItems="center"
            flexDirection="row"
            // borderRadius="5px"
            sx={{boxShadow: '0px 0px 5px 0px #a5a5a5'}}>
            <Grid
              item
              xs={12}
              xl={4}
              lg={3}
              display="flex"
              alignItems="center"
              flexDirection="row">
              {/* <MuiTextField
                variant="standard"
                id="title"
                name="name"
                size="small"
                value={formik?.values?.name ? formik?.values?.name : ''}
                onChange={formik.handleChange}
                type="text"
                sx={{
                  width: 'auto',
                  marginRight: '15px',
                  '.MuiInputBase-input': {
                    paddingRight: '0px',
                    fontSize: '22px !important',
                    fontWeight: '700 !important',
                    color: '#999999 !important',
                    width: 'auto',
                  },
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              /> */}
              {isTitleEditing && (
                <>
                  <TextField
                    variant="standard"
                    name="name"
                    value={formik?.values?.name || 'untitled'}
                    onChange={e => formik.setFieldValue('name', e.target.value)}
                    sx={{
                      color: '#999999',
                      // width: 'auto',
                      // maxWidth: '342px',
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '6px',
                      overflow: 'hidden',
                      '.MuiInputBase-input': {
                        fontSize: '22px',
                        fontWeight: '700',
                        padding: '0px',
                        overflow: 'hidden',
                        // width: 'auto',
                        // maxWidth: '342px',
                      },
                      '.MuiInput-root::after': {
                        borderColor: '#1b3764',
                      },
                    }}
                  />
                  <Tooltip title="Save">
                    <IconButton
                      sx={{
                        padding: 0,
                        ':hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                      onClick={() => {
                        setIsTitleEditing(false);
                        formik.handleSubmit();
                      }}>
                      <span
                        style={{color: '#90cb92'}}
                        class="material-symbols-outlined">
                        check
                      </span>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton
                      sx={{
                        padding: 0,
                        paddingLeft: 1,
                        ':hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                      onClick={() => setIsTitleEditing(false)}>
                      <span className="material-symbols-outlined">close</span>
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {!isTitleEditing && (
                <div
                  onFocus={() => setIsTitleEditing(true)}
                  className="edit-form-title"
                  style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#999999',
                    maxWidth: '342px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '6px',
                    overflow: 'hidden',
                  }}
                  name="name"
                  contentEditable
                  onInput={e => {
                    formik.setFieldValue('name', e.currentTarget.textContent);
                  }}>
                  {formik?.values?.name || 'untitled'}
                </div>
              )}
              {!isTitleEditing && (
                <Tooltip title="Edit Title">
                  <IconButton
                    disableRipple
                    onClick={() => setIsTitleEditing(true)}>
                    <span
                      class="material-symbols-outlined"
                      style={{color: '#999999'}}>
                      edit
                    </span>
                  </IconButton>
                </Tooltip>
              )}
              {formik.errors?.name && (
                <Text className={classes.error}>{formik.errors?.name}</Text>
              )}
            </Grid>
            {/* <Grid item xs={12} xl={4} lg={3}>
              <InputLabel sx={{fontSize: '14px', color: '#333333'}}>
                Form Description <span style={{color: 'red'}}>*</span>
              </InputLabel>
              <TextField
                name="description"
                placeholder="Form Description"
                fullWidth
                size="small"
                // disabled
                value={formik?.values?.description}
                onChange={formik.handleChange}
                style={{color: 'black !important'}}
              />
              {formik.errors?.description && (
                <Text className={classes.error}>
                  {formik.errors?.description}
                </Text>
              )}
            </Grid> */}

            <Grid
              item
              xs={12}
              xl={4}
              lg={3}
              justifyContent="center"
              display="flex">
              <Tab
                className="form-tab"
                onTabChange={onTabChange}
                activeIndex={index}
                id="tab"
                indicatorStyle="bottomLine"
                showIndicator={false}
                style={{width: '100%'}}>
                <div
                  id="build"
                  label={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        color: index === 0 ? '#1B3764' : 'rgb(153, 153, 153)',
                        fontSize: '22px',
                      }}>
                      {index !== 0 && (
                        <span
                          style={{marginRight: '6px'}}
                          class="material-symbols-outlined">
                          edit_square
                        </span>
                      )}
                      {index === 0 && (
                        <img
                          style={{
                            color: 'rgb(10, 91, 153)',
                            marginRight: '6px',
                          }}
                          src={editSquareFilled}
                        />
                      )}
                      Build
                    </span>
                  }
                />
                <div
                  id="responses"
                  label={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        color: index === 1 ? '#1B3764' : 'rgb(153, 153, 153)',
                        fontSize: '22px',
                      }}>
                      {index !== 1 && (
                        <span
                          class="material-symbols-outlined"
                          style={{marginRight: '6px'}}>
                          leaderboard
                        </span>
                      )}
                      {index === 1 && (
                        <img
                          style={{
                            color: 'rgb(10, 91, 153)',
                            marginRight: '6px',
                          }}
                          src={leaderboardFilled}
                        />
                      )}
                      Responses
                    </span>
                  }
                />
                <div
                  id="settings"
                  label={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        color: index === 2 ? '#1B3764' : 'rgb(153, 153, 153)',
                        fontSize: '22px',
                      }}>
                      {index !== 2 && (
                        <span
                          style={{marginRight: '6px'}}
                          class="material-symbols-outlined">
                          settings
                        </span>
                      )}
                      {index === 2 && (
                        <img
                          style={{
                            color: 'rgb(10, 91, 153)',
                            marginRight: '6px',
                          }}
                          src={settingsFilled}
                        />
                      )}
                      Settings
                    </span>
                  }
                />
              </Tab>
            </Grid>

            <Grid
              item
              container
              xs={12}
              xl={4}
              lg={6}
              display="flex"
              justifyContent="end"
              marginTop={isSmalll ? '8px' : '0px'}>
              {/* <Button
                variant="outlined"
                className={` ${classes.previewButton} form-btn`}
                onClick={() => {
                  // traceSpan('Preview Form', async () => {
                  previewForm();
                  // });
                }}>
                <span class="material-symbols-outlined">visibility</span>{' '}
                Preview
              </Button>
              <Button
                variant="outlined"
                className={` ${classes.previewButton} form-btn`}
                onClick={() => {
                  formik.handleSubmit();
                }}
                id="save-btn">
                <span class="material-symbols-outlined">save</span>Save
              </Button>
              <Button
                className={` ${classes.button} form-btn-publish`}
                onClick={() => {
                  publishForm();
                }}>
                <span class="material-symbols-outlined">publish</span> Publish
              </Button> */}
              {/* <Grid item xs={12} lg={3} xl={3}>
                <Button
                  color="secondary"
                  style={{width: '100%', fontSize: '13px'}}
                  onClick={() => {
                    // traceSpan('Discard Form', async () => {
                    dispatch(handleDiscardModal());
                    // });
                  }}>
                  Discard & Exit
                </Button>
              </Grid> */}
              <Grid
                item
                xs={12}
                sm={4}
                md={1.2}
                lg={2}
                display="flex"
                justifyContent={isSmalll ? 'center' : 'end'}
                marginRight="0px">
                <Button
                  variant="outlined"
                  className={` ${classes.previewButton} form-btn`}
                  onClick={() => {
                    // traceSpan('Preview Form', async () => {
                    previewForm();
                    // });
                  }}>
                  <span className="material-symbols-outlined">visibility</span>{' '}
                  Preview
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={1.2}
                lg={2}
                display="flex"
                justifyContent={isSmalll ? 'center' : 'end'}
                marginRight="0px">
                <Button
                  variant="outlined"
                  className={` ${classes.saveButton} form-btn`}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  id="save-btn">
                  <span className="material-symbols-outlined">save</span>Save
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={1.2}
                lg={2}
                display="flex"
                justifyContent={isSmalll ? 'center' : 'end'}>
                <Button
                  className={` ${classes.button} form-btn-publish`}
                  onClick={() => {
                    publishForm();
                  }}>
                  <span className="material-symbols-outlined">publish</span>{' '}
                  Publish
                </Button>
              </Grid>
              {/* publish dropdown start */}
              {/* <IconButton
                  sx={{
                    height: '36px',
                    backgroundColor: '#0a5b99',
                    color: 'white',
                    marginLeft: '1px',
                    borderRadius: '5px !important',
                    ':hover': {
                      backgroundColor: '#0a5b99',
                    },
                  }}
                  onClick={e => setOpenPublishMenu(e.currentTarget)}>
                  {publishSetting === 'private' && (
                    <span class="material-symbols-outlined">lock</span>
                  )}
                  {publishSetting === 'public' && (
                    <span class="material-symbols-outlined">group</span>
                  )}
                  {openPublishMenu && (
                    <span class="material-symbols-outlined">expand_more</span>
                  )}
                  {!openPublishMenu && (
                    <span class="material-symbols-outlined">expand_less</span>
                  )}
                </IconButton>
                <Menu
                  anchorEl={openPublishMenu}
                  open={open}
                  onClose={() => setOpenPublishMenu(null)}
                  data-testid="action-menu"
                  id="action-menu"
                  style={{
                    minWidth: '118px',
                  }}>
                  {publishSetting === 'private' && (
                    <MenuItem
                      onClick={() => {
                        setPublishSetting('public');
                        setOpenPublishMenu(null);
                      }}>
                      <span
                        style={{marginRight: '8px'}}
                        class="material-symbols-outlined">
                        group
                      </span>
                      Make Public
                    </MenuItem>
                  )}
                  {publishSetting === 'public' && (
                    <MenuItem
                      onClick={() => {
                        setPublishSetting('private');
                        setOpenPublishMenu(null);
                      }}>
                      <span
                        style={{marginRight: '8px'}}
                        class="material-symbols-outlined">
                        lock
                      </span>
                      Make Private
                    </MenuItem>
                  )}
                </Menu> */}
              {/* publish dropdown end */}
            </Grid>
          </Grid>
        </div>

        {index === 0 && (
          <div
            style={{
              display: isMedium ? 'block' : 'flex',
              padding: '24px',
              paddingTop: '0px',
            }}>
            <div
              style={{
                width: isMedium ? '100%' : '20%',
                // borderRight: '1px solid #d7d7d7',
                // borderTop: '1px solid #d7d7d7',
              }}>
              <div
                style={{
                  // width: '90%',
                  borderRadius: 8,
                  padding: '24px',
                  paddingTop: '2.5%',
                  border: '1px solid #d7d7d7',
                  boxShadow: '0px 0px 5px 0px #a5a5a5',
                }}>
                <GlideComponentButtons
                  addNewComponentsHandler={addNewComponentsHandler}
                  setIsNewComponentDragging={setIsNewComponentDragging}
                />
              </div>
            </div>
            <div
              style={{
                width: isMedium ? '100%' : '60%',
                // borderRight: '1px solid #d7d7d7',
                // borderTop: '1px solid #d7d7d7',
              }}>
              <div
                style={{
                  border: '1px solid #d7d7d7',
                  height: isMedium ? 'auto' : '735px',
                  // marginTop: '20px',
                  margin: isMedium ? '0%' : '16px',
                  marginTop: '0',
                  overflow: 'auto',
                  borderRadius: 8,
                  boxShadow: '0px 0px 5px 0px #a5a5a5',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}>
                {/* Drop Zone */}
                <div style={{padding: '2%'}}>
                  {components?.length > 0 && (
                    <div>
                      {components.map((component, index) => {
                        return (
                          <>
                            {currentComponentDraggingOverIndex === index &&
                              isComponentDragging && (
                                <div
                                  style={{
                                    borderRadius: 8,
                                    margin: '16px',
                                    height: '60px',
                                    border: '2px dashed rgb(149 175 217)',
                                    backgroundColor: '#F0F6FB',
                                  }}
                                />
                              )}
                            <DraggableComponent
                              key={component.key}
                              index={index}
                              onDragStart={() => handleDragStart(index)}
                              onDragEnter={event =>
                                handleDragEnter(event, index)
                              }
                              onDragEnd={handleDragEnd}
                              style={
                                {
                                  // border:
                                  //   // isComponentDragging &&
                                  //   // draggedItemIndex === index
                                  //   //   ? '2px dashed #d7d7d7' :
                                  //   '1px solid #d7d7d7',
                                }
                              }>
                              <div
                                style={{display: 'flex', position: 'relative'}}
                                className="parent-div">
                                <div
                                  onClick={e => {
                                    e.stopPropagation();
                                    setOpenPropertiesDrawer(true);
                                    setCurrentField(component);
                                  }}
                                  key={component.key}
                                  style={{
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}>
                                  <div
                                    className="form-field-hover"
                                    style={{width: '90%'}}>
                                    {renderComponents(component)}
                                  </div>
                                  <div
                                    className="delete-form-field"
                                    style={{width: '10%', paddingLeft: '1%'}}>
                                    <IconButton
                                      sx={{
                                        padding: '0px',
                                        color: '#A5A5A5',
                                        ':hover': {
                                          backgroundColor: 'transparent',
                                        },
                                      }}
                                      onClick={() => {
                                        // deletComponentHandler(component?.key);
                                        setCurrentFormElement(component);
                                        setOpenDeleteFormElementModal(true);
                                      }}>
                                      <span className="material-symbols-outlined">
                                        delete
                                      </span>
                                    </IconButton>
                                  </div>
                                </div>
                              </div>
                            </DraggableComponent>
                          </>
                        );
                      })}
                    </div>
                  )}
                  {isNewComponentDragging && (
                    <div
                      style={{
                        borderRadius: 8,
                        margin: '16px',
                        height: '60px',
                        border: '2px dashed rgb(149 175 217)',
                        backgroundColor: '#F0F6FB',
                      }}
                    />
                  )}
                  {components?.length === 0 && (
                    <div
                      style={{
                        marginTop: '10%',
                        textAlign: 'center',
                        gap: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      <img
                        src={DragDropIcon}
                        alt=""
                        style={{width: '135px', height: '135px'}}
                      />
                      <Text
                        style={{
                          fontSize: '16px',
                          color: '#949494',
                          fontWeight: '700',
                          width: '50%',
                        }}>
                        Looks like this page is empty. Start building your form
                        by adding elements and customizing it to suit your
                        needs!
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{width: isMedium ? '100%' : '20%'}}>
              <div
                style={{
                  // width: '90%',
                  height: isMedium ? 'auto' : '735px',
                  borderRadius: 8,
                  padding: '2.5%',
                  border: '1px solid #d7d7d7',
                  boxShadow: '0px 0px 5px 0px #a5a5a5',
                }}>
                <PropertiesDrawer
                  open={openPropertiesDrawer}
                  onClose={() => {
                    setOpenPropertiesDrawer(false);
                    setCurrentField(null);
                  }}
                  components={components}
                  updateComponentHanlder={updateComponentHanlder}
                  removeFieldOption={removeFieldOption}
                  updatedOptionHandler={updatedOptionHandler}
                  deletComponentHandler={deletComponentHandler}
                  currentField={currentField}
                  setCurrentField={setCurrentField}
                  formId={formId}
                  uniqueId={uniqueId}
                />
              </div>
            </div>
          </div>
        )}

        {index === 1 && (
          <ResponsesTable
            formId={id}
            components={components}
            currentComponentsArray={currentComponentsArray}
            data={data}
          />
        )}
        {index === 2 && <InvitedUsersTable formId={id} data={data} />}
      </form>
    </>
  );
};

export default EditForm;

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: '5px',
    borderBottom: 'none',
  },
  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '13px !important',
    fontFamily: 'Roboto,sans-serif !important',
  },
  tabStyle: {
    borderBottom: 'none !important',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
  previewButton: {
    backgroundColor: 'white !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
    marginRight: '8px',
  },
  saveButton: {
    backgroundColor: 'white !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
    marginRight: '11px',
  },
}));
