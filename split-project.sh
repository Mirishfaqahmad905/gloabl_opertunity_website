#!/bin/bash
# Run this script to generate separate frontend and backend folders for GitHub/Vercel/Render deployment!

echo "Creating separate frontend and backend directories..."
mkdir -p project-export/frontend/src
mkdir -p project-export/backend

# Frontend
cp -r src project-export/frontend/
cp -r public project-export/frontend/ || true
cp index.html project-export/frontend/
cp vite.config.ts project-export/frontend/
cp tsconfig.json project-export/frontend/
cp tsconfig.node.json project-export/frontend/ || true

# Backend
cp -r server project-export/backend/
cp -r api project-export/backend/
cp server.ts project-export/backend/
cp vercel.json project-export/backend/
cp .env.example project-export/backend/

# Creating individual package.json configs
cat > project-export/frontend/package.json << 'EOF'
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-router-dom": "^7.15.1",
    "lucide-react": "^0.546.0",
    "axios": "^1.16.1",
    "motion": "^12.23.24",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.4",
    "vite": "^6.2.3",
    "tailwindcss": "^4.1.14",
    "@tailwindcss/vite": "^4.1.14"
  }
}
EOF

cat > project-export/backend/package.json << 'EOF'
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.ts",
  "scripts": {
    "start": "node dist/server.cjs",
    "dev": "tsx server.ts",
    "build": "esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"
  },
  "dependencies": {
    "express": "^4.21.2",
    "cors": "^2.8.6",
    "mongoose": "^9.6.2",
    "dotenv": "^17.2.3",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "nodemailer": "^8.0.9"
  },
  "devDependencies": {
    "tsx": "^4.21.0",
    "esbuild": "^0.25.0",
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/cors": "^2.8.19"
  }
}
EOF

echo "Done! You can find the separated codebase in the 'project-export' folder."
echo "You can download this folder directly from AI Studio to push to Github!"
