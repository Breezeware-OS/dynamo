package net.breezeware.dynamo.usermanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import net.breezeware.dynamo.generics.crud.entity.GenericEntity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Represents Group details.
 */
@Entity
@Table(name = "group", schema = "dynamo")
@Getter
@Setter
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class Group extends GenericEntity {

    /**
     * Group's name.
     */
    @Schema(example = "Developer", description = "Group's name.")
    @Column(name = "name", length = 255)
    @NotBlank(message = "Group name is missing or blank")
    private String name;

    /**
     * Group's description.
     */
    @Schema(example = "Group description", description = "Group's description.")
    @Column(name = "description")
    private String description;
}
