import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import usersReducer from '../features/users/userSlice';
import applicantWorkflowSlice from '../components/workflow/slice/ApplicantWorkflowSlice';
import formsReducer from '../features/forms/formSlice';
import ApplicantWorkflowFormSlice from '../screens/workflow/ApplicantWorkflowFormSlice';
import reviewerWorkflowSlice from '../components/workflow/reviewer/ReviewerWorkflowSlice';
import DocsSlice from '../screens/docs/DocsSlice';

const store = configureStore({
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  reducer: {
    users: usersReducer,
    applicantWorkflow: applicantWorkflowSlice.reducer,
    forms: formsReducer,
    applicantWorkflowForm: ApplicantWorkflowFormSlice,
    reviewerWorkflow: reviewerWorkflowSlice.reducer,
    docs: DocsSlice,
  },
});

export default store;
