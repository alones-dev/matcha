echo "🚀 Démarrage du frontend (Next.js)..."
cd matcha && npx run dev &

echo "🚀 Démarrage du backend (NestJS)..."
cd backend && npm run start:dev &

wait