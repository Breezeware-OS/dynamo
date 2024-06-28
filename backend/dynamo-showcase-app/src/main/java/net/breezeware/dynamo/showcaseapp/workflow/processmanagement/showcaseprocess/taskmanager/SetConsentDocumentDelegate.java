package net.breezeware.dynamo.showcaseapp.workflow.processmanagement.showcaseprocess.taskmanager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

import com.fasterxml.jackson.databind.JsonNode;

import net.breezeware.dynamo.workflow.entity.ProcessDomainEntity;
import net.breezeware.dynamo.workflow.service.ProcessDomainEntityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Named
@Slf4j
@RequiredArgsConstructor
public class SetConsentDocumentDelegate implements JavaDelegate {

    private final ProcessDomainEntityService processDomainEntityService;

    @Override
    public void execute(DelegateExecution execution) {
        log.info("Entering execute()");

        List<ProcessDomainEntity> processDomainEntities =
                processDomainEntityService.retrieveProcessDomainEntities(execution.getProcessBusinessKey());

        Optional<ProcessDomainEntity> optProcessDomainEntity = processDomainEntities.stream()
                .filter(processDomainEntity -> processDomainEntity.getEntityName().equalsIgnoreCase("application"))
                .findFirst();
        ProcessDomainEntity processDomainEntity =
                optProcessDomainEntity.orElseThrow(() -> new RuntimeException("Process entity not found!!"));
        JsonNode entityPropertiesJson = processDomainEntity.getEntityProperties();
        if (entityPropertiesJson.has("documentSubmissionOption")) {
            String documentSubmissionOption = entityPropertiesJson.get("documentSubmissionOption").asText();
            Map<String, Object> variables = new HashMap<>();
            variables.put("submission_choice", documentSubmissionOption);
            execution.setVariables(variables);
            log.info("Leaving execute()");
        }

    }
}
