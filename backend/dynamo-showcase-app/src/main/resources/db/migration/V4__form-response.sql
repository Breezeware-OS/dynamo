DROP TABLE IF EXISTS dynamo.form_response;
DROP SEQUENCE IF EXISTS dynamo.form_response_seq;
CREATE SEQUENCE dynamo.form_response_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE TABLE dynamo.form_response (
    id int8 NOT NULL default nextval('dynamo.form_response_seq'),
    form_id int8 NOT NULL,
    response_json text NOT NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT form_response_pkey PRIMARY KEY (id),
    CONSTRAINT fk_form_response_form FOREIGN KEY (form_id)
    REFERENCES dynamo.form (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE dynamo.form ADD COLUMN unique_id VARCHAR(50);

ALTER TABLE dynamo.form DROP COLUMN form_json;
ALTER TABLE dynamo.form_version DROP COLUMN description;
