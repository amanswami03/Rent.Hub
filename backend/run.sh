#!/bin/bash

# RentHub Backend Startup Script
cd "$(dirname "$0")" || exit 1

echo "Starting RentHub Backend..."
echo "PostgreSQL should be running: brew services list | grep postgres"
echo ""

go run quickrent/cmd/renthub
