#!/bin/bash

# This script sets up the database and runs migrations for Render deployment

echo "Starting database setup..."

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed the database (only if it's empty)
echo "Seeding database..."
npm run seed || echo "Seeding skipped (database may already be seeded)"

echo "Database setup complete!"
