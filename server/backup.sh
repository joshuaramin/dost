#!/bin/bash

mkdir -p backups

TIMESTAMP=$(date +%Y%m%d_%H%M%S)


docker compose exec -T db pg_dump -U postgres -d dost > "backups/dost_${TIMESTAMP}.sql"

docker compose exec -T db pg_dump -U postgres -d geodb > "backups/geodb_${TIMESTAMP}.sql"


echo "Backup completed:"
echo "backups/dost_${TIMESTAMP}.dump"
echo "backups/geodb_${TIMESTAMP}.dump"