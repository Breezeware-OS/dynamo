import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
  TextField,
} from 'glide-design-system';
import {useNavigate} from 'react-router-dom';
import {Alert, Divider, IconButton, Snackbar} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import CreateFormImage from '../../assets/icon/create_form.png';

export default function CreateFormModal({open, closeModal}) {
  const classes = useStyles();
  const navigate = useNavigate();

  const createFormSchema = Yup.object().shape({
    formTitle: Yup.string().required('Form Title is required.'),
  });

  //   const createFormHandler = () => {
  //     if (!formTitle) {
  //       setError('Form Title is required');
  //     } else {
  //       setFormTitle(null);
  //       console.log('createFormHandler formTitle', formTitle);
  //     }
  //   };

  const formik = useFormik({
    initialValues: {},
    validationSchema: createFormSchema,
    onSubmit: async values => {
      navigate(`/create-form/${values?.formTitle}`);
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Modal
          style={{width: '400px'}}
          open={open}
          onClose={() => {
            formik.resetForm();
            closeModal();
          }}
          id="modal">
          <ModalTitle
            id="modal-title"
            style={{
              backgroundColor: 'white',
              display: 'block',
              padding: '10px 24px',
              // borderBottom: '1px solid #d7d7d7',
            }}>
            <div
              style={{
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                // borderBottom: '1px solid #d7d7d7',
              }}>
              <Text type="h2" style={{color: '#999999'}}>
                Create New Form
              </Text>
              <IconButton
                onClick={() => {
                  formik.resetForm();
                  closeModal();
                }}
                size="small"
                style={{padding: 0}}
                id="close-icon">
                <CloseIcon sx={{color: '#999999'}} />
              </IconButton>
            </div>
            <div style={{paddingTop: '6px'}}>
              <Divider />
            </div>
          </ModalTitle>
          <ModalContent
            id="modal-content"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '16px 24px',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                //   alignItems: 'center',
              }}>
              <div>
                <Text className="modal-info">
                  Creating a new form is simple and intuitive, allowing users to
                  efficiently gather and organize information in a structured
                  format.
                </Text>
              </div>
              <TextField
                style={{color: 'black'}}
                required
                label="Form Title"
                placeholder="Enter form title here"
                name="formTitle"
                onChange={e =>
                  formik.setFieldValue('formTitle', e.target.value)
                }
                value={formik.values.formTitle}
              />
              {formik.errors?.formTitle && (
                <Text className={classes.error}>
                  {formik.errors?.formTitle}
                </Text>
              )}
            </div>
          </ModalContent>
          <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
            <Button
              // icon={<span class="material-symbols-outlined">close</span>}
              // iconPosition="start"
              className={classes.canelButton}
              color="secondary"
              variant="outlined"
              onClick={closeModal}
              id="cancel-btn"
              style={{
                marginRight: '15px',
                fontSize: '16px',
                borderColor: '#d7d7d7',
                color: '#999999',
              }}>
              Cancel
            </Button>
            <Button
              // icon={<span class="material-symbols-outlined">check</span>}
              // iconPosition="start"
              className={classes.button}
              style={{fontSize: '16px'}}
              id="submit-btn">
              Create
            </Button>
          </ModalActions>
        </Modal>
      </form>
    </>
  );
}

const useStyles = makeStyles(theme => ({
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
  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '13px !important',
    fontWeight: '400 !important',
  },
}));
