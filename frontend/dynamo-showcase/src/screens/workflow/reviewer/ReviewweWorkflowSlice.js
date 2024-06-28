import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import BackendService from '../../../service/BackendService';

const ReviewerWorkflowForm = 'ReviewerWorkflowForm';
const FAILED = 'failed';
const LOADING = 'loading';

export const fetchWorkflowReviewerDetail = createAsyncThunk(
  `${ReviewerWorkflowForm}/detail`,
  async id => {
    const response = await BackendService.fetchWorkflowApplicantDetail(id);
    return response.data;
  },
);

export const fetchWorkflowReviewerForm = createAsyncThunk(
  `${ReviewerWorkflowForm}/form`,
  async id => {
    const response = await BackendService.fetchWorkflowApplicantForm(id);
    return response.data;
  },
);

export const completeWorkflowReviewerForm = createAsyncThunk(
  `${ReviewerWorkflowForm}/complete-form`,
  async data => {
    const response = await BackendService.completeWorkflowApplicantForm(data);
    return response.data;
  },
);

export const resumeWorkflowApplicantion = createAsyncThunk(
  `${ReviewerWorkflowForm}/resume-application`,
  async id => {
    const response = await BackendService.resumeWorkflowApplicantion(id);
    return response.data;
  },
);

const ReviewerWorkflowFormSlice = createSlice({
  name: ReviewerWorkflowForm,
  initialState: {
    formData: [],
    initialValue: null,
    reviewerDetail: {},
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
    setReviewerDetail(state, action) {
      state.reviewerDetail = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorkflowReviewerDetail.pending, (state, action) => {
        state.status = LOADING;
      })
      .addCase(fetchWorkflowReviewerDetail.fulfilled, (state, action) => {
        state.applicantDetail = action.payload;
      })
      .addCase(fetchWorkflowReviewerDetail.rejected, (state, action) => {
        state.status = FAILED;
        state.notification = true;
        state.error = 'Failed To Fetch Form';
      })
      .addCase(fetchWorkflowReviewerForm.fulfilled, (state, action) => {
        state.status = 'idle';
        state.formData = action.payload;
      })
      .addCase(fetchWorkflowReviewerForm.rejected, (state, action) => {
        state.status = FAILED;
        state.notification = true;
        state.error = 'Failed To Fetch Form';
      })
      .addCase(completeWorkflowReviewerForm.pending, (state, action) => {
        state.status = LOADING;
      })
      .addCase(completeWorkflowReviewerForm.fulfilled, (state, action) => {
        state.applicantDetail = action.payload;
      })
      .addCase(completeWorkflowReviewerForm.rejected, (state, action) => {
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

export const reviewerWorkflowFormSliceActions =
  ReviewerWorkflowFormSlice.actions;

export default ReviewerWorkflowFormSlice.reducer;
