import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BackendService from '../../service/BackendService';

const ApplicantWorkflowForm = 'ApplicantWorkflowForm';
const FAILED = 'failed';
const LOADING = 'loading';

export const fetchWorkflowApplicantDetail = createAsyncThunk(
  `${ApplicantWorkflowForm}/detail`,
  async id => {
    const response = await BackendService.fetchWorkflowApplicantDetail(id);
    return response.data;
  },
);

export const fetchWorkflowApplicantForm = createAsyncThunk(
  `${ApplicantWorkflowForm}/form`,
  async id => {
    const response = await BackendService.fetchWorkflowApplicantForm(id);
    return response.data;
  },
);

export const completeWorkflowApplicantForm = createAsyncThunk(
  `${ApplicantWorkflowForm}/complete-form`,
  async data => {
    const response = await BackendService.completeWorkflowApplicantForm(data);
    return response.data;
  },
);

export const resumeWorkflowApplicantion = createAsyncThunk(
  `${ApplicantWorkflowForm}/resume-application`,
  async id => {
    const response = await BackendService.resumeWorkflowApplicantion(id);
    return response.data;
  },
);

const ApplicantWorkflowFormSlice = createSlice({
  name: ApplicantWorkflowForm,
  initialState: {
    formData: [],
    initialValue: null,
    applicantDetail: {},
    isStartApplication: false,
    notificationMessage: null, // message to be shown in notification
    notification: false, //to display or hide notification when any crud operation is done
    status: 'idle', //staus of api calls
    error: '',
  },
  reducers: {
    //updating initial values
    setStatus(state, action) {
      state.status = action.payload;
    },
    //closes popup notification after user invited successfully
    closeNotification: (state, action) => {
      state.notification = false;
    },
    handleIsStartApplication: (state, action) => {
      state.isStartApplication = action.payload;
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    setApplicantDetail(state, action) {
      state.applicantDetail = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorkflowApplicantDetail.pending, (state, action) => {
        state.status = LOADING;
      })
      .addCase(fetchWorkflowApplicantDetail.fulfilled, (state, action) => {
        state.applicantDetail = action.payload;
      })
      .addCase(fetchWorkflowApplicantDetail.rejected, (state, action) => {
        state.status = FAILED;
        state.notification = true;
        state.error = 'Failed To Fetch Form';
      })
      .addCase(fetchWorkflowApplicantForm.fulfilled, (state, action) => {
        state.status = 'idle';
        state.formData = action.payload;
      })
      .addCase(fetchWorkflowApplicantForm.rejected, (state, action) => {
        state.status = FAILED;
        state.notification = true;
        state.error = 'Failed To Fetch Form';
      })
      .addCase(completeWorkflowApplicantForm.pending, (state, action) => {
        state.status = LOADING;
      })
      .addCase(completeWorkflowApplicantForm.fulfilled, (state, action) => {
        state.applicantDetail = action.payload;
      })
      .addCase(completeWorkflowApplicantForm.rejected, (state, action) => {
        state.status = FAILED;
        state.notification = true;
        state.error = 'Failed To Complete Form';
      })

      .addCase(resumeWorkflowApplicantion.pending, (state, action) => {
        state.status = LOADING;
      })
      .addCase(resumeWorkflowApplicantion.fulfilled, (state, action) => {
        state.status = 'idle';
        state.formData = action.payload;
      })
      .addCase(resumeWorkflowApplicantion.rejected, (state, action) => {
        state.status = FAILED;
        state.notification = true;
        state.error = 'Failed To Fetch Form';
      });
  },
});

export const applicantWorkflowFormSliceActions =
  ApplicantWorkflowFormSlice.actions;

export default ApplicantWorkflowFormSlice.reducer;
