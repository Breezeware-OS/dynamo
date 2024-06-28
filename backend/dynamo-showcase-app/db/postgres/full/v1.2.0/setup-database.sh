#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE dynamo_showcase_db;
    CREATE ROLE dynamo_showcase_usr WITH LOGIN PASSWORD 'dynamo_showcase_123';
    GRANT ALL PRIVILEGES ON DATABASE dynamo_showcase_db TO dynamo_showcase_usr;
    GRANT pg_read_server_files TO dynamo_showcase_usr;
    ALTER DATABASE dynamo_showcase_db OWNER TO dynamo_showcase_usr;
EOSQL

#psql -U dynamo_showcase_usr dynamo_showcase_db </tmp/psql/dynamo-showcase-workflow/dynamo-workflow.sql
