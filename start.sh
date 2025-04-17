#!/bin/bash

echo "Démarrage du projet Next.js (frontend)..."
cd frontend && npx next dev &  

echo "Démarrage du projet NestJS (backend)..."
cd backend && npm run start &  

wait