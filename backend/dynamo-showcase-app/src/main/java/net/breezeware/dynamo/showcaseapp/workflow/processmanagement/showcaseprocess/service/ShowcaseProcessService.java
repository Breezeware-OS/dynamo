package net.breezeware.dynamo.showcaseapp.workflow.processmanagement.showcaseprocess.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import net.breezeware.dynamo.showcaseapp.workflow.processmanagement.showcaseprocess.taskmanager.ShowcaseProcessStartProcessEventHandler;
import net.breezeware.dynamo.workflow.entity.ProcessDomainEntity;
import net.breezeware.dynamo.workflow.service.CamundaProcessManager;
import net.breezeware.dynamo.workflow.service.ProcessDomainEntityService;
import net.breezeware.dynamo.workflow.service.ProcessService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing the Dynamo Showcase BPMN process.
 */
@Slf4j
@Service
public class ShowcaseProcessService extends ProcessService {

    /**
     * Value of the ID attribute in the bpmn:process XML tag in the process
     * definition.
     */
    public static final String PROCESS_ID = "DynamoShowcaseAppProcess";
    @Autowired
    private ShowcaseProcessStartProcessEventHandler showcaseProcessStartProcessEventHandler;
    @Autowired
    private ProcessDomainEntityService processDomainEntityService;

    public ShowcaseProcessService(CamundaProcessManager camundaProcessManager, ApplicationContext applicationContext) {
        super(camundaProcessManager, applicationContext);

    }

    /**
     * Starts a new application process.
     * @return Unique ID to identify the application.
     */
    public String startProcess() {
        return showcaseProcessStartProcessEventHandler.initiateNewProcessInstance(PROCESS_ID);
    }

    @Override
    public List<String> getProcessTaskDefinitionIds() {
        return Stream.of(TaskDefinitionId.values()).map(TaskDefinitionId::getValue).collect(Collectors.toList());
    }

    @Override
    protected String getProcessId() {
        return PROCESS_ID;
    }

    /**
     * Retrieves a specific entity created for a process instance.
     * @param  processInstanceUserDefinedKey The user-defined key of the process
     *                                       instance.
     * @param  entityName                    The name of the entity to retrieve.
     * @return                               The retrieved entity.
     */
    public Optional<ProcessDomainEntity> retrieveEntity(String processInstanceUserDefinedKey, String entityName) {
        log.info("Entering retrieveEntity()");
        Optional<ProcessDomainEntity> processDomainEntity =
                processDomainEntityService.retrieveProcessDomainEntity(processInstanceUserDefinedKey, entityName);
        log.info("Leaving retrieveEntity()");
        return processDomainEntity;
    }



    public List<ProcessDomainEntity> retrieveProcessDomainEntities(String processInstanceUserDefinedKey) {
        log.info("Entering retrieveProcessDomainEntities()");
        List<ProcessDomainEntity> processDomainEntities =
                processDomainEntityService.retrieveProcessDomainEntities(processInstanceUserDefinedKey);
        log.info("Leaving retrieveProcessDomainEntities()");
        return processDomainEntities;
    }

    /**
     * Enum representing task definition IDs for various tasks in the Application
     * Workflow process.
     */
    public enum TaskDefinitionId {
        SUBMIT_APPLICATION("submit-application"), REVIEW_APPLICATION("review-application"),
        DOCUSIGN_CONSENT_DOCUMENT("docusign-consent-document"), UPLOAD_CONSENT_DOCUMENT("upload-consent-document"),
        APPROVE_CONSENT_DOCUMENT_SUBMISSION("approve-consent-document-submission");

        private final String value;

        /**
         * Constructs a TaskDefinitionId enum value with the given string value.
         * @param value The string value representing the task definition ID.
         */
        TaskDefinitionId(String value) {
            this.value = value;
        }

        /**
         * Retrieves the string value representing the task definition ID.
         * @return The string value of the task definition ID.
         */
        public String getValue() {
            return value;
        }
    }
}
