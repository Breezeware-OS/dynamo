package net.breezeware.dynamo.showcaseapp.workflow.processmanagement.showcaseprocess.taskmanager;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.breezeware.dynamo.workflow.service.CamundaProcessManager;
import net.breezeware.dynamo.workflow.taskmanager.StartProcessEventHandler;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ShowcaseProcessStartProcessEventHandler implements StartProcessEventHandler {

    @Autowired
    CamundaProcessManager camundaProcessManager;

    public String initiateNewProcessInstance(String processId) {
        log.info("Entering startProcess()");
        UUID processInstanceUserDefinedKey = UUID.randomUUID();
        camundaProcessManager.createNewProcessInstance(processId, processInstanceUserDefinedKey.toString());
        log.info("Leaving startProcess()");
        return processInstanceUserDefinedKey.toString();
    }
}