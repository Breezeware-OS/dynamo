CREATE SCHEMA IF NOT EXISTS dynamo;

DROP SEQUENCE IF EXISTS dynamo.application_seq;
CREATE SEQUENCE dynamo.application_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1000
  CACHE 1;
DROP TABLE IF EXISTS dynamo.application;
CREATE TABLE dynamo.application (
    id int8 NOT NULL default NEXTVAL('dynamo.application_seq'),
    application_id varchar(255) NULL UNIQUE,
    user_id uuid NULL,
    status varchar(255) NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT application_pkey PRIMARY KEY (id)
);

DROP SEQUENCE IF EXISTS dynamo.process_domain_entity_seq;
CREATE SEQUENCE dynamo.process_domain_entity_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1000
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




