import axios from 'axios';

const BASE_URL_DYNAMO = process.env.REACT_APP_DYNAMO_SERVICE_URL;
// const BASE_URL_DYNAMO = "http://192.168.29.164:8080/api"

class BackendService {
  /**
   * Retrieve welcome message from server
   * @returns Welcome message
   */
  welcome() {
    return axios.get(`${BASE_URL_DYNAMO}/dynamo`);
  }

  /**
   * retrirve list of users
   * @param {*} data filter options like search,pagination etc,.
   * @returns list of users with pagination
   */
  usersList(data) {
    // return axios.get(
    //   `${BASE_URL_DYNAMO}/service/user-management/users?email=${data?.search ? data?.search : ''
    //   }&role=${data?.role ? data?.role : ''}&page-no=${data?.pageNo ? data?.pageNo : 0
    //   }&page-size=${data?.size ? data?.size : 8}`,
    // );

    // return axios.get(
    //   `${BASE_URL_DYNAMO}/service/user-management/users?=${data?.search ? data?.search : ''
    //   }&role=${data?.role ? data?.role : ''}&page-no=${data?.pageNo ? data?.pageNo : 0
    //   }&page-size=${data?.size ? data?.size : 8}`,
    // );

    return axios.get(`${BASE_URL_DYNAMO}/service/user-management/users`, {
      params: {
        username: data?.search || '',
        role: data?.role || '',
        'page-no': data?.pageNo || 0,
        'page-size': data?.size || 8,
        status: data?.userStatus || '',
        'created-date': data?.date || '',
        sort:
          data?.sortItem && data?.sortOrder
            ? `${data.sortItem},${data.sortOrder.toUpperCase()}`
            : '',
      },
    });
  }

  /**
   * Invite user
   * @param {*} data user data
   * @returns user invited response
   */
  inviteUser(data) {
    return axios.post(
      `${BASE_URL_DYNAMO}/service/user-management/users/invite`,
      data,
    );
  }

  /**
   * Update existing user
   * @param {*} data user id,user updated data
   * @returns user updated response
   */
  editUser(data) {
    return axios.put(`${BASE_URL_DYNAMO}/service/user-management/users`, data);
  }

  /**
   * Suspend active user
   * @param {*} data user id
   * @returns user suspended response
   */
  suspendUser(data) {
    return axios.put(
      `${BASE_URL_DYNAMO}/service/user-management/users/${data?.userId}/suspend`,
    );
  }

  /**
   * Reacive suspended user
   * @param {*} data user id
   * @returns user reactivated response
   */
  reactivateUser(data) {
    return axios.put(
      `${BASE_URL_DYNAMO}/service/user-management/users/${data?.userId}/activate`,
    );
  }

  /**
   * Account setup for new user
   * @param {*} data user data
   * @returns account setup response
   */
  accountSetup(data) {
    return axios.post(
      `${BASE_URL_DYNAMO}/service/user-management/users/account-setup`,
      data,
    );
  }

  fetchApplicantWorkflowData(params) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications?user-id=${params.userId}`,
      {
        params: {
          sort: `${params.sortItem},${params.sortOrder}`,
          'page-size': '15',
          'page-no': params.page || '0',
          'application-id': params.searchText,
          'application-from-date': params?.filterFromDate,
          'application-to-date': params?.filterToDate,
          status: params?.status,
        },
      },
    );
  }

  fetchApplicantWorkflowCount(params) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/status-count/${params?.userId}`,
    );
  }

  /**
   * retrieve list of forms
   * @param {*} data filter options like search,pagination etc,.
   * @returns list of forms with pagination
   */
  retrieveListOfForms(data) {
    return axios.get(
      `${BASE_URL_DYNAMO}/forms?form-name=${
        data?.search ? data?.search : ''
      }&form-date=${data?.date}&sort=${data?.sortItem},${
        data?.sortOrder
      }&page-no=${data?.pageNo ? data?.pageNo : 0}&page-size=${
        data?.size ? data?.size : 8
      }&status=${data?.status}`,
    );
  }

  /**
   * retrieve list of form count
   * @returns list of forms with count
   */
  retrieveListOfFormCount() {
    return axios.get(`${BASE_URL_DYNAMO}/forms/status-count`);
  }

  /**
   * retrieve list of responses
   * @param {*} data filter options like search,pagination etc,.
   * @returns list of forms with pagination
   */
  retrieveListOfResponses(data) {
    return axios.get(
      `${BASE_URL_DYNAMO}/form-responses/forms/${
        data.id
      }/submissions?response-id=${
        data?.search ? data?.search : ''
      }&response-date=${data?.date}&sort=${data?.sortItem},${
        data?.sortOrder
      }&page-no=${data?.pageNo ? data?.pageNo : 0}&page-size=${
        data?.size ? data?.size : 8
      }`,
    );
  }

  deleteUserResponse(responseId) {
    return axios.delete(`${BASE_URL_DYNAMO}/form-responses/${responseId}`);
  }

  retrieveListUsersInvited(data) {
    return axios.get(
      `${BASE_URL_DYNAMO}/form-invitations/${data.id}?email=${
        data?.search ? data?.search : ''
      }&form-invitation-date=${data?.date}&sort=${data?.sortItem},${
        data?.sortOrder
      }&page-no=${data?.pageNo ? data?.pageNo : 0}&page-size=${
        data?.size ? data?.size : 8
      }`,
    );
  }

  inviteFormUser(data) {
    return axios.post(`${BASE_URL_DYNAMO}/form-invitations`, data);
  }

  getEmailList() {
    return axios.get(`${BASE_URL_DYNAMO}/form-invitations/email-list`);
  }

  deletUserInvite(id) {
    return axios.delete(`${BASE_URL_DYNAMO}/form-invitations/${id}`);
  }

  /**
   * saves form api
   * @param {*} data form data
   * @returns form saved response
   */
  saveForm(data) {
    return axios.post(`${BASE_URL_DYNAMO}/forms/draft`, data);
  }

  /**
   * publishes the form with version
   * @param {*} data form data
   * @returns form published response
   */
  publishForm(data) {
    return axios.post(`${BASE_URL_DYNAMO}/forms/publish`, data);
  }

  /**
   * archive the selected form
   * @param {*} data of selected form (id)
   * @returns response of form archived or not
   */
  archiveForm(data) {
    return axios.delete(`${BASE_URL_DYNAMO}/forms/${data?.id}`);
  }

  /**
   * retrieve list of form versions
   * @param {*} data of selected form
   * @returns list of  verions of selected form
   */
  retrieveListOfFormVersions(data) {
    return axios.get(
      `${BASE_URL_DYNAMO}/forms/${data?.id}/form-versions?version=${
        data?.search ? data?.search : ''
      }&sort=${data?.sortItem ? data?.sortItem + ',' : ''}${
        data?.sortOrder ? data?.sortOrder : ''
      }&page-no=${data?.pageNo ? data?.pageNo : 0}&page-size=${
        data?.size ? data?.size : 8
      }`,
    );
  }

  /**
   * retrieve data of form
   * @param {*} data of form (id)
   * @returns json of requested form
   */
  retrieveForm(data) {
    return axios.get(`${BASE_URL_DYNAMO}/forms/${data?.id}`);
  }

  /**
   * retrieve form to get user submission
   * @param {*} data of form/user (id)
   * @returns json of requested form
   */
  getFormForUser(id) {
    return axios.get(`${BASE_URL_DYNAMO}/forms/form?unique-id=${id}`);
  }

  /**
   * Saves user response
   * @param {*} data  user response
   */
  submitUserResponse(data) {
    return axios.post(`${BASE_URL_DYNAMO}/form-responses`, data);
  }

  fetchWorkflowApplicantDetail(id) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/start/${id}`,
    );
  }

  fetchWorkflowApplicantForm(id) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${id}/submit-application`,
    );
  }

  completeWorkflowApplicantForm(data) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${data?.id}/submit-application`,
      data?.taskForm,
    );
  }

  completeWorkflowApplicantDocument(data) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${data?.applicationId}/upload-document-consent`,
      data?.body,
    );
  }

  resumeWorkflowApplicantion(id) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${id}/resume-application`,
    );
  }

  fetchReviewerApplications(params) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/reviewer`,
      {
        params: {
          sort: `${params.sortItem},${params.sortOrder}`,
          'page-size': '15',
          'page-no': params.page || '0',
          'application-id': params.searchText,
          'application-from-date': params?.filterFromDate,
          'application-to-date': params?.filterToDate,
          status: params?.status,
        },
      },
    );
  }

  fetchReviewerflowCount(params) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/status-count/${params?.userId}`,
    );
  }

  fetchReviewApplicationData(params) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${params?.applicationId}/review-application`,
    );
  }

  fetchReviewApplicationDocumentData(params) {
    return axios.get(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${params?.applicationId}/review-consent-document`,
    );
  }

  submitReviewApplication(params) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${params?.applicationId}/review-application`,
      params.body,
    );
  }

  uploadFile(params) {
    return axios.put(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/document/upload?application-id=${params?.applicationId}`,
      params.body,
    );
  }

  submitDocument(params) {
    return axios.put(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${params.applicationId}/upload-document-consent`,
      params.body,
    );
  }

  reviewConsentDocument(params) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/document/download?document-key=${params.file}`,
    );
  }

  submitReviewConsentDocument(params) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/${params.applicationId}/review-consent-document`,
      params.body,
    );
  }

  downloadFile(params) {
    return axios.post(
      `${BASE_URL_DYNAMO}/dynamo/showcase-app/applications/document/download?document-key=${params.file}`,
      params.body,
    );
  }

  createCollection(data) {
    return axios.post(`${BASE_URL_DYNAMO}/collections`, data);
  }

  editCollection(data) {
    return axios.put(`${BASE_URL_DYNAMO}/collections`, data);
  }

  getCollections(searchValue) {
    return axios.get(`${BASE_URL_DYNAMO}/collections?search=${searchValue}`);
  }

  getDocuments(searchValue) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents?status=published&search=${searchValue}`,
    );
  }

  deleteDocument(id) {
    return axios.put(`${BASE_URL_DYNAMO}/documents/${id}/delete`);
  }

  archiveDocument(id) {
    return axios.put(`${BASE_URL_DYNAMO}/documents/${id}/archive`);
  }

  deleteCollections(id) {
    return axios.delete(`${BASE_URL_DYNAMO}/collections/${id}`);
  }

  getDraftDocuments(searchValue) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents?status=drafted&search=${searchValue}&paged=false`,
    );
  }

  getArchivedDocuments(searchValue) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents?status=archived&search=${searchValue}&paged=false`,
    );
  }

  downloadDocument(id) {
    return axios.get(`${BASE_URL_DYNAMO}/documents/${id}/download`);
  }

  uploadDocument(id, parentId, formaData) {
    return axios.post(
      `${BASE_URL_DYNAMO}/collections/${id}/documents/upload?parent-document-id=${parentId}`,
      formaData,
    );
  }

  permanentDeleteDocument(id) {
    return axios.put(
      `${BASE_URL_DYNAMO}/documents/${id}/delete?permanent=true`,
    );
  }

  getDeletedDocuments(searchValue) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents?status=deleted&search=${searchValue}&paged=false`,
    );
  }

  getIndivdualDocument(id) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents?status=&document-id=${id}&paged=false`,
    );
  }

  getCollection(id, searchValue) {
    return axios.get(
      `${BASE_URL_DYNAMO}/collections?collection-id=${id}&search=${searchValue}`,
    );
  }

  getCollectionsList() {
    return axios.get(`${BASE_URL_DYNAMO}/collections?fields=uniqueId,name`);
  }

  createDocument(data) {
    return axios.post(`${BASE_URL_DYNAMO}/documents`, data);
  }

  updateDocument(data) {
    return axios.put(`${BASE_URL_DYNAMO}/documents`, data);
  }

  publishDocument(data) {
    return axios.put(`${BASE_URL_DYNAMO}/documents/publish`, data);
  }

  editForkedOrPublishedDocument(id) {
    return axios.put(`${BASE_URL_DYNAMO}/documents/${id}/fork-check`, {});
  }

  getHistories(id, searchValue, searchDate) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents/${id}/revisions?revision-id=&username=${searchValue}&revision-date=${searchDate}`,
    );
  }

  getHistoryData(id, historyId) {
    return axios.get(
      `${BASE_URL_DYNAMO}/documents/${id}/revisions?revision-id=${historyId}`,
    );
  }

  getCurrentFormLabels(formId) {
    return axios.get(
      `${BASE_URL_DYNAMO}/form-responses/forms/${formId}/submission-labels`,
    );
  }

  /**
   *
   * @param {*} queries sorting,pagination,searching queries
   * @returns list of models created
   */
  getModels(queries) {
    return axios.get(
      `${BASE_URL_DYNAMO}/model?sort=${queries?.sortItem},${queries?.sortOrder}&page-no=${queries?.pageNo}&model-name=${queries?.searchModel}&model-created-date=${queries?.searchDate}&page-size=100`,
    );
  }

  /**
   * creates model
   * @param {*} data model-name
   */
  createModel(data) {
    return axios.post(`${BASE_URL_DYNAMO}/model`, data);
  }

  /**
   *
   * @param {*} queries sorting,pagination,searching queries
   * @returns uploaded documents file detail
   */
  getModelFiles(queries) {
    return axios.get(
      `${BASE_URL_DYNAMO}/model/${queries?.id}/knowledge-artifacts?sort=${queries?.sortItem},${queries?.sortOrder}&page-no=${queries?.pageNo}&knowledge-artifact-name=${queries?.searchFile}&knowledge-artifact-status=${queries?.status}&knowledge-artifact-created-date=${queries?.searchDate}&page-size=100`,
    );
  }

  /**
   * uploads document
   * @param {*} data uploaded documents in format of formdata
   * @param {*} id model id
   */
  uploadModelDocument(data, id) {
    return axios.post(
      `${BASE_URL_DYNAMO}/model/${id}/upload-knowledge-artifacts`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  /**
   * Deletes document
   * @param {*} data model id,documentId
   */
  deleteModelDocument(data) {
    return axios.delete(
      `${BASE_URL_DYNAMO}/model/${data?.id}/knowledge-artifacts/${data?.documentId}`,
    );
  }

  /**
   *
   * @param {*} id model id
   * @returns true or false whether the documents are uploaded or not in tune or train upload document screen
   */
  isDocumentsAvailable(id) {
    return axios.get(`${BASE_URL_DYNAMO}/model/${id}/is-documents-available`);
  }

  /**
   *
   * @param {*} id model id
   * @returns true or false whether the documents are embedded or not in tune or train configure and test screen
   */
  isDocumentsEmbedded(id) {
    return axios.get(
      `${BASE_URL_DYNAMO}/model/${id}/is-all-documents-embedded`,
    );
  }

  /**
   * embeds document for chatting with AI
   * @param {*} id model id
   */
  embedDocument(id) {
    return axios.put(
      `${BASE_URL_DYNAMO}/model/${id}/embed-knowledge-artifacts`,
      {},
    );
  }

  /**
   * complete or update training of the document in tune or train configure and test screen
   * @param {*} data systemPrompt,temperature,topK,topP
   * @param {*} id model id
   */
  completeTraining(data, id) {
    return axios.put(`${BASE_URL_DYNAMO}/model/${id}/complete-training`, data);
  }

  /**
   * test consversation in tune or train configure and test screen
   * @param {*} data systemPrompt,temperature,topK,topP,message
   * @param {*} id model id
   * @returns response for the message
   */
  testConversation(data, id) {
    return axios.post(`${BASE_URL_DYNAMO}/model/${id}/test-conversation`, data);
  }

  /**
   *
   * @param {*} id model id
   * @returns model details like name,systemPrompt,temperature,topK,topP
   */
  getModelDetails(id) {
    return axios.get(`${BASE_URL_DYNAMO}/model/${id}`);
  }

  /**
   * updating model name
   * @param {*} data model-name
   * @param {*} id model id
   */
  updateModelName(data, id) {
    return axios.patch(`${BASE_URL_DYNAMO}/model/${id}`, data);
  }

  /**
   *
   * @param {*} data chat message
   * @param {*} id model id
   * @returns response for the message
   */
  conversation(data, id) {
    return axios.post(`${BASE_URL_DYNAMO}/model/${id}/conversation`, data);
  }

  knowledgeArtifactsStatus(id) {
    return axios.get(
      `${BASE_URL_DYNAMO}/model/${id}/knowledge-artifacts-status`,
    );
  }
}

export default new BackendService();
