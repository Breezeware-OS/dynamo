import {createFormEditor} from '@bpmn-io/form-js';
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useDispatch} from 'react-redux';
import {v4 as uuidv4, v4} from 'uuid';
import {RiDragDropLine} from 'react-icons/ri';
import {makeStyles} from '@material-ui/core';
import {
  Grid,
  InputLabel,
  Typography,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {Button, Tab, Text} from 'glide-design-system';
import {useNavigate, useParams} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BackendService from '../../service/BackendService';
import {
  handleDiscardModal,
  handleNotification,
  handlePublishModal,
  setFormData,
} from './formSlice';
import {logError, loginfo, traceSpan} from '../../helpers/tracing';
import GlideComponentButtons from './GlideComponentButtons';
import DraggableComponent from './DraggableComponent';
import {addComponentsHandler, renderComponents} from './RenderComponentsUtil';
import PropertiesDrawer from './PropertiesDrawer';
import DragDropIcon from '../../assets/icon/dragdrop.svg';
import DeleteFormElementModal from './DeleteFormElemenModal';
import ResponsesTable from './ResponsesTable';
import InvitedUsersTable from './InvitedUsersTable';
import editSquareFilled from '../../assets/icon/edit_square_filled.svg';
import settingsFilled from '../../assets/icon/settings_filled.svg';
import leaderboardFilled from '../../assets/icon/leaderboard_filled.svg';

// user schema to validate error handling
const formSchema = Yup.object().shape({
  title: Yup.string().required('Form Title is required.'),
  // description: Yup.string().required('Form Description is required.'),
});

const CreateForm = () => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmalll = useMediaQuery(theme.breakpoints.down('md'));

  const {name} = useParams();

  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // glide form builder states
  const [components, setComponents] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null); // Define draggedItemIndex state
  const [isComponentDragging, setIsComponentDragging] = useState(false);

  const [openPropertiesDrawer, setOpenPropertiesDrawer] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [formId, setFormId] = useState(uuidv4().slice(0, 8));
  const [index, setIndex] = useState(0);

  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const [openDeleteFormElementModal, setOpenDeleteFormElementModal] =
    useState(false);
  const [currentFormElement, setCurrentFormElement] = useState(null);
  const [isNewComponentDragging, setIsNewComponentDragging] = useState(false);
  const [
    currentComponentDraggingOverIndex,
    setCurrentComponentDraggingOverIndex,
  ] = useState(null);

  const formik = useFormik({
    initialValues: {title: name},
    validationSchema: formSchema,
    onSubmit: async values => {
      // traceSpan('Submit Form', async () => {
      await submitForm(values?.title, values?.description);
      // });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  /**
   * Submits form
   * @param {*} title of the form
   * @param {*} description of the form
   */
  const submitForm = async (title, description) => {
    // const components = formRef?.current?.getSchema();
    const body = {
      name: title,
      description: title,
      formJson: {components: components},
      uniqueId: formId,
    };
    await BackendService.saveForm(body)
      .then(res => {
        console.log('res', res?.data);
        // loginfo('Submit Form Success', res);
        dispatch(
          handleNotification({
            error: false,
            notificationMessage: 'Form Saved as draft',
          }),
        );
        setTimeout(() => {
          navigate(`/edit-form/${res?.data?.id}`);
        }, 2000);
      })
      .catch(err => {
        // logError('Submit Form Error', err);

        dispatch(
          handleNotification({error: true, notificationMessage: err?.message}),
        );
      });
  };

  /**
   * Publishes the form
   */
  const publishForm = () => {
    // Validate form title and description
    if (formik.values?.title === '' || !formik.values?.title) {
      formik.setErrors({
        title:
          formik.values?.title === '' || !formik.values?.title
            ? 'Form Title is required.'
            : null,
      });
    } else {
      // loginfo('Entering Publish Form', '');
      formik.setErrors({title: null});
      dispatch(
        setFormData({
          name: formik.values?.title,
          description: formik.values?.title,
          formJson: {components: components},
          uniqueId: formId,
        }),
      );
      dispatch(handlePublishModal());
    }
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
        name: formik.values?.title,
        description: formik.values?.description,
        formJson: {components: components},
        uniqueId: formId,
      }),
    );
    window.open('/view-form', '_blank');
  };

  // glide form builder methods start

  const removeFieldOption = (field, optionIdToRemove) => {
    let updatedField = {
      ...field,
      options: field?.options.filter(option => option.key !== optionIdToRemove),
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
    setCurrentFormElement(null);
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
    event.preventDefault();
    const buttonLabel = event.dataTransfer.getData('text/plain');
    dropComponentHandler(buttonLabel);
    setIsComponentDragging(false);
    setIsNewComponentDragging(false);
    setCurrentComponentDraggingOverIndex(null);
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

  const onTabChange = idx => {
    setIndex(idx);
  };

  console.log('components', components);

  return (
    <div>
      <DeleteFormElementModal
        open={openDeleteFormElementModal}
        closeModal={() => setOpenDeleteFormElementModal(false)}
        currentFormElement={currentFormElement}
        deletComponentHandler={deletComponentHandler}
      />
      <form onSubmit={e => e.preventDefault()}>
        <div className={classes.container}>
          <Grid
            marginBottom="16px"
            container
            padding="6px"
            paddingLeft="24px"
            paddingRight="24px"
            paddingBottom={isMedium ? '16px' : '0px'}
            width="100%"
            display="flex"
            border="1px solid #d7d7d7"
            // borderRadius="5px"
            sx={{boxShadow: '0px 0px 5px 0px #a5a5a5'}}>
            <Grid
              item
              xs={12}
              xl={4}
              lg={3}
              sx={{paddingLeft: '10px'}}
              display="flex"
              alignItems="center"
              flexDirection="row">
              {/* <MuiTextField
                variant="standard"
                id="title"
                name="title"
                size="small"
                value={formik?.values?.title}
                onChange={formik.handleChange}
                type="text"
                sx={{
                  width: 'auto',
                  fontSize: '22px',
                  marginRight: '15px',
                  '.MuiInputBase-input': {
                    paddingRight: '0px',
                    fontSize: '22px !important',
                    fontWeight: '700 !important',
                    color: '#d7d7d7',
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
                    name="title"
                    value={formik?.values?.title || 'untitled'}
                    onChange={e =>
                      formik.setFieldValue('title', e.target.value)
                    }
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
                  name="title"
                  contentEditable
                  onInput={e => {
                    formik.setFieldValue('title', e.currentTarget.textContent);
                  }}>
                  {formik?.values?.title || 'untitled'}
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

              {formik.errors?.title && (
                <Text className={classes.error}>{formik.errors?.title}</Text>
              )}
            </Grid>
            {/* <Grid item xs={12} xl={4} lg={3}>
              <TextField
                label="Form Description"
                required
                name="description"
                placeholder="Form Description"
                width="100%"
                onChange={formik.handleChange}
                style={{color: 'black'}}
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
              padding={0}
              justifyContent="center"
              display="flex">
              <Tab
                // style={{display:"flex",justifyContent:"space-between"}}
                onTabChange={onTabChange}
                activeIndex={0}
                showIndicator={false}
                id="tab"
                indicatorStyle="bottomLine"
                className="form-tab"
                style={{
                  width: '100%',
                }}>
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
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              paddingRight="10px"
              marginTop={isSmalll ? '8px' : '0px'}>
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
                lg={2}
                display="flex"
                justifyContent={isSmalll ? 'center' : 'end'}
                marginRight="0px">
                <Button
                  variant="outlined"
                  className={` ${classes.previewButton} form-btn`}
                  onClick={() => {
                    previewForm();
                  }}>
                  <span className="material-symbols-outlined">visibility</span>{' '}
                  Preview
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                lg={2}
                display="flex"
                justifyContent={isSmalll ? 'center' : 'end'}
                marginRight="0px">
                <Button
                  variant="outlined"
                  className={` ${classes.saveButton} form-btn`}
                  onClick={formik.handleSubmit}
                  id="save-btn">
                  <span className="material-symbols-outlined">save</span>Save
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
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
                  addComponentsHandler={addNewComponentsHandler}
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
                  // marginTop: '20px',
                  marginTop: '0',
                  overflow: 'auto',
                  borderRadius: 8,
                  boxShadow: '0px 0px 5px 0px #a5a5a5',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}>
                {/* Drop Zone */}
                <div style={{padding: '2%'}}>
                  {components.length > 0 && (
                    <Grid container sx={{width: '100%'}}>
                      <div style={{width: '100%'}}>
                        {components?.map((component, index) => {
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
                                  style={{
                                    display: 'flex',
                                    position: 'relative',
                                  }}
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
                                      style={{width: '90%'}}
                                      className="form-field-hover">
                                      {renderComponents(component)}
                                    </div>
                                    <div
                                      className="delete-form-field"
                                      style={{
                                        width: '10%',
                                        paddingLeft: '1%',
                                      }}>
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
                    </Grid>
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
                />
              </div>
            </div>
          </div>
        )}

        {index === 1 && (
          <ResponsesTable
            formId={null}
            components={[]}
            currentComponentsArray={[]}
            data={null}
          />
        )}

        {index === 2 && <InvitedUsersTable formId={formId} data={null} />}
      </form>
    </div>
  );
};

export default CreateForm;

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
