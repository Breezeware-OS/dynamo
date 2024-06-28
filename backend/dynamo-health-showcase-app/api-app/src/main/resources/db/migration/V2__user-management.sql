--Create schema leave-svc
CREATE SCHEMA IF NOT EXISTS dynamo;


--Create table idm_info
CREATE SEQUENCE dynamo.idm_info_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.idm_info;
CREATE TABLE dynamo.idm_info (
	id int8 NOT NULL default NEXTVAL('dynamo.idm_info_seq'),
	idm_unique_id varchar(255) UNIQUE NOT NULL,
	name varchar(255) NOT NULL,
	description text,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
	CONSTRAINT idm_info_pkey PRIMARY KEY (id)
);



--Create table user
CREATE SEQUENCE dynamo.user_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.user;
CREATE TABLE dynamo.user (
	id int8 NOT NULL default NEXTVAL('dynamo.user_seq'),
	unique_id uuid UNIQUE NOT NULL,
	idm_user_id varchar(100) UNIQUE NOT NULL,
	idm_info int8 NOT NULL,
	first_name varchar(255),
	last_name varchar(255),
	email varchar(255) UNIQUE NOT NULL,
	phone_number varchar(100),
	status varchar(50) NOT NULL,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
		CONSTRAINT user_pkey PRIMARY KEY (id),
    	CONSTRAINT user_idm_info_fkey FOREIGN KEY (idm_info)
        REFERENCES dynamo.idm_info (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);




--Create table organization
CREATE SEQUENCE dynamo.organization_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.organization;
CREATE TABLE dynamo.organization (
	id int8 NOT NULL default NEXTVAL('dynamo.organization_seq'),
	name varchar(255) UNIQUE NOT NULL,
	description text,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
		CONSTRAINT organization_pkey PRIMARY KEY (id)
);




--Create table group
CREATE SEQUENCE dynamo.group_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.group;
CREATE TABLE dynamo.group (
	id int8 NOT NULL default NEXTVAL('dynamo.group_seq'),
	name varchar(255) UNIQUE NOT NULL,
	description text,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
		CONSTRAINT group_pkey PRIMARY KEY (id)
);


--Create table role
CREATE SEQUENCE dynamo.role_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.role;
CREATE TABLE dynamo.role (
	id int8 NOT NULL default NEXTVAL('dynamo.role_seq'),
	name varchar(255) UNIQUE NOT NULL,
	description text,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
		CONSTRAINT role_pkey PRIMARY KEY (id)
);



--Create table user_organization_map
CREATE SEQUENCE dynamo.user_organization_map_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.user_organization_map;
CREATE TABLE dynamo.user_organization_map (
	id int8 NOT NULL default NEXTVAL('dynamo.user_organization_map_seq'),
	user_id UUID NOT NULL,
	organization_id int8 NOT NULL,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
		CONSTRAINT user_organization_map_pkey PRIMARY KEY (id),
		CONSTRAINT user_fkey FOREIGN KEY (user_id)
        REFERENCES dynamo.user (unique_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
        CONSTRAINT organization_fkey FOREIGN KEY (organization_id)
        REFERENCES dynamo.organization (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);




-- Create table user_group_map
CREATE SEQUENCE dynamo.user_group_map_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.user_group_map;
CREATE TABLE dynamo.user_group_map (
    id int8 NOT NULL default NEXTVAL('dynamo.user_group_map_seq'),
    user_id UUID NOT NULL,
    group_id int8 NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT user_group_map_pkey PRIMARY KEY (id),
    CONSTRAINT user_fkey1 FOREIGN KEY (user_id)
        REFERENCES dynamo.user (unique_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT group_fkey FOREIGN KEY (group_id)
        REFERENCES dynamo.group (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);




--Create table user_role_map
CREATE SEQUENCE dynamo.user_role_map_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS dynamo.user_role_map;
CREATE TABLE dynamo.user_role_map (
	id int8 NOT NULL default NEXTVAL('dynamo.user_role_map_seq'),
	user_id UUID NOT NULL,
	role_id int8 NOT NULL,
	created_on TIMESTAMPTZ,
	modified_on TIMESTAMPTZ,
		CONSTRAINT user_role_map_pkey PRIMARY KEY (id),
		CONSTRAINT user_fkey FOREIGN KEY (user_id)
        REFERENCES dynamo.user (unique_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
        CONSTRAINT role_fkey FOREIGN KEY (role_id)
        REFERENCES dynamo.role (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);





--Add IDM Information
INSERT INTO dynamo.idm_info (id, idm_unique_id, name, description, created_on, modified_on)
VALUES
    (1, 'us-east-1_Q7jFD5LjT', 'cognito', 'Amazon Cognito is a fully managed identity verification and user management service', NOW(), NOW());


--Add Organization
INSERT INTO dynamo.organization (id, name, description, created_on, modified_on)
VALUES
    (1, 'breezeware', 'Breezeware is a leading software solutions company specializing in innovative products and services.', NOW(), NOW());

--Add Role
INSERT INTO dynamo.role (id, name, description, created_on, modified_on)
VALUES
    (1, 'physician', 'The "physician" role provides administrative privileges and access to system settings and features.', NOW(), NOW()),
    (2, 'careteam', 'The "careteam" role is for standard users who have access to review the intake forms.', NOW(), NOW());

--Add Group
   INSERT INTO dynamo."group" (id, name, description, created_on, modified_on)
VALUES
(1, 'clinical', 'The "Clinical" group is for administrative staff with access to system management functions.', NOW(), NOW());


-- Add Admin User
INSERT INTO dynamo."user" (id, unique_id, idm_user_id,idm_info , first_name, last_name, email, phone_number, status, created_on, modified_on)
VALUES
    (1, '0158cb6c-eb70-4593-9f7e-b0ddc82ab5d6', 'a6662eb9-bb44-4f3d-9095-845bd198896a', 1, 'kishore', 'C', 'kishore@breezeware.net', '+919578199005', 'active', NOW(), NOW());

-- Add User Organization Map
   INSERT INTO dynamo.user_organization_map (id, user_id, organization_id, created_on, modified_on)
VALUES
    (1, '0158cb6c-eb70-4593-9f7e-b0ddc82ab5d6', 1, NOW(), NOW());

   -- Add User Group Map
   INSERT INTO dynamo.user_group_map (id, user_id, group_id, created_on, modified_on)
VALUES
    (1, '0158cb6c-eb70-4593-9f7e-b0ddc82ab5d6', 1, NOW(), NOW());


  -- Add User Role Map
INSERT INTO dynamo.user_role_map (id, user_id, role_id, created_on, modified_on)
VALUES
    (1, '0158cb6c-eb70-4593-9f7e-b0ddc82ab5d6', 1, NOW(), NOW());


-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.idm_info_seq', (select max(id)+1 from dynamo.idm_info), false);

-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.user_seq', (select max(id)+1 from dynamo.user), false);


-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.organization_seq', (select max(id)+1 from dynamo.organization), false);


-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.role_seq', (select max(id)+1 from dynamo.role), false);


-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.group_seq', (select max(id)+1 from dynamo.group), false);

-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.user_organization_map_seq', (select max(id)+1 from dynamo.user_organization_map), false);


-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.user_group_map_seq', (select max(id)+1 from dynamo.user_group_map), false);

-- UPDATE the sequence numbers after all the sample data inserts.
select setval('dynamo.user_role_map_seq', (select max(id)+1 from dynamo.user_role_map), false);



