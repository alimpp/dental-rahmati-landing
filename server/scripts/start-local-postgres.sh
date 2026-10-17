#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="${ROOT_DIR}/.pgdata"
BIN="/usr/lib/postgresql/17/bin"
PORT="${DB_PORT:-5433}"
USER_NAME="${DB_USERNAME:-dental_rahmati}"
PASSWORD="${DB_PASSWORD:-dental_rahmati}"
DATABASE="${DB_DATABASE:-dental_rahmati}"

export PATH="${BIN}:${PATH}"

mkdir -p "$DATA_DIR"

if [[ ! -f "${DATA_DIR}/PG_VERSION" ]]; then
  PWFILE="$(mktemp)"
  printf '%s' "$PASSWORD" > "$PWFILE"
  initdb \
    --pgdata="$DATA_DIR" \
    --username="$USER_NAME" \
    --pwfile="$PWFILE" \
    --auth=scram-sha-256 \
    --encoding=UTF8 \
    --locale=C.UTF-8
  rm -f "$PWFILE"
  {
    echo "listen_addresses = '127.0.0.1'"
    echo "port = ${PORT}"
    echo "unix_socket_directories = '${DATA_DIR}'"
  } >> "${DATA_DIR}/postgresql.conf"
  cat > "${DATA_DIR}/pg_hba.conf" <<HBA
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
HBA
fi

if pg_isready -h 127.0.0.1 -p "$PORT" >/dev/null 2>&1; then
  echo "PostgreSQL already running on ${PORT}"
else
  pg_ctl -D "$DATA_DIR" -l "${DATA_DIR}/postgres.log" start
  for _ in $(seq 1 20); do
    pg_isready -h 127.0.0.1 -p "$PORT" >/dev/null 2>&1 && break
    sleep 0.3
  done
fi

if ! PGPASSWORD="$PASSWORD" psql -h 127.0.0.1 -p "$PORT" -U "$USER_NAME" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DATABASE}'" | grep -q 1; then
  PGPASSWORD="$PASSWORD" createdb -h 127.0.0.1 -p "$PORT" -U "$USER_NAME" "$DATABASE"
fi

echo "OK postgres://$USER_NAME@127.0.0.1:${PORT}/${DATABASE}"
