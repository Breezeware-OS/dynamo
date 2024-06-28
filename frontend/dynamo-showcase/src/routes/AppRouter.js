import React, {useEffect, useState} from 'react';
import ReactGA from 'react-ga4';
import {Route, Routes, BrowserRouter, useNavigate} from 'react-router-dom';
import Home from '../screens/users/Home';
import Appbar from '../components/appbar/Appbar';
import ApplicantWorkflowList from '../screens/workflow/ApplicantWorkflowList';
import StartApplicantWorkflow from '../screens/workflow/StartApplicantWorkflow';
import ListForms from '../screens/forms/ListForms';
import AddForm from '../screens/forms/CreateForm';
import PreviewForm from '../features/forms/PreviewForm';
import EditFormScreen from '../screens/forms/EditFormScreen';
import ReviewerWorkFlowList from '../screens/workflow/reviewer/ReviewerWorkFlowList';
import ReviewApplication from '../screens/workflow/reviewer/ReviewApplication';
import ViewForm from '../features/forms/ViewForm';
import FormSubmissionFeedback from '../features/forms/FormSubmissionFeedback';
import ReleaseNotes from '../components/releaseNotes/ReleaseNotes';
import Footer from '../components/footer/Footer';
import Layout from '../components/layout/Layout';
import FormUnauthorized from '../features/forms/FormUnauthorized';
import DocsHome from '../screens/docs/Home';
import DocsLayout from '../screens/docs/DocsLayout';
import Drafts from '../screens/docs/Drafts';
import Archive from '../screens/docs/Archive';
import Trash from '../screens/docs/Trash';
import DocumentView from '../screens/docs/DocumentView';
import CollectionView from '../screens/docs/CollectionView';
import CreateDocs from '../screens/docs/CreateDocs';
import EditDocs from '../screens/docs/EditDocs';
import HistoryView from '../screens/docs/HistoryView';
import AIHome from '../screens/AI/AIHome';
import TrainAIUploadDocuments from '../screens/AI/TrainAIUploadDocuments';
import TrainAIConfigureAndTest from '../screens/AI/TrainAIConfigureAndTest';
import TuneAIUploadDocuments from '../screens/AI/TuneAIUploadDocuments';
import TuneAIConfigureAndTest from '../screens/AI/TuneAIConfigureAndTest';
import TuneNavSideBar from '../components/AI/TuneNavSideBar';
import ViewModel from '../screens/AI/ViewModel';

const AppRouter = ({signOut, user}) => {
  const [formId, setFormId] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
    });

    const formId = localStorage.getItem('formId');
    if (formId) {
      localStorage.setItem('userEmail', user?.attributes?.email);
      setFormId(formId);
      navigate(`/${formId}`);
    }
  }, []);

  return (
    <>
      {window.location.pathname !== '/release-notes' &&
        window.location.pathname !== '/form/feedback' &&
        !formId && <Appbar signOut={signOut} user={user} />}{' '}
      <Routes>
        {formId && (
          <>
            <Route exact path="/:id" element={<ViewForm />} />
            <Route exact path="/form/:id" element={<ViewForm />} />
            <Route
              exact
              path="/form/feedback"
              element={<FormSubmissionFeedback />}
            />
          </>
        )}
        {!formId && (
          <>
            <Route exact path="/form/:id" element={<ViewForm />} />
            <Route
              exact
              path="/form/feedback"
              element={<FormSubmissionFeedback />}
            />
            <Route exact path="/*" element={<ListForms />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/users" element={<Home />} />
            <Route
              exact
              path="/applicant-workflow"
              element={<ApplicantWorkflowList user={user} />}
            />
            <Route
              exact
              path="/reviewer-workflow"
              element={<ReviewerWorkFlowList user={user} />}
            />
            <Route
              exact
              path="/start-workflow/:id/*"
              element={<StartApplicantWorkflow user={user} />}
            />
            <Route
              exact
              path="/review-workflow/:applicationId"
              element={<ReviewApplication user={user} />}
            />
            <Route
              exact
              path="/review-document-workflow/:applicationId"
              element={<ReviewApplication user={user} />}
            />
            <Route exact path="/forms" element={<ListForms user={user} />} />
            <Route
              exact
              path="/create-form"
              element={<AddForm user={user} />}
            />
            <Route
              exact
              path="/create-form/:name"
              element={<AddForm user={user} />}
            />
            <Route exact path="/view-form/:id" element={<PreviewForm />} />
            <Route exact path="/view-form" element={<PreviewForm />} />
            <Route
              exact
              path="/edit-form/:id"
              element={<EditFormScreen user={user} />}
            />
            <Route exact path="/unauthorized" element={<FormUnauthorized />} />
            <Route exact path="/release-notes" element={<ReleaseNotes />} />
            {/* Docs Route Start */}
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<DocsHome />} />
              <Route path="home" element={<DocsHome />} />
              <Route path="drafts" element={<Drafts />} />
              <Route path="archive" element={<Archive />} />
              <Route path="trash" element={<Trash />} />
              <Route path=":id" element={<DocumentView />} />
              <Route path="collection/:id" element={<CollectionView />} />
              <Route
                path="/docs/:id/history/:historyId"
                element={<HistoryView />}
              />
            </Route>
            <Route path="/docs/create/:id" element={<CreateDocs />} />
            <Route path="/docs/edit/:id" element={<EditDocs />} />
            {/* Docs Route End */}
            {/* AI Route Start */}
            <Route path="/AI/home" element={<AIHome />} />
            <Route
              path="/AI/train/:id/upload-document"
              element={<TrainAIUploadDocuments />}
            />
            <Route
              path="/AI/train/:id/configure-test"
              element={<TrainAIConfigureAndTest />}
            />
            {/* <Route path="/AI/tune/:id/" element={<TuneNavSideBar />}> */}
            <Route
              path="/AI/tune/:id/upload-document"
              element={<TuneAIUploadDocuments />}
            />
            <Route
              path="/AI/tune/:id/configure-test"
              element={<TuneAIConfigureAndTest />}
            />
            {/* </Route> */}
            <Route path="/AI/view-model/:id" element={<ViewModel />} />
            {/* AI Route End */}
          </>
        )}
      </Routes>
      {/* <Footer /> */}
    </>
  );
};

export default AppRouter;
