CREATE SCHEMA IF NOT EXISTS dynamo;

DROP SEQUENCE IF EXISTS dynamo.application_seq;
CREATE SEQUENCE dynamo.application_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1000
  CACHE 1;

CREATE TABLE dynamo.application (
    id int8 NOT NULL default NEXTVAL('dynamo.application_seq'),
    application_id varchar(255) NULL UNIQUE,
    user_id uuid NULL,
    status varchar(255) NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT application_pkey PRIMARY KEY (id)
);


DROP SEQUENCE IF EXISTS dynamo.form_submission_seq;
CREATE SEQUENCE dynamo.form_submission_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.form_submission;
CREATE TABLE dynamo.form_submission (
	id int8 NOT NULL default NEXTVAL('dynamo.form_submission_seq'),
	application_id varchar(255) NULL,
	user_id uuid NULL,
	task_name varchar(255) NULL,
	form_data text NULL,
	status varchar(255) NULL,
	created_on TIMESTAMP,
    modified_on TIMESTAMP,
	CONSTRAINT form_submission_pkey PRIMARY KEY (id),
    CONSTRAINT fk_form_submission_application FOREIGN KEY (application_id)
    REFERENCES dynamo.application (application_id)
    MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP SEQUENCE IF EXISTS dynamo.user_details_seq;
CREATE SEQUENCE dynamo.user_details_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.user_details;
CREATE TABLE dynamo.user_details (
	id int8 NOT NULL default NEXTVAL('dynamo.user_details_seq'),
	user_id uuid NULL,
	application_id varchar(255) NULL,
	email varchar(255) NULL,
	first_name varchar(255) NULL,
	last_name varchar(255) NULL,
	middle_name varchar(255) NULL,
	phone_number varchar(255) NULL,
	address_line1 text NULL,
	address_line2 text NULL,
	city varchar(100) NULL,
	state varchar(150) NULL,
	zip_code varchar(50) NULL,
	created_on TIMESTAMP,
	modified_on TIMESTAMP,
	CONSTRAINT user_details_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user_details_application FOREIGN KEY (application_id)
    REFERENCES dynamo.application (application_id)
    MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP SEQUENCE IF EXISTS dynamo.form_review_details_seq;
CREATE SEQUENCE dynamo.form_review_details_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.form_review_details;
CREATE TABLE dynamo.form_review_details (
	id int8 NOT NULL default NEXTVAL('dynamo.form_review_details_seq'),
	application_id varchar(255) NULL,
	task_name varchar(255) NULL,
	reviewer_id uuid NULL,
	reviewer_name varchar(255) NULL,
	reviewer_comments text NULL,
	is_data_verified bool NULL,
	is_provided_data_valid bool NULL,
    status varchar(255) NULL,
	created_on TIMESTAMP,
    modified_on TIMESTAMP,
	CONSTRAINT reviewer_details_pkey PRIMARY KEY (id),
    CONSTRAINT fk_reviewer_details_application FOREIGN KEY (application_id)
    REFERENCES dynamo.application (application_id)
    MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP SEQUENCE IF EXISTS dynamo.application_document_map_seq;
CREATE SEQUENCE dynamo.application_document_map_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.application_document_map;
CREATE TABLE dynamo.application_document_map (
	id int8 NOT NULL default NEXTVAL('dynamo.application_document_map_seq'),
	application_id varchar(255) NULL,
	document_key varchar(255) NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
	CONSTRAINT application_document_map_pkey PRIMARY KEY (id),
    CONSTRAINT fk_application_document_map_application FOREIGN KEY (application_id)
    REFERENCES dynamo.application (application_id)
    MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);
