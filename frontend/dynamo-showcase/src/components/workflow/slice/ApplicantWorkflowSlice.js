import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BackendService from '../../../service/BackendService';

export const fetchApplicantWorkflowData = createAsyncThunk(
  '/applicantWorkflow',
  async data => {
    const response = await BackendService.fetchApplicantWorkflowData(data);
    return response.data;
  },
);

export const fetchApplicantWorkflowCount = createAsyncThunk(
  '/applicantWorkflow/count',
  async data => {
    const response = await BackendService.fetchApplicantWorkflowCount(data);
    return response.data;
  },
);

const applicantWorkflowSlice = createSlice({
  name: 'ApplicantWorkflow',
  initialState: {
    status: '',
    workflowData: [],
    workflowDataCount: null,
    message: '',
    error: false,
    notification: false,
  },
  reducers: {
    closeNotification(state) {
      state.notification = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchApplicantWorkflowData.pending, state => {
        state.status = 'loading';
        state.message = null;
        state.notification = false;
        state.error = false;
      })
      .addCase(fetchApplicantWorkflowData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = false;
        state.message = null;
        state.notification = false;
        state.workflowData = action.payload;
        // console.log('fetchApplicantWorkflowData.fulfilled', action.payload);
      })
      .addCase(fetchApplicantWorkflowData.rejected, state => {
        state.status = 'error';
        state.message =
          'An error occurred while fetching workflow data. Please try again.';
        state.notification = true;
        state.error = true;
      })
      .addCase(fetchApplicantWorkflowCount.pending, state => {
        state.status = 'loading';
        state.message = null;
        state.notification = false;
        state.error = false;
      })
      .addCase(fetchApplicantWorkflowCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = false;
        state.message = null;
        state.notification = false;
        state.workflowDataCount = action.payload;
        // console.log('fetchApplicantWorkflowCount.fulfilled', action.payload);
      })
      .addCase(fetchApplicantWorkflowCount.rejected, state => {
        state.status = 'error';
        state.message =
          'An error occurred while fetching workflow count. Please try again.';
        state.notification = true;
        state.error = true;
      });
  },
});

export const applicantWorkflowActions = applicantWorkflowSlice.actions;
export default applicantWorkflowSlice;
