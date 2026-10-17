#!/usr/bin/env bash
set -euo pipefail

# Creates role + database for local Nest TypeORM connection.
# Needs postgres superuser access via one of:
#   1) peer:   sudo -u postgres bash scripts/init-db.sh
#   2) password: POSTGRES_SUPERUSER_PASSWORD=... bash scripts/init-db.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ROOT_DIR/.env"
  set +a
fi

DB_USERNAME="${DB_USERNAME:-dental_rahmati}"
DB_PASSWORD="${DB_PASSWORD:-dental_rahmati}"
DB_DATABASE="${DB_DATABASE:-dental_rahmati}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5433}"

SQL=$(cat <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USERNAME}') THEN
    CREATE ROLE ${DB_USERNAME} LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE ${DB_USERNAME} WITH LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${DB_DATABASE} OWNER ${DB_USERNAME}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_DATABASE}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_DATABASE} TO ${DB_USERNAME};
SQL
)

run_as_peer() {
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "$SQL"
}

run_as_password() {
  PGPASSWORD="${POSTGRES_SUPERUSER_PASSWORD}" psql \
    -h "$DB_HOST" -p "$DB_PORT" -U "${POSTGRES_SUPERUSER:-postgres}" -d postgres \
    -v ON_ERROR_STOP=1 -c "$SQL"
}

if [[ -n "${POSTGRES_SUPERUSER_PASSWORD:-}" ]]; then
  run_as_password
elif command -v sudo >/dev/null 2>&1; then
  run_as_peer
else
  echo "Set POSTGRES_SUPERUSER_PASSWORD or run: sudo -u postgres bash scripts/init-db.sh" >&2
  exit 1
fi

echo "OK: role=${DB_USERNAME} database=${DB_DATABASE}"
echo "Test: PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USERNAME} -d ${DB_DATABASE} -c 'SELECT 1'"
