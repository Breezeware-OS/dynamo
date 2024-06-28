package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.dao;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import net.breezeware.dynamo.generics.crud.dao.GenericRepository;
import net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.entity.Application;

@Repository
public interface ApplicationRepository extends GenericRepository<Application> {

    Optional<Application> findByApplicationId(String applicationId);

}
