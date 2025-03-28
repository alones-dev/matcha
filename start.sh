echo "🚀 Démarrage du frontend (Next.js)..."
cd frontend && npx next dev &

echo "🚀 Démarrage du backend (NestJS)..."
cd backend && npm run start &

wait