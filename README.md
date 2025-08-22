## Tech Stack

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: React, TypeScript

## Prerequisites

- Node.js 14+
- npm

## Quick Start

```bash
# Backend
cd backend
npm install
npm run dev  # runs on http://localhost:5000 (sometimes 3001, in my pc 5000 occupied)

# Frontend (new terminal)
cd frontend
npm install
npm start    # runs on http://localhost:3000
```

## API
- `GET /api/artworks` - All artworks
- `GET /api/artworks/:id` - Specific artwork
- WebSocket chat via Socket.io rooms