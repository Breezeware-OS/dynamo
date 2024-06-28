package net.breezeware.dynamo.showcaseapp.workflow.dynamoshowcaseapp.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import net.breezeware.dynamo.generics.crud.entity.GenericEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(schema = "dynamo", name = "application")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Application extends GenericEntity {

    @Column(name = "application_id")
    private String applicationId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "status")
    private String status;

    @Transient
    private String userName;

}
