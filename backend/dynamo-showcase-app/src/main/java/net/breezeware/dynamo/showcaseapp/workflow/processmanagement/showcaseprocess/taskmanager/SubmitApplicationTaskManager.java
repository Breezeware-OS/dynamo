package net.breezeware.dynamo.showcaseapp.workflow.processmanagement.showcaseprocess.taskmanager;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.breezeware.dynamo.workflow.dto.ProcessTaskData;
import net.breezeware.dynamo.workflow.dto.TaskForm;
import net.breezeware.dynamo.workflow.entity.ProcessDomainEntity;
import net.breezeware.dynamo.workflow.service.CamundaProcessManager;
import net.breezeware.dynamo.workflow.service.EntityGenerator;
import net.breezeware.dynamo.workflow.taskmanager.TaskManager;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service(value = "DynamoShowcaseAppProcess-submit-application")
public class SubmitApplicationTaskManager implements TaskManager {

    @Autowired
    CamundaProcessManager camundaProcessManager;
    @Autowired
    private EntityGenerator entityGenerator;

    public ProcessTaskData getInfoToActOnTask(String processId, String processInstanceUserDefinedKey,
            String taskDefinitionId) {
        // get domain entities that are pre-req's to act on this task
        Map<String, ProcessDomainEntity> contextData = new HashMap<String, ProcessDomainEntity>();

        // get task form to submit task info
        Optional<TaskForm> taskFormOptional =
                camundaProcessManager.retrieveTaskForm(processId, processInstanceUserDefinedKey, taskDefinitionId);

        // build return data
        ProcessTaskData processTaskDataDto =
                ProcessTaskData.builder().contextData(contextData).taskForm(taskFormOptional.get()).build();
        return processTaskDataDto;
    }

    public void completeTask(TaskForm taskForm) {
        // create/update entities based on info from TaskForm
        entityGenerator.generateAndPersistEntities(taskForm);

        // call workflow engine to complete this task
        camundaProcessManager.completeUserTask(taskForm);
    }
}