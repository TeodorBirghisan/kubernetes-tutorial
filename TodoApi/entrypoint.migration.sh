#!/bin/bash
set -e

echo "Running migrations..."
dotnet ef database update
echo "Migrations applied, starting application..."
