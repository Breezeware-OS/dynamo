import {createSlice} from '@reduxjs/toolkit';
import {logdebug} from '../../helpers/tracing';

const initialState = {
  error: '', // error message
  notification: false, // to display notification
  loading: false, // to display loader
  notificationMessage: null, // notification message to display
  publishModal: false,
  formData: null,
  deleteModal: false,
  versionsModal: false,
  discardModal: false,
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    // closes notification
    closeNotification: (state, action) => {
      state.notification = false;
    },
    //handle notification
    handleNotification: (state, action) => {
      // logdebug('Notifications', action.payload);
      state.notification = true;
      state.error = action.payload?.error;
      state.notificationMessage = action.payload?.notificationMessage;
    },

    handlePublishModal: (state, action) => {
      state.publishModal = !state.publishModal;
    },
    setFormData: (state, action) => {
      // logdebug('Set Form Data', action.payload);
      state.formData = action.payload;
    },
    handleDeleteModal: (state, action) => {
      state.deleteModal = !state.deleteModal;
    },
    handleFormVersionsModal: (state, action) => {
      state.versionsModal = !state.versionsModal;
    },
    handleDiscardModal: (state, action) => {
      state.discardModal = !state.discardModal;
    },
  },
});

export const message = state => state.forms.notificationMessage;
export const getNotificationStatus = state => state.forms.notification;
export const getFormsError = state => state.forms.error;
export const getFormData = state => state.forms.formData;
export const getPublishModalStatus = state => state.forms.publishModal;
export const getDeleteModalStatus = state => state.forms.deleteModal;
export const getVersionModalStatus = state => state.forms.versionsModal;
export const getDiscardModalStatus = state => state.forms.discardModal;

export const {
  closeNotification,
  handleNotification,
  handlePublishModal,
  setFormData,
  handleDeleteModal,
  handleFormVersionsModal,
  handleDiscardModal,
} = formSlice.actions;

export default formSlice.reducer;
