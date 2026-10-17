-- Run once as postgres superuser, e.g.:
--   sudo -u postgres psql -f scripts/init-db.sql
-- Or with local cluster:
--   npm run db:postgres

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dental_rahmati') THEN
    CREATE ROLE dental_rahmati LOGIN PASSWORD 'dental_rahmati';
  END IF;
END
$$;

SELECT 'CREATE DATABASE dental_rahmati OWNER dental_rahmati'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dental_rahmati')\gexec

GRANT ALL PRIVILEGES ON DATABASE dental_rahmati TO dental_rahmati;
