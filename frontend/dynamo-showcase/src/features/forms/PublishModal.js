import {
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  RadioGroup,
} from '@mui/material';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {
  Button,
  MenuItem,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Select,
  Text,
  TextField,
} from 'glide-design-system';
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuidv4, v4} from 'uuid';

import {makeStyles} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {
  getFormData,
  getPublishModalStatus,
  handleNotification,
  handlePublishModal,
} from './formSlice';
import BackendService from '../../service/BackendService';
import {loginfo, traceSpan} from '../../helpers/tracing';

const versionSchema = Yup.object().shape({
  version: Yup.string().required('Form Version is required.'),
  shareSettings: Yup.string().required('Share Settings is required.'),
});

/**
 * Modal to get update the version of the form when publishing
 * @param {*} open status of the modal is opend or not boolean
 * @param {*} getData  is a function passed from FormList to execute the function after published to update the status and version of the form
 * @returns modal with field to update value
 */

const BASE_DYNAMO_FORM_URL = process.env.REACT_APP_DYNAMO_FORM_URL + '/form';

const PublishModal = ({open, getData, user}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector(getFormData);

  const [uniqueId, setUniqueId] = useState(formData?.uniqueId || uuidv4());

  useEffect(() => {
    if (!open) {
      setUniqueId(null);
    }
    if (open && formData?.uniqueId) {
      setUniqueId(formData?.uniqueId);
    }

    if (open && !formData?.uniqueId) {
      setUniqueId(uuidv4());
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {shareSettings: 'private'},
    validationSchema: versionSchema,
    onSubmit: async values => {
      const data = {
        id: formData?.id ? formData?.id : null,
        name: formData?.name,
        description: formData?.description,
        formJson: formData?.formJson,
        version: values.version,
        uniqueId: uniqueId.slice(0, 8),
        accessType: values.shareSettings,
        ownerEmail: user?.attributes?.email,
      };

      // loginfo('Submit Form Data', data);
      // traceSpan('Submit Form Data', async () => {
      BackendService.publishForm(data)
        .then(res => {
          // loginfo('Submit Form ', res);

          if (getData) {
            getData();
          }
          dispatch(
            handleNotification({
              error: false,
              notificationMessage: 'Form Published Successfully',
            }),
          );
          setTimeout(() => {
            navigate(`/edit-form/${res?.data?.id}`);
          }, 1000);
        })
        .catch(err => {
          // loginfo('Submit Form ', err);
          if (getData) {
            getData();
          }

          handleNotification({
            error: true,
            notificationMessage: err?.message,
          });
        });
      // });

      dispatch(handlePublishModal());
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  return (
    <Modal
      id="modal"
      open={open}
      onClose={() => {
        dispatch(handlePublishModal());
        formik.resetForm();
      }}
      style={{width: '600px'}}>
      <form onSubmit={formik.handleSubmit}>
        <ModalTitle
          id="modal-title"
          style={{
            display: 'block',
            backgroundColor: 'white',
            padding: '10px 24px',
          }}>
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text type="h2">Publish Form</Text>
            <IconButton
              id="close-icon"
              style={{padding: 0}}
              onClick={() => {
                dispatch(handlePublishModal());
                formik.resetForm();
              }}>
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{paddingTop: '6px'}}>
            <Divider />
          </div>
        </ModalTitle>
        <ModalContent
          style={{
            // display: 'flex',
            // justifyContent: 'center',
            padding: '24px',
            paddingBottom: '16px',
          }}
          id="modal-content">
          <div>
            <Text className="modal-info">
              Publishing a form allows you to share the form with others and
              receive responses.
            </Text>
          </div>
          {/* <Grid
            container
            rowGap={2}
            spacing={2}
            display="flex"
            flexDirection="row">
            <Grid item xs={12}> */}
          {/* <InputLabel>Link</InputLabel> */}
          <TextField
            required
            label="Link"
            placeholder="Link"
            name="link"
            id="link"
            size="large"
            style={{color: 'black', marginBottom: '16px'}}
            width="100%"
            // onChange={formik.handleChange}
            disabled
            value={`${BASE_DYNAMO_FORM_URL}/${uniqueId?.slice(0, 8)}`}
          />
          {/* <InputLabel style={{marginTop: '10px'}}>
            Share Settings <span style={{color: 'red'}}>*</span>
          </InputLabel> */}
          <Select
            required
            label="Share Settings"
            style={{color: 'black', width: '100%', marginBottom: '16px'}}
            name="shareSettings"
            onChange={e => formik.setFieldValue('shareSettings', e)}
            value={formik?.values?.shareSettings}>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </Select>
          {/* <InputLabel style={{marginTop: '10px'}}>
            Version <span style={{color: 'red'}}>*</span>
          </InputLabel> */}
          <TextField
            label="Version"
            required
            placeholder="Form Version"
            name="version"
            id="version"
            size="large"
            style={{color: 'black', marginBottom: '12px'}}
            width="100%"
            onChange={formik.handleChange}
          />
          {formik.errors?.version && (
            <Text className={classes.error}>{formik.errors?.version}</Text>
          )}
          {/* </Grid>
          </Grid> */}
        </ModalContent>
        <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
          <Button
            // icon={<span className="material-symbols-outlined">close</span>}
            // iconPosition="start"
            className={classes.canelButton}
            variant="outlined"
            color="secondary"
            id="cancel-btn"
            onClick={() => {
              dispatch(handlePublishModal());
              formik.resetForm();
            }}
            style={{marginRight: '15px', fontSize: '16px'}}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            // icon={<span className="material-symbols-outlined">publish</span>}
            // iconPosition="start"
            type="submit"
            style={{fontSize: '16px'}}
            id="submit-btn">
            Publish
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
};

export default PublishModal;

const useStyles = makeStyles(theme => ({
  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '13px !important',
    fontFamily: 'Roboto,sans-serif !important',
  },
  notchedOutline: {
    borderWidth: '1px !important',
    borderColor: '#d7d7d7 !important',
    color: '#333333 !important',
  },
  floatingLabelFocusStyle: {
    color: '#333333 !important',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
  canelButton: {
    minWidth: 'auto',
  },
}));
