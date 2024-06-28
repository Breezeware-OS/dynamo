DROP TABLE IF EXISTS dynamo.form_invitation;
DROP SEQUENCE IF EXISTS dynamo.form_invitation_seq;
CREATE SEQUENCE dynamo.form_invitation_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE TABLE dynamo.form_invitation (
    id int8 NOT NULL default nextval('dynamo.form_invitation_seq'),
    email VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    form_id int8 NOT NULL,
    created_on TIMESTAMP,
    modified_on TIMESTAMP,
    CONSTRAINT form_invitation_pkey PRIMARY KEY (id),
    CONSTRAINT fk_form_invitation_form FOREIGN KEY (form_id)
    REFERENCES dynamo.form (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE dynamo.form ADD COLUMN access_type VARCHAR(50);
ALTER TABLE dynamo.form ADD COLUMN owner VARCHAR(150);

ALTER TABLE dynamo.form_response ADD COLUMN email VARCHAR(150);



