package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.service;

import java.util.Optional;

import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.entity.Application;
import org.springframework.stereotype.Service;

import com.querydsl.core.types.Predicate;

import net.breezeware.dynamo.generics.crud.service.GenericService;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.dao.ApplicationRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ApplicationService extends GenericService<Application> {

    private final ApplicationRepository applicationRepository;

    /**
     * Constructs a new GenericService with the provided GenericRepository.
     * @param applicationRepository the repository for accessing and managing entity
     *                              data.
     */
    public ApplicationService(ApplicationRepository applicationRepository) {
        super(applicationRepository);
        this.applicationRepository = applicationRepository;
    }

    public long retrieveUserApplicationStatusCount(Predicate predicate) {
        log.info("Entering retrieveUserApplicationStatusCount()");
        long applicationStatusCount = applicationRepository.count(predicate);
        log.info("Leaving retrieveUserApplicationStatusCount() {}", applicationStatusCount);
        return applicationStatusCount;
    }

    public Optional<Application> retrieveApplication(String applicationId) {
        log.info("Entering retrieveApplication()");
        Optional<Application> optionalApplication = applicationRepository.findByApplicationId(applicationId);
        log.info("Leaving retrieveApplication()");
        return optionalApplication;
    }
}