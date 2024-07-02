FROM postgres:12.19

# Set password for 'postgres' system (not DB) user
RUN echo 'postgres:secret' | chpasswd

# Setup DB
ENV POSTGRES_USER dynamo_usr
ENV POSTGRES_PASSWORD dynamo123
ENV POSTGRES_DB dynamo_db
ENV PGDATA /var/lib/postgresql/data/dynamo

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
RUN echo "host all  all    0.0.0.0/0  md5" >> /var/lib/postgresql/data/pg_hba.conf

# And add ``listen_addresses`` to postgresql.conf
RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf

# Install the build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-12 \
    && rm -rf /var/lib/apt/lists/*

# Clone, build, and install the pgvector extension
RUN cd /tmp \
    && git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install

# Set Port Configurations
EXPOSE 5432