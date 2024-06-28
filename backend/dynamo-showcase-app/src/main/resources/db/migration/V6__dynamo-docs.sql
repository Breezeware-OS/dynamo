CREATE SEQUENCE dynamo.collection_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo."collection";
CREATE TABLE dynamo."collection" (
    id int8 NOT NULL UNIQUE default NEXTVAL('dynamo.collection_seq'),
    unique_id UUID NOT null UNIQUE,
    name text NOT NULL,
    description text,
    "permission" varchar(25) NOT NULL,
    created_by_user_id UUID NOT null,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT collection_pkey PRIMARY KEY (id),
    CONSTRAINT user_fkey FOREIGN KEY (created_by_user_id) REFERENCES dynamo."user"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO ACTION
);



CREATE SEQUENCE dynamo.document_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo."document";
CREATE TABLE dynamo.document (
    id int8 NOT NULL UNIQUE default NEXTVAL('dynamo.document_seq'),
    unique_id UUID NOT null UNIQUE,
    title text,
    content text,
    status varchar(25),
    version int8,
    revision_count int8,
    published_on TIMESTAMPTZ,
    archived_on TIMESTAMPTZ,
    deleted_on TIMESTAMPTZ,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    parent_document_id UUID,
    collection_id UUID,
    created_by_user_id UUID NOT null,
    CONSTRAINT document_pkey PRIMARY KEY (id),
    CONSTRAINT document_parent_fkey FOREIGN KEY (parent_document_id) REFERENCES dynamo."document"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO action,
    CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES dynamo."collection"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO action,
    CONSTRAINT user_fkey FOREIGN KEY (created_by_user_id) REFERENCES dynamo."user"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO ACTION
);



CREATE SEQUENCE dynamo.attachment_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.attachment;
CREATE TABLE dynamo.attachment (
	id int8 NOT NULL UNIQUE default NEXTVAL('dynamo.attachment_seq'),
	unique_id UUID NOT NULL UNIQUE,
	document_id UUID NOT NUll,
	name text,
    type varchar(25),
	key text,
	size varchar(20),
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
	created_by_user_id UUID NOT null,
	CONSTRAINT attachment_pkey PRIMARY KEY (id),
	CONSTRAINT document_fkey FOREIGN KEY (document_id) REFERENCES dynamo."document"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO action,
    CONSTRAINT user_fkey FOREIGN KEY (created_by_user_id) REFERENCES dynamo."user"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO ACTION
);



CREATE SEQUENCE dynamo.revision_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.revision;
CREATE TABLE dynamo."revision" (
	id int8 NOT NULL UNIQUE default NEXTVAL('dynamo.revision_seq'),
    unique_id UUID NOT NULL UNIQUE,
	document_id UUID NOT NUll,
	title text,
	content text,
	version int8,
	status varchar(25),
    edited_by_user_id UUID NOT null,
	edited_on TIMESTAMPTZ,
	created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
	CONSTRAINT revision_pkey PRIMARY KEY (id),
	CONSTRAINT document_fkey FOREIGN KEY (document_id) REFERENCES dynamo."document"(unique_id)
	MATCH simple ON UPDATE NO ACTION ON DELETE NO action,
    CONSTRAINT user_fkey FOREIGN KEY (edited_by_user_id) REFERENCES dynamo."user"(unique_id)
    MATCH simple ON UPDATE NO ACTION ON DELETE NO ACTION
);






















