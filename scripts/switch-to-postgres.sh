#!/bin/bash

# Script to switch from SQLite to PostgreSQL for production deployment

echo "Switching to PostgreSQL schema..."

# Backup current schema
cp prisma/schema.prisma prisma/schema.prisma.backup

# Copy PostgreSQL schema
cp prisma/schema-postgres.prisma prisma/schema.prisma

echo "✅ Schema updated to use PostgreSQL"
echo "Next steps:"
echo "1. Set DATABASE_URL environment variable to your PostgreSQL connection string"
echo "2. Run: npx prisma migrate dev --name init_postgres"
echo "3. Run: npm run seed"
