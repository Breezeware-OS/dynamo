package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.service;

import java.io.IOException;
import java.time.DateTimeException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.querydsl.core.BooleanBuilder;

import net.breezeware.dynamo.aws.s3.exception.DynamoS3Exception;
import net.breezeware.dynamo.aws.s3.service.api.S3Service;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.dto.PdfDocument;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.entity.Application;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.entity.QApplication;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.enumeration.ApplicationStatus;
import net.breezeware.dynamo.showcaseapp.workflow.processmanagement.showcaseprocess.service.ShowcaseProcessService;
import net.breezeware.dynamo.usermanagement.entity.User;
import net.breezeware.dynamo.usermanagement.service.UserService;
import net.breezeware.dynamo.utils.exception.DynamoException;
import net.breezeware.dynamo.workflow.dto.ProcessTaskData;
import net.breezeware.dynamo.workflow.dto.TaskDto;
import net.breezeware.dynamo.workflow.dto.TaskForm;
import net.breezeware.dynamo.workflow.entity.ProcessDomainEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class DynamoShowcaseWorkflowService {

    public static final String APPROVAL_STATUS = "approvalStatus";
    public static final String ENTITY_NAME_APPLICATION = "application";
    public static final String PROPERTY_CONSENT_DOCUMENT_1 = "consentDocument1";
    public static final String PROPERTY_CONSENT_DOCUMENT_2 = "consentDocument2";
    private static final Set<String> DEFAULT_VALID_PARAMETERS = Set.of("page-no", "page-size", "sort", "search");
    private final ShowcaseProcessService showcaseProcessService;
    private final ApplicationService applicationService;
    private final ObjectMapper objectMapper;
    private final S3Service awsS3Service;
    private final UserService userService;
    @Value("${aws.s3-bucket}")
    private String awsS3Bucket;

    public Page<Application> retrieveApplicationsForApplicant(MultiValueMap<String, String> searchOrFilterParameters,
            Pageable pageable) {
        log.info("Entering retrieveApplications() {}", pageable);
        // Validate query parameters
        Set<String> validParameters = new HashSet<>(DEFAULT_VALID_PARAMETERS);
        validParameters.add("user-id");
        validParameters.add("application-id");
        validParameters.add("application-from-date");
        validParameters.add("application-to-date");
        validParameters.add("status");
        validateParameters(validParameters, searchOrFilterParameters.keySet());

        // Validate sort criteria
        validateSortCriteria(searchOrFilterParameters.getFirst("sort"));
        String userId = searchOrFilterParameters.getFirst("user-id");
        if (Objects.isNull(userId) || userId.isBlank() || userId.length() != 36) {
            throw new DynamoException("User identifier must not be null or empty.", HttpStatus.BAD_REQUEST);
        }

        // Build a predicate for search or filter criteria
        BooleanBuilder booleanBuilder = buildSearchOrFilterPredicateForApplications(searchOrFilterParameters);
        // Retrieve a paginated list of application entities with the predicate
        Page<Application> applications = applicationService.retrievePageEntitiesWithPredicate(booleanBuilder, pageable);
        log.info("Leaving retrieveApplications()");
        return applications;
    }

    /**
     * Validates that the actual parameters are among the allowed parameters.
     * @param  allowedParameters A Set of allowed parameter names.
     * @param  actualParameters  A Set of actual parameter names.
     * @throws DynamoException   if unknown parameters are found.
     */
    private void validateParameters(Set<String> allowedParameters, Set<String> actualParameters)
            throws DynamoException {
        log.info("Entering validateParameters()");
        List<String> invalidParameters =
                actualParameters.stream().filter(param -> !allowedParameters.contains(param)).toList();
        if (!invalidParameters.isEmpty()) {
            log.error("Parameter(s) {} not supported!", invalidParameters);
            throw new DynamoException("Unknown parameter(s) %s found".formatted(invalidParameters),
                    HttpStatus.BAD_REQUEST);
        }

        log.info("Leaving validateParameters()");
    }

    /**
     * Validates the sort criteria.
     * @param  sortCriteria    the sort criteria to be validated.
     * @throws DynamoException if there is an error in the sort criteria.
     */
    void validateSortCriteria(String sortCriteria) {
        log.info("Entering validateSortCriteria()");
        if (Objects.nonNull(sortCriteria) && !sortCriteria.isBlank()) {
            String[] sortSplit = sortCriteria.split(",", 2);
            if (sortSplit.length != 2) {
                throw new DynamoException(
                        "Invalid sort criteria '%s'. Should be something like 'id,ASC' or 'id,asc'".formatted(
                                sortCriteria),
                        HttpStatus.BAD_REQUEST);
            }

            String sortBy = sortSplit[0].trim();
            String sortOrder = sortSplit[1].trim().toLowerCase();
            if (!sortOrder.equalsIgnoreCase("asc") && !sortOrder.equalsIgnoreCase("desc")) {
                throw new DynamoException("Invalid sort-order [%s] for sort-by [%s]".formatted(sortOrder, sortBy),
                        HttpStatus.BAD_REQUEST);
            }

        }

        log.info("Leaving validateSortCriteria()");

    }

    /**
     * Builds a BooleanBuilder predicate for searching or filtering application
     * based on the specified parameters.
     * @param  searchOrFilterParameters A MultiValueMap containing search or filter
     *                                  parameters.
     * @return                          A BooleanBuilder containing the constructed
     *                                  predicate.
     * @throws DynamoException          If an error occurs during predicate
     *                                  construction.
     */
    private BooleanBuilder buildSearchOrFilterPredicateForApplications(
            MultiValueMap<String, String> searchOrFilterParameters) throws DynamoException {
        log.info("Entering buildSearchOrFilterPredicateForApplications()");
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        QApplication application = QApplication.application;

        String userId = searchOrFilterParameters.getFirst("user-id");
        if (Objects.nonNull(userId) && !userId.isBlank() && userId.length() == 36) {
            log.info("Adding filter by user id predicate for value '{}'", userId);
            booleanBuilder.and(application.userId.eq(UUID.fromString(userId)));
        }

        String status = searchOrFilterParameters.getFirst("status");
        if (Objects.nonNull(status) && !status.isBlank()) {
            log.info("Adding filter by status predicate for value '{}'", status);
            ApplicationStatus applicationStatus = ApplicationStatus.getApplicationStatus(status);
            if (applicationStatus == null) {
                throw new DynamoException("Invalid application status %s".formatted(status),
                        HttpStatus.BAD_REQUEST);
            }

            switch (applicationStatus) {
                case COMPLETED -> booleanBuilder
                        .and(application.status.equalsIgnoreCase(ApplicationStatus.APPROVED.name()))
                        .or(application.status.equalsIgnoreCase(ApplicationStatus.DECLINED.name()));
                case IN_PROGRESS -> booleanBuilder
                        .and(application.status.notEqualsIgnoreCase(ApplicationStatus.APPROVED.name())
                                .and(application.status.notEqualsIgnoreCase(ApplicationStatus.DECLINED.name())));
                case ALL -> {
                    if (Objects.isNull(userId)) {
                        booleanBuilder
                                .and(application.status.notEqualsIgnoreCase(ApplicationStatus.IN_PROGRESS.name()));
                    }

                }

                default -> throw new DynamoException("Invalid application status %s".formatted(status),
                        HttpStatus.BAD_REQUEST);
            }

        }

        String applicationId = searchOrFilterParameters.getFirst("application-id");
        if (Objects.nonNull(applicationId) && !applicationId.isBlank()) {
            log.info("Adding filter by application id predicate for value '{}'", applicationId);
            booleanBuilder.and(application.id.eq(Long.valueOf(applicationId)));
        }

        String applicationFromDateValue = searchOrFilterParameters.getFirst("application-from-date");
        if (Objects.nonNull(applicationFromDateValue) && !applicationFromDateValue.isBlank()) {

            try {
                Instant applicationFromDate = Instant.parse(applicationFromDateValue).truncatedTo(ChronoUnit.DAYS);
                booleanBuilder.and(application.createdOn.after(applicationFromDate));
            } catch (DateTimeException e) {
                log.error("Error processing application from date: {}", applicationFromDateValue);
                throw new IllegalArgumentException(e.getMessage());
            }

        }

        String applicationToDateValue = searchOrFilterParameters.getFirst("application-to-date");
        if (Objects.nonNull(applicationToDateValue) && !applicationToDateValue.isBlank()) {
            try {
                Instant applicationToDate =
                        Instant.parse(applicationToDateValue).plus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
                booleanBuilder.and(application.createdOn.before(applicationToDate));
            } catch (DateTimeException e) {
                log.error("Error processing application to date: {}", applicationToDateValue);
                throw new IllegalArgumentException(e.getMessage());
            }

        }

        log.info("Leaving buildSearchOrFilterPredicateForApplications()");
        return booleanBuilder;
    }

    public Map<String, Long> retrieveApplicationStatusCount(UUID userId) {
        log.info("Entering retrieveApplicationStatusCount()");
        QApplication application = QApplication.application;
        if (Objects.isNull(userId)) {
            throw new DynamoException("User identifier must not be null or empty.", HttpStatus.BAD_REQUEST);
        }

        BooleanBuilder userBooleanBuilder = new BooleanBuilder();
        userBooleanBuilder.and(application.userId.eq(userId));

        // Execute queries to get status counts
        BooleanBuilder inProgressCountBb = new BooleanBuilder(userBooleanBuilder);
        inProgressCountBb.and(application.status.notEqualsIgnoreCase(ApplicationStatus.APPROVED.name())
                .and(application.status.notEqualsIgnoreCase(ApplicationStatus.DECLINED.name())));
        long inProgressCount = applicationService.retrieveUserApplicationStatusCount(inProgressCountBb);

        BooleanBuilder completedCountBb = new BooleanBuilder(userBooleanBuilder);
        completedCountBb.and(application.status.equalsIgnoreCase(ApplicationStatus.APPROVED.name())
                .or(application.status.equalsIgnoreCase(ApplicationStatus.DECLINED.name())));
        long completedCount = applicationService.retrieveUserApplicationStatusCount(completedCountBb);

        long allStatusCount = inProgressCount + completedCount;

        // Create and populate the status counts map
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put(ApplicationStatus.IN_PROGRESS.name().toLowerCase(), inProgressCount);
        statusCounts.put(ApplicationStatus.COMPLETED.name().toLowerCase(), completedCount);
        statusCounts.put(ApplicationStatus.ALL.name().toLowerCase(), allStatusCount);

        log.info("Leaving retrieveApplicationStatusCount()");
        return statusCounts;
    }

    /**
     * Starts the application process and returns the newly started application.
     * @return started application object.
     */
    @Transactional
    public Application startApplication(UUID userId) {
        log.info("Entering startApplication() for User ID {}", userId);
        // create a process instance
        String applicationId = showcaseProcessService.startProcess();
        Application application = new Application();
        application.setUserId(userId);
        application.setApplicationId(applicationId);
        application.setStatus(ApplicationStatus.IN_PROGRESS.name());
        applicationService.create(application);
        log.info("Leaving startApplication()");
        return application;
    }

    /**
     * Retrieves information for submitting an application.
     * @param  applicationId The ID of the application
     * @return               ProcessTaskData related to the submission process
     */
    public ProcessTaskData retrieveInfoForSubmitApplication(String applicationId) {
        log.info("Entering retrieveInfoForSubmitApplication(). Application ID = {}", applicationId);
        // retrieve Application entity from DB
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        String taskDefinitionId = getTaskDefinitionId("submit-application");
        ProcessTaskData processTask =
                showcaseProcessService.retrieveProcessTaskData(application.getApplicationId(), taskDefinitionId);
        log.info("Leaving retrieveInfoForSubmitApplication()");
        return processTask;
    }

    /**
     * Retrieves the task definition ID based on a given value by searching through
     * the list of process tasks.
     * @param  value           The value to match and retrieve the associated task
     *                         definition ID
     * @return                 The task definition ID corresponding to the provided
     *                         value
     * @throws DynamoException if the task definition ID is not found in the list of
     *                         process tasks
     */
    private String getTaskDefinitionId(String value) {
        List<String> processTasks = showcaseProcessService.getProcessTaskDefinitionIds();
        String taskDefinitionId =
                processTasks.stream().filter(taskDefinition -> taskDefinition.equalsIgnoreCase(value)).findFirst()
                        .orElseThrow(() -> new DynamoException("Task definition id not found.", HttpStatus.NOT_FOUND));
        return taskDefinitionId;
    }

    /**
     * Completes the submission process for an application.
     * @param applicationId The ID of the application
     * @param taskForm      The form data related to the submission task
     */
    public void completeSubmitApplication(String applicationId, TaskForm taskForm) {
        log.info("Entering completeSubmitApplication(). Application ID = {}", applicationId);
        // retrieve Application entity from DB
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        showcaseProcessService.completeProcessTask(taskForm);
        application.setStatus(ApplicationStatus.APPLICATION_SUBMITTED.name());
        applicationService.update(application);
        log.info("Leaving completeSubmitApplication()");
    }

    /**
     * Retrieves information for reviewing a submitted application.
     * @param  applicationId The ID of the application
     * @return               ProcessTaskData related to the review process
     */
    public ProcessTaskData retrieveInfoForReviewSubmitApplication(String applicationId) {
        log.info("Entering retrieveInfoForReviewSubmitApplication()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        String taskDefinitionId = getTaskDefinitionId("review-application");
        ProcessTaskData processTask =
                showcaseProcessService.retrieveProcessTaskData(application.getApplicationId(), taskDefinitionId);
        log.info("Leaving retrieveInfoForReviewSubmitApplication() {}", processTask);
        return processTask;
    }

    /**
     * Completes the review of a submitted application.
     * @param applicationId The ID of the application being reviewed
     * @param taskForm      The form data associated with the review task
     */
    public void completeReviewSubmitApplication(String applicationId, TaskForm taskForm) {
        log.info("Entering completeReviewSubmitApplication()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        showcaseProcessService.completeProcessTask(taskForm);
        application.setStatus(ApplicationStatus.APPLICATION_REVIEWED.name());
        applicationService.update(application);
        log.info("Leaving completeReviewSubmitApplication()");
    }

    /**
     * Resumes an application's process by retrieving its current active tasks.
     * @param  applicationId The ID of the application to be resumed
     * @return               ProcessTaskData representing the current task data of
     *                       the application
     */
    public ProcessTaskData resumeApplication(String applicationId) {
        log.info("Entering resumeApplication()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        List<TaskDto> currentActiveTasks = showcaseProcessService.retrieveCurrentActiveTasks(applicationId);
        if (currentActiveTasks.isEmpty()) {
            throw new DynamoException("Task Definition not found", HttpStatus.NOT_FOUND);
        }

        TaskDto taskDto = currentActiveTasks.get(0);
        String taskDefinitionKey = taskDto.getTask().getTaskDefinitionKey();
        ProcessTaskData processTask =
                showcaseProcessService.retrieveProcessTaskData(application.getApplicationId(), taskDefinitionKey);
        log.info("Leaving resumeApplication()");
        return processTask;
    }

    /**
     * Retrieves information for Docusign consent for a specific application.
     * @param  applicationId The ID of the application for Docusign consent
     * @return               ProcessTaskData related to Docusign consent for the
     *                       application
     */
    public ProcessTaskData retrieveInfoForDocusignConsent(String applicationId) {
        log.info("Entering retrieveInfoForDocusignConsent()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        String taskDefinitionId = getTaskDefinitionId("docusign-consent-document");
        ProcessTaskData processTask =
                showcaseProcessService.retrieveProcessTaskData(application.getApplicationId(), taskDefinitionId);
        log.info("Leaving retrieveInfoForDocusignConsent() {}", processTask);
        return processTask;
    }

    /**
     * Completes the Docusign consent process for an application.
     * @param applicationId The ID of the application for Docusign consent
     *                      completion
     * @param taskForm      The form data associated with the Docusign consent task
     */
    public void completeDocusignConsent(String applicationId, TaskForm taskForm) {
        log.info("Entering completeDocusignConsent()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        showcaseProcessService.completeProcessTask(taskForm);
        application.setStatus(ApplicationStatus.DOCUMENT_UPLOADED.name());
        applicationService.update(application);
        log.info("Leaving completeDocusignConsent()");
    }

    /**
     * Retrieves information for uploading consent documents for an application.
     * @param  applicationId The ID of the application for uploading consent
     *                       documents
     * @return               ProcessTaskData related to uploading consent documents
     *                       for the application
     */
    public ProcessTaskData retrieveInfoForUploadDocumentConsent(String applicationId) {
        log.info("Entering retrieveInfoForUploadDocumentConsent()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        String taskDefinitionId = getTaskDefinitionId("upload-consent-document");
        ProcessTaskData processTask =
                showcaseProcessService.retrieveProcessTaskData(application.getApplicationId(), taskDefinitionId);
        processTask.setContextData(new HashMap<>());
        log.info("Leaving retrieveInfoForUploadDocumentConsent() {}", processTask);
        return processTask;
    }

    /**
     * Completes the upload of consent documents for an application.
     * @param applicationId The ID of the application for consent document upload
     * @param taskForm      The form data associated with the consent document
     *                      upload task
     */
    public void completeUploadDocumentConsent(String applicationId, TaskForm taskForm) {
        log.info("Entering completeUploadDocumentConsent()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        showcaseProcessService.completeProcessTask(taskForm);
        application.setStatus(ApplicationStatus.DOCUMENT_UPLOADED.name());
        applicationService.update(application);
        log.info("Leaving completeUploadDocumentConsent()");
    }

    /**
     * Retrieves information to approve consent document submissions for an
     * application.
     * @param  applicationId The ID of the application for approving consent
     *                       document submission
     * @return               ProcessTaskData related to approving consent document
     *                       submission for the application
     */
    public ProcessTaskData retrieveInfoForApproveConsentDocumentSubmission(String applicationId) {
        log.info("Entering retrieveInfoForApproveConsentDocumentSubmission()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        String taskDefinitionId = getTaskDefinitionId("approve-consent-document-submission");
        ProcessTaskData processTask =
                showcaseProcessService.retrieveProcessTaskData(application.getApplicationId(), taskDefinitionId);
        ProcessDomainEntity processDomainEntity = processTask.getContextData().get(ENTITY_NAME_APPLICATION);
        // Get documents JsonNodes and set into new jsonNode.
        JsonNode consentDocument1 = processDomainEntity.getEntityProperties().get(PROPERTY_CONSENT_DOCUMENT_1);
        JsonNode consentDocument2 = processDomainEntity.getEntityProperties().get(PROPERTY_CONSENT_DOCUMENT_2);
        ObjectNode combinedConsentDocuments = objectMapper.createObjectNode();
        combinedConsentDocuments.set(PROPERTY_CONSENT_DOCUMENT_1, consentDocument1);
        combinedConsentDocuments.set(PROPERTY_CONSENT_DOCUMENT_2, consentDocument2);
        processDomainEntity.setEntityProperties(combinedConsentDocuments);
        HashMap<String, ProcessDomainEntity> processDomainEntityHashMap = new HashMap<>();
        processDomainEntityHashMap.put(ENTITY_NAME_APPLICATION, processDomainEntity);
        processTask.setContextData(processDomainEntityHashMap);
        log.info("Leaving retrieveInfoForApproveConsentDocumentSubmission() {}");
        return processTask;
    }

    /**
     * Handles the approval of a consent document submission.
     * @param applicationId The ID of the application
     * @param taskForm      Task form containing document submission data
     */
    public void handleConsentDocumentSubmissionApproval(String applicationId, TaskForm taskForm) {
        log.info("Entering handleConsentDocumentSubmissionApproval()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));
        showcaseProcessService.completeProcessTask(taskForm);
        updateApplicationCompleteStatus(taskForm, application);
        log.info("Leaving handleConsentDocumentSubmissionApproval()");
    }

    /**
     * Uploads a document for a specific application.
     * @param  applicationId The ID of the application
     * @param  multipartFile The document file to be uploaded
     * @return               Document key after successful upload
     */
    @Transactional
    public String uploadDocument(String applicationId, MultipartFile multipartFile) {
        log.info("Entering uploadDocument()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application Not Found.", HttpStatus.NOT_FOUND));

        if (multipartFile.isEmpty()) {
            throw new DynamoException("Upload document is missing.", HttpStatus.BAD_REQUEST);
        }

        try {
            String documentKey =
                    "files/applications/" + application.getId() + "/" + multipartFile.getOriginalFilename();
            awsS3Service.uploadObject(awsS3Bucket, documentKey, multipartFile.getBytes());
            log.info("Leaving uploadDocument()");
            return documentKey;
        } catch (DynamoS3Exception | IOException e) {
            throw new DynamoException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Downloads a document using its document key.
     * @param  documentKey The key associated with the document to be downloaded
     * @return             PdfDocument containing the downloaded document's byte
     *                     array and name
     */
    @Transactional
    public PdfDocument downloadDocument(String documentKey) {
        log.info("Entering downloadDocument()");
        try {
            byte[] bytes = awsS3Service.downloadObject(awsS3Bucket, documentKey);
            int index = documentKey.lastIndexOf('/');
            log.info("Leaving downloadDocument()");
            return PdfDocument.builder().documentByteArray(bytes).documentName(documentKey.substring(index + 1))
                    .build();
        } catch (DynamoS3Exception e) {
            throw new DynamoException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Updates the application's completion status based on the approval status from
     * the form.
     * @param taskForm    The form containing approval status data
     * @param application The application to be updated
     */
    private void updateApplicationCompleteStatus(TaskForm taskForm, Application application) {
        log.info("Entering updateApplicationCompleteStatus()");
        try {
            JsonNode jsonNode = objectMapper.readTree(taskForm.getFormSchemaAndDataJson());
            JsonNode components = jsonNode.get("components");
            for (JsonNode component : components) {
                JsonNode jsonNodeKey = component.get("key");
                JsonNode jsonNodeValue = component.get("value");
                if (jsonNodeKey != null && jsonNodeValue != null) {
                    String keyPrefixLastIndexValue = getKeyPrefixLastIndexValue(jsonNodeKey.asText());
                    if (keyPrefixLastIndexValue != null && keyPrefixLastIndexValue.equalsIgnoreCase(APPROVAL_STATUS)) {
                        String value = jsonNodeValue.asText();
                        application.setStatus(value.toUpperCase());
                        applicationService.update(application);
                        log.info("Leaving updateApplicationCompleteStatus()");
                    }

                }

            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }

    /**
     * Extracts the last part of a string after the last occurrence of a period(.).
     * @param  key The string from which to extract the last part after the last
     *             period
     * @return     The substring after the last period in the key, or null if no
     *             period is found
     */
    private String getKeyPrefixLastIndexValue(String key) {
        log.info("Entering getKeyPrefixLastIndexValue()");
        int lastIndex = key.lastIndexOf('.');
        if (lastIndex != -1) {
            log.info("Leaving getKeyPrefixLastIndexValue()");
            return key.substring(lastIndex + 1);
        }

        return null;
    }

    /**
     * Retrieves a paginated list of applications for a reviewer based on search or
     * filter parameters.
     * @param  searchOrFilterParameters Search or filter parameters for application
     *                                  retrieval
     * @param  pageable                 Pagination information
     * @return                          Paginated list of Application entities
     */
    public Page<Application> retrieveApplicationsForReviewer(MultiValueMap<String, String> searchOrFilterParameters,
            Pageable pageable) {
        log.info("Entering retrieveApplicationsForReviewer() {}", pageable);
        // Validate query parameters
        Set<String> validParameters = new HashSet<>(DEFAULT_VALID_PARAMETERS);
        validParameters.add("application-id");
        validParameters.add("application-from-date");
        validParameters.add("application-to-date");
        validParameters.add("status");
        validateParameters(validParameters, searchOrFilterParameters.keySet());

        // Validate sort criteria
        validateSortCriteria(searchOrFilterParameters.getFirst("sort"));

        // Build a predicate for search or filter criteria
        BooleanBuilder booleanBuilder = buildSearchOrFilterPredicateForApplications(searchOrFilterParameters);

        // Retrieve a paginated list of application entities with the predicate
        Page<Application> applications = applicationService.retrievePageEntitiesWithPredicate(booleanBuilder, pageable);
        applications.forEach(application -> {
            Optional<User> user = userService.retrieveUser(application.getUserId());
            user.ifPresent(
                    userDetail -> application.setUserName(userDetail.getFirstName() + " " + userDetail.getLastName()));
            if (application.getStatus().equalsIgnoreCase(ApplicationStatus.APPLICATION_SUBMITTED.name())) {
                application.setStatus(ApplicationStatus.APPLICATION_REVIEW.name());
            } else if (application.getStatus().equalsIgnoreCase(ApplicationStatus.DOCUMENT_UPLOADED.name())) {
                application.setStatus(ApplicationStatus.DOCUMENT_REVIEW.name());
            }

        });

        log.info("Leaving retrieveApplicationsForReviewer()");
        return applications;
    }

    /**
     * Retrieves application details for a applicant.
     * @param  applicationId The ID of the application
     * @return               ProcessDomainEntity representing application details
     */
    public ProcessDomainEntity viewApplicationDetails(String applicationId) {
        log.info("Entering viewApplicationDetails()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application not found.", HttpStatus.NOT_FOUND));
        log.info("Leaving viewApplicationDetails()");
        return showcaseProcessService.retrieveEntity(application.getApplicationId(), ENTITY_NAME_APPLICATION)
                .orElseGet(null);
    }

    /**
     * Retrieves application details for a reviewer as a map of entity names and
     * properties.
     * @param  applicationId The ID of the application
     * @return               Map containing entity names and their corresponding
     *                       properties
     */
    public Map<String, JsonNode> viewApplicationDetailsForReviewer(String applicationId) {
        log.info("Entering viewApplicationDetailsForReviewer()");
        Application application = applicationService.retrieveApplication(applicationId)
                .orElseThrow(() -> new DynamoException("Application not found.", HttpStatus.NOT_FOUND));
        List<ProcessDomainEntity> processDomainEntityList =
                showcaseProcessService.retrieveProcessDomainEntities(application.getApplicationId());
        HashMap<String, JsonNode> viewApplicationDataMap = new HashMap<>();
        processDomainEntityList.forEach(processDomainEntity -> viewApplicationDataMap
                .put(processDomainEntity.getEntityName(), processDomainEntity.getEntityProperties()));
        log.info("Leaving viewApplicationDetailsForReviewer()");
        return viewApplicationDataMap;
    }
}
