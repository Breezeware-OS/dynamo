import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BackendService from '../../../service/BackendService';

export const fetchReviewerWorkflowData = createAsyncThunk(
  '/applicantWorkflow',
  async data => {
    const response = await BackendService.fetchReviewerApplications(data);
    return response.data;
  },
);

export const fetchReviewerWorkflowCount = createAsyncThunk(
  '/applicantWorkflow/count',
  async data => {
    const response = await BackendService.fetchReviewerflowCount(data);
    return response.data;
  },
);

const reviewerWorkflowSlice = createSlice({
  name: 'ReviewerWorkflow',
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
      .addCase(fetchReviewerWorkflowData.pending, state => {
        state.status = 'loading';
        state.message = null;
        state.notification = false;
        state.error = false;
      })
      .addCase(fetchReviewerWorkflowData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = false;
        state.message = null;
        state.notification = false;
        state.workflowData = action.payload;
      })
      .addCase(fetchReviewerWorkflowData.rejected, state => {
        state.status = 'error';
        state.message =
          'An error occurred while fetching workflow data. Please try again.';
        state.notification = true;
        state.error = true;
      })
      .addCase(fetchReviewerWorkflowCount.pending, state => {
        state.status = 'loading';
        state.message = null;
        state.notification = false;
        state.error = false;
      })
      .addCase(fetchReviewerWorkflowCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = false;
        state.message = null;
        state.notification = false;
        state.workflowDataCount = action.payload;
        // console.log('fetchApplicantWorkflowCount.fulfilled', action.payload);
      })
      .addCase(fetchReviewerWorkflowCount.rejected, state => {
        state.status = 'error';
        state.message =
          'An error occurred while fetching workflow count. Please try again.';
        state.notification = true;
        state.error = true;
      });
  },
});

export const reviewerWorkflowActions = reviewerWorkflowSlice.actions;
export default reviewerWorkflowSlice;
