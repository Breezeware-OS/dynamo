package net.breezeware.dynamo.dynamointakeformsvc.dao;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import net.breezeware.dynamo.dynamointakeformsvc.entity.IntakeForm;
import net.breezeware.dynamo.generics.crud.dao.GenericRepository;

@Repository
public interface IntakeFormRepository extends GenericRepository<IntakeForm> {

    Optional<IntakeForm> findByProcessInstanceKey(String processInstanceKey);

}
