package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;

import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.dto.PdfDocument;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.entity.Application;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.service.DynamoShowcaseWorkflowService;
import net.breezeware.dynamo.utils.exception.DynamoException;
import net.breezeware.dynamo.utils.exception.ErrorResponse;
import net.breezeware.dynamo.workflow.dto.ProcessTaskData;
import net.breezeware.dynamo.workflow.dto.TaskForm;
import net.breezeware.dynamo.workflow.entity.ProcessDomainEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.enums.ParameterStyle;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dynamo/showcase-app/applications")
@Tag(name = "Dynamo Workflow")
@Slf4j
public class DynamoShowcaseWorkflowController {
    private final DynamoShowcaseWorkflowService dynamoShowcaseWorkflowService;

    @GetMapping("")
    @Operation(summary = "Retrieves applications.",
            description = "Retrieves applications for the provided user identifier.")
    @Parameters(value = {
        @Parameter(allowEmptyValue = true, required = false, name = "page-no", example = "0",
                description = "Represents the page number.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "page-size", example = "15",
                description = "Represents the page size.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "sort-by", example = "name",
                description = "Represents by which parameter is the sorting done.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "sort-order", example = "asc",
                description = "Represents sort order (i.e)ascending (or) descending.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "status", example = "completed",
                description = "Represents application's status.", in = ParameterIn.QUERY) })
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
                        {
                            "content": [
                                {
                                    "id": 1000,
                                    "createdOn": "2023-10-26T06:30:41.916184Z",
                                    "modifiedOn": "2023-10-26T06:30:41.916189Z",
                                    "applicationId": "473c3f74-92f8-46bf-b8ce-c10e4c85bd32",
                                    "userId": "95a36c31-8368-4674-b976-8213a82184b2",
                                    "status": "IN_PROGRESS"
                                }
                            ],
                            "pageable": {
                                "sort": {
                                    "empty": false,
                                    "sorted": true,
                                    "unsorted": false
                                },
                                "offset": 0,
                                "pageNumber": 0,
                                "pageSize": 12,
                                "paged": true,
                                "unpaged": false
                            },
                            "last": true,
                            "totalElements": 1,
                            "totalPages": 1,
                            "size": 12,
                            "number": 0,
                            "sort": {
                                "empty": false,
                                "sorted": true,
                                "unsorted": false
                            },
                            "first": true,
                            "numberOfElements": 1,
                            "empty": false
                        }
                        """))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                          "Invalid sort criteria 'id'. Should be something like
                                         'id,ASC' or 'id,asc'"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public Page<Application> retrieveApplicationsForApplicant(
            @Parameter(hidden = true, in = ParameterIn.QUERY, style = ParameterStyle.FORM)
            @SortDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> searchParameters) throws DynamoException {
        log.info("Entering retrieveApplicationsForApplicant(), pageable: {}, searchParameters: {}", pageable,
                searchParameters);
        Page<Application> applications =
                dynamoShowcaseWorkflowService.retrieveApplicationsForApplicant(searchParameters, pageable);
        log.info("Leaving retrieveApplicationsForApplicant()");
        return applications;
    }

    @GetMapping("/status-count/{user-id}")
    @Operation(summary = "Retrieves application status count.", description = "Retrieves application status count.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Success Payload",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = Map.class))),
                @ApiResponse(responseCode = "400", description = "Bad request",
                        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema = @Schema(implementation = ErrorResponse.class, example = """
                                        {
                                             "statusCode": 400,
                                             "message": "BAD_REQUEST",
                                             "details": [
                                                 "Invalid sort criteria 'chargePointName'. Should be something like
                                                 'name,ASC' or 'name,asc'"
                                             ]
                                         }
                                        """))),
                @ApiResponse(responseCode = "401", description = "Unauthorized request",
                        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema = @Schema(implementation = ErrorResponse.class, example = """
                                        {
                                            "statusCode": 401,
                                            "message": "UNAUTHORIZED",
                                            "details": [
                                                "Full authentication is required to access this resource"
                                            ]
                                        }"""))) })
    public Map<String, Long> retrieveApplicationStatusCount(@PathVariable("user-id") UUID userId) {
        log.info("Entering retrieveApplicationStatusCount()");
        Map<String, Long> statusCountList = dynamoShowcaseWorkflowService.retrieveApplicationStatusCount(userId);
        log.info("Leaving retrieveApplicationStatusCount()");
        return statusCountList;
    }

    @PostMapping("/start/{user-id}")
    @Operation(summary = "Start application.", description = "Start application for the provided user identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "user-id",
            example = "68db1bd5-f321-4d6d-bb81-be4a28df355d", description = "Represents user identifier",
            in = ParameterIn.QUERY)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = Application.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public Application startApplication(@PathVariable("user-id") UUID userId) {
        log.info("Entering startApplication()");
        Application application = dynamoShowcaseWorkflowService.startApplication(userId);
        log.info("Leaving startApplication()");
        return application;
    }

    @GetMapping("/{application-id}/submit-application")
    @Operation(summary = "Get submit application details.",
            description = "Get Submit application for the provided application identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessTaskData.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessTaskData retrieveInfoToSubmitApplication(@PathVariable("application-id") String applicationId) {
        log.info("Entering retrieveInfoToSubmitApplication()");
        ProcessTaskData processTaskDataDto =
                dynamoShowcaseWorkflowService.retrieveInfoForSubmitApplication(applicationId);
        log.info("Leaving retrieveInfoToSubmitApplication()");
        return processTaskDataDto;
    }

    @PostMapping("/{application-id}/submit-application")
    @Operation(summary = "Submit application.", description = "Submit application for the provided user identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = TaskForm.class)))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = Application.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public void submitApplication(@PathVariable("application-id") String applicationId,
            @RequestBody TaskForm taskForm) {
        log.info("Entering submitApplication() {}");
        dynamoShowcaseWorkflowService.completeSubmitApplication(applicationId, taskForm);
        log.info("Leaving submitApplication()");
    }

    @GetMapping("/{application-id}/review-application")
    @Operation(summary = "Get Review application details.",
            description = "Get Review application for the provided application identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessTaskData.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessTaskData retrieveInfoReviewApplication(@PathVariable("application-id") String applicationId) {
        log.info("Entering retrieveInfoReviewApplication()");
        ProcessTaskData processTaskDataDto =
                dynamoShowcaseWorkflowService.retrieveInfoForReviewSubmitApplication(applicationId);
        log.info("Leaving retrieveInfoReviewApplication()");
        return processTaskDataDto;
    }

    @PostMapping("/{application-id}/review-application")
    @Operation(summary = "Review application.", description = "Review application for the provided user identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = TaskForm.class)))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = Application.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public void reviewApplication(@PathVariable("application-id") String applicationId,
            @RequestBody TaskForm taskForm) {
        log.info("Entering reviewApplication()");
        dynamoShowcaseWorkflowService.completeReviewSubmitApplication(applicationId, taskForm);
        log.info("Leaving reviewApplication()");
    }

    @GetMapping("/{application-id}/resume-application")
    @Operation(summary = "Get application details for the resume application.",
            description = "Get resume application details for the provided application identifier.")
    @Parameter(allowEmptyValue = true, required = false, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessTaskData.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessTaskData resumeApplication(@PathVariable("application-id") String applicationId) {
        log.info("Entering resumeApplication()");
        ProcessTaskData processTaskDataDto = dynamoShowcaseWorkflowService.resumeApplication(applicationId);
        log.info("Leaving resumeApplication()");
        return processTaskDataDto;
    }

    @GetMapping("/{application-id}/docusign-consent")
    @Operation(summary = "Get docusign consent for the application details.",
            description = "Get docusign consent for the provided application identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessTaskData.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessTaskData retrieveInfoForDocusignConsent(@PathVariable("application-id") String applicationId) {
        log.info("Entering retrieveInfoForDocusignConsent()");
        ProcessTaskData processTaskDataDto =
                dynamoShowcaseWorkflowService.retrieveInfoForDocusignConsent(applicationId);
        log.info("Leaving retrieveInfoForDocusignConsent()");
        return processTaskDataDto;
    }

    @PostMapping("/{application-id}/docusign-consent")
    @Operation(summary = "Submit docusign consent for the application.",
            description = "Submit docusign consent for the provided user identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = TaskForm.class)))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = Application.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public void completeDocusignConsent(@PathVariable("application-id") String applicationId,
            @RequestBody TaskForm taskForm) {
        log.info("Entering completeDocusignConsent()");
        dynamoShowcaseWorkflowService.completeDocusignConsent(applicationId, taskForm);
        log.info("Leaving completeDocusignConsent()");
    }

    @GetMapping("/{application-id}/upload-document-consent")
    @Operation(summary = "Get upload document consent application details.",
            description = "Get upload document consent for the provided application identifier.")
    @Parameter(allowEmptyValue = true, required = false, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessTaskData.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessTaskData retrieveInfoForUploadDocumentConsent(@PathVariable("application-id") String applicationId) {
        log.info("Entering retrieveInfoForUploadDocumentConsent()");
        ProcessTaskData processTaskDataDto =
                dynamoShowcaseWorkflowService.retrieveInfoForUploadDocumentConsent(applicationId);
        log.info("Leaving retrieveInfoForUploadDocumentConsent()");
        return processTaskDataDto;
    }

    @PostMapping("/{application-id}/upload-document-consent")
    @Operation(summary = "Submit upload document consent for the application.",
            description = "Submit upload document consent for the provided user identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = TaskForm.class)))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = Application.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public void completeUploadDocumentConsent(@PathVariable("application-id") String applicationId,
            @RequestBody TaskForm taskForm) {
        log.info("Entering completeUploadDocumentConsent()");
        dynamoShowcaseWorkflowService.completeUploadDocumentConsent(applicationId, taskForm);
        log.info("Leaving completeUploadDocumentConsent()");
    }

    @GetMapping("/{application-id}/review-consent-document")
    @Operation(summary = "Get review approve consent document details.",
            description = "Get review approve consent document details for the provided application identifier.")
    @Parameter(allowEmptyValue = true, required = false, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessTaskData.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessTaskData
            retrieveInfoForApproveConsentDocumentSubmission(@PathVariable("application-id") String applicationId) {
        log.info("Entering retrieveInfoForApproveConsentDocumentSubmission()");
        ProcessTaskData processTaskDataDto =
                dynamoShowcaseWorkflowService.retrieveInfoForApproveConsentDocumentSubmission(applicationId);
        log.info("Leaving retrieveInfoForApproveConsentDocumentSubmission()");
        return processTaskDataDto;
    }

    @PostMapping("/{application-id}/review-consent-document")
    @Operation(summary = "Approve document consent for the application.",
            description = "Approve document document consent for the provided user identifier.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = TaskForm.class)))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = Application.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public void handlesApprovalConsentDocumentSubmission(@PathVariable("application-id") String applicationId,
            @RequestBody TaskForm taskForm) {
        log.info("Entering handlesApprovalConsentDocumentSubmission()");
        dynamoShowcaseWorkflowService.handleConsentDocumentSubmissionApproval(applicationId, taskForm);
        log.info("Leaving handlesApprovalConsentDocumentSubmission()");
    }

    @PutMapping(value = "/document/upload")
    @Operation(summary = "Upload the document.", description = "Upload the document for the application.")
    @Parameter(allowEmptyValue = false, required = true, name = "application-id",
            description = "Application identifier", in = ParameterIn.QUERY)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = "files/applications/1000/file.pdf"))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public String uploadDocument(@RequestParam(required = true, name = "application-id") String applicationId,
            @RequestPart("file") MultipartFile file) throws DynamoException {
        log.info("Entering uploadDocument()");
        String documentKey = dynamoShowcaseWorkflowService.uploadDocument(applicationId, file);
        log.info("Leaving uploadDocument()");
        return documentKey;
    }

    @PostMapping(value = "/document/download")
    @Operation(summary = "Get the document byte array.",
            description = "Download the document for the valid given document key.")
    @Parameter(allowEmptyValue = false, required = true, name = "document-key",
            description = "Document key to retrieve document.", in = ParameterIn.QUERY)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = PdfDocument.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public PdfDocument downloadDocument(@RequestParam(name = "document-key") String documentKey)
            throws DynamoException {
        log.info("Entering downloadDocument()");
        PdfDocument pdfDocument = dynamoShowcaseWorkflowService.downloadDocument(documentKey);
        log.info("Leaving downloadDocument()");
        return pdfDocument;
    }

    @GetMapping("/reviewer")
    @Operation(summary = "Retrieves applications.",
            description = "Retrieves applications for the provided user identifier.")
    @Parameters(value = {
        @Parameter(allowEmptyValue = true, required = false, name = "page-no", example = "0",
                description = "Represents the page number.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "page-size", example = "15",
                description = "Represents the page size.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "sort-by", example = "name",
                description = "Represents by which parameter is the sorting done.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "sort-order", example = "asc",
                description = "Represents sort order (i.e)ascending (or) descending.", in = ParameterIn.QUERY),
        @Parameter(allowEmptyValue = true, required = false, name = "status", example = "completed",
                description = "Represents application's status.", in = ParameterIn.QUERY) })
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
                        {
                            "content": [
                                {
                                    "id": 1000,
                                    "createdOn": "2023-10-26T06:30:41.916184Z",
                                    "modifiedOn": "2023-10-26T06:30:41.916189Z",
                                    "applicationId": "473c3f74-92f8-46bf-b8ce-c10e4c85bd32",
                                    "userName": "JohnDoe",
                                    "status": "APPLICATION REVIEW"
                                }
                            ],
                            "pageable": {
                                "sort": {
                                    "empty": false,
                                    "sorted": true,
                                    "unsorted": false
                                },
                                "offset": 0,
                                "pageNumber": 0,
                                "pageSize": 12,
                                "paged": true,
                                "unpaged": false
                            },
                            "last": true,
                            "totalElements": 1,
                            "totalPages": 1,
                            "size": 12,
                            "number": 0,
                            "sort": {
                                "empty": false,
                                "sorted": true,
                                "unsorted": false
                            },
                            "first": true,
                            "numberOfElements": 1,
                            "empty": false
                        }
                        """))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                          "Invalid sort criteria 'id'. Should be something like
                                         'id,ASC' or 'id,asc'"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public Page<Application> retrieveApplicationsForReviewer(
            @Parameter(hidden = true, in = ParameterIn.QUERY, style = ParameterStyle.FORM)
            @SortDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> searchParameters) throws DynamoException {
        log.info("Entering retrieveApplicationsForReviewer(), pageable: {}, searchParameters: {}", pageable,
                searchParameters);
        Page<Application> applications =
                dynamoShowcaseWorkflowService.retrieveApplicationsForReviewer(searchParameters, pageable);
        log.info("Leaving retrieveApplicationsForReviewer()");
        return applications;
    }

    @GetMapping("/{application-id}/view")
    @Operation(summary = "Get application details.",
            description = "Get application details for the provided application identifier.")
    @Parameter(allowEmptyValue = true, required = false, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessDomainEntity.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public ProcessDomainEntity viewApplication(@PathVariable("application-id") String applicationId) {
        log.info("Entering viewApplication()");
        ProcessDomainEntity processDomainEntity = dynamoShowcaseWorkflowService.viewApplicationDetails(applicationId);
        log.info("Leaving viewApplication()");
        return processDomainEntity;
    }

    @GetMapping("/{application-id}/reviewer/view")
    @Operation(summary = "Get application details for reviewer.",
            description = "Get application details for reviewer for the provided application identifier.")
    @Parameter(allowEmptyValue = true, required = false, name = "application-id",
            example = "48db1bd5-f321-4d6d-bb81-be4a28df355e", description = "Represents application identifier",
            in = ParameterIn.PATH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success Payload",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = ProcessDomainEntity.class))),
        @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                     "statusCode": 400,
                                     "message": "BAD_REQUEST",
                                     "details": [
                                         "Invalid Application identifier"
                                     ]
                                 }
                                """))),
        @ApiResponse(responseCode = "401", description = "Unauthorized request",
                content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                        schema = @Schema(implementation = ErrorResponse.class, example = """
                                {
                                    "statusCode": 401,
                                    "message": "UNAUTHORIZED",
                                    "details": [
                                        "Full authentication is required to access this resource"
                                    ]
                                }"""))) })
    public Map<String, JsonNode> viewApplicationForReviewer(@PathVariable("application-id") String applicationId) {
        log.info("Entering viewApplicationForReviewer()");
        Map<String, JsonNode> viewApplicationDataMap =
                dynamoShowcaseWorkflowService.viewApplicationDetailsForReviewer(applicationId);
        log.info("Leaving viewApplicationForReviewer()");
        return viewApplicationDataMap;
    }
}
