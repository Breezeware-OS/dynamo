--Create schema dynamo_ai
CREATE SCHEMA IF NOT EXISTS dynamo_ai;

CREATE SEQUENCE dynamo_ai.model_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo_ai.model;
CREATE TABLE dynamo_ai.model (
    id int8 NOT NULL UNIQUE default NEXTVAL('dynamo_ai.model_seq'),
    unique_id UUID NOT null UNIQUE,
    name varchar(20) NOT NULL,
    system_prompt text,
    temperature float,
    top_p float,
    top_k float,
    status varchar(20),
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT model_pkey PRIMARY KEY (id)
);

CREATE SEQUENCE dynamo_ai.knowledge_artifact_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo_ai.knowledge_artifact;
CREATE TABLE dynamo_ai.knowledge_artifact (
    id int8 NOT NULL UNIQUE default NEXTVAL('dynamo_ai.knowledge_artifact_seq'),
    unique_id UUID NOT null UNIQUE,
    model_id UUID NOT NUll,
    key text,
    name varchar(500),
    type varchar(100),
    size int8,
    status varchar(20),
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT knowledge_artifact_pkey PRIMARY KEY (id),
    CONSTRAINT knowledge_artifact_fkey FOREIGN KEY (model_id) REFERENCES dynamo_ai.model(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO action
);

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SEQUENCE dynamo_ai.vector_store_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo_ai.vector_store;
CREATE TABLE IF NOT EXISTS dynamo_ai.vector_store (
    id int8 NOT NULL UNIQUE default NEXTVAL('dynamo_ai.vector_store_seq'),
    unique_id UUID NOT null UNIQUE,
	content text,
	metadata json,
	embedding vector(1536),
	model_id UUID NOT NUll,
	knowledge_artifact_id UUID NOT NUll,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT vector_store_model_fkey FOREIGN KEY (model_id) REFERENCES dynamo_ai.model(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO action,
    CONSTRAINT vector_store_knowledge_artifact_fkey FOREIGN KEY (knowledge_artifact_id) REFERENCES dynamo_ai.knowledge_artifact(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO action
);

CREATE INDEX ON dynamo_ai.vector_store USING HNSW (embedding vector_cosine_ops);