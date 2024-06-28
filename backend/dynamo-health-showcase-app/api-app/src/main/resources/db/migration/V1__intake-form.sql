CREATE SCHEMA IF NOT EXISTS dynamo;

DROP SEQUENCE IF EXISTS dynamo.intake_form_seq;
CREATE SEQUENCE dynamo.intake_form_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1000
  CACHE 1;

DROP TABLE IF EXISTS dynamo.intake_form;
CREATE TABLE dynamo.intake_form (
    id int8 NOT NULL default NEXTVAL('dynamo.intake_form_seq'),
    patient_first_name varchar(255) NULL,
    patient_last_name varchar(255) NULL,
    process_instance_key varchar(255) NULL,
    status varchar(255) NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT intake_form_pkey PRIMARY KEY (id)
);

DROP SEQUENCE IF EXISTS dynamo.process_domain_entity_seq;
CREATE SEQUENCE dynamo.process_domain_entity_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.process_domain_entity;
CREATE TABLE dynamo.process_domain_entity (
    id int8 NOT NULL default NEXTVAL('dynamo.process_domain_entity_seq'),
    entity_name VARCHAR(255) NULL,
    entity_properties json NULL,
    process_instance_user_definition_key VARCHAR(255) NOT NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    PRIMARY KEY (id)
);
