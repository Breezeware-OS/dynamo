--create schema if not exists
CREATE SCHEMA IF NOT EXISTS dynamo;

-- drop existing sequence and create a new sequence
DROP SEQUENCE IF EXISTS dynamo.form_seq;
CREATE SEQUENCE dynamo.form_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1000
  CACHE 1;

-- drop existing table and create a new table
DROP TABLE IF EXISTS dynamo.form;
CREATE TABLE dynamo.form (
    id int8 NOT NULL default NEXTVAL('dynamo.form_seq'),
    name varchar(50) NOT NULL,
    description text NOT NULL,
    version varchar(50),
    status varchar(50) NOT NULL,
    form_json text NOT NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT form_pkey PRIMARY KEY (id)
);

-- drop existing sequence and create a new sequence
DROP SEQUENCE IF EXISTS dynamo.form_version_seq;
CREATE SEQUENCE dynamo.form_version_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

-- drop existing table and create a new table
DROP TABLE IF EXISTS dynamo.form_version;
CREATE TABLE dynamo.form_version (
    id int8 NOT NULL default NEXTVAL('dynamo.form_version_seq'),
    description text NOT NULL,
    version varchar(50),
    status varchar(50) NOT NULL,
    form_json text NOT NULL,
    form int8 NOT NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT form_version_pkey PRIMARY KEY (id),
    CONSTRAINT form_version_fkey FOREIGN KEY (form)
    REFERENCES dynamo.form (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);
