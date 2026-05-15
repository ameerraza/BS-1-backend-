# SwapNShare Project User Manual

This manual explains how to run the three apps in this workspace:

- Frontend: [swapshare-frontend](../swapshare-frontend)
- Dashboard: [swapNShare-dashboard](../swapNShare-dashboard)
- Backend: [swapNShare-backend](.)

## 1. What Runs Where

- Frontend runs on `http://localhost:3000`
- Dashboard runs on `http://localhost:3000` by default, so it must use a different port if you want both frontends open at the same time
- Backend runs on `http://localhost:5001`
- Backend API base path is `http://localhost:5001/api/v1/`


## 2. Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string configured in the backend env file
- Internet access for email, Stripe, and any external services you use in the backend

## 3. Install Dependencies

Run this inside each project folder:

```bash
npm install
```

Suggested order:

1. [swapNShare-backend](.)
2. [swapshare-frontend](../swapshare-frontend)
3. [swapNShare-dashboard](../swapNShare-dashboard)

## 4. Run The Backend

From [swapNShare-backend](.) run:

```bash
npm run dev
```

Backend notes:

- Development mode uses `nodemon server.js`
- The app listens on `PORT` from the env file, or `3000` if `PORT` is missing
- MongoDB seeding runs automatically when the database connects and the `Users` collection is empty
- Socket.IO is initialized with the same server

For a production-style run:

```bash
npm run dev
```

## 5. Run The Frontend

From [swapshare-frontend](../swapshare-frontend) run:

```bash
npm run dev
```

The frontend expects the backend to be available at `http://localhost:5001`.

Production build:

```bash
npm run build
npm run start
```

## 6. Run The Dashboard

From [swapNShare-dashboard](../swapNShare-dashboard) run:

```bash
npm run dev
```

Important:

- The dashboard also defaults to port `3000`
- If the frontend is already running, start the dashboard on another port

Example:

```bash
PORT=3001 npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## 7. Environment Variables

### Backend Development Env

Current file: [swapNShare-backend/.env](.env)

```env
NODE_ENV=DEVELOPMENT
PORT=5001
DEV_DATABASE=mongodb://mshuraimk:root123@ac-yaibsla-shard-00-00.qv8xj3q.mongodb.net:27017,ac-yaibsla-shard-00-01.qv8xj3q.mongodb.net:27017,ac-yaibsla-shard-00-02.qv8xj3q.mongodb.net:27017/swap-n-share?ssl=true&replicaSet=atlas-5lbwz2-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Backend Production Env Template

Current file: [swapNShare-backend/.env](.env)

```env
NODE_ENV=PRODUCTION
PORT=5001
DEV_DATABASE=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.example

```

### Frontend Env

Current file: [swapshare-frontend/.env]

```env
NEXT_PUBLIC_URL=http://localhost:5001/api/v1/
NEXT_PUBLIC_URL_IMAGE=http://localhost:5001/
```

### Dashboard Env

Current file: [swapNShare-dashboard/.env]

```env
NEXT_PUBLIC_URL=http://localhost:5001/api/v1/
NEXT_PUBLIC_URL_IMAGE=http://localhost:5001/
```

## 8. Run All Three Together

If you want everything open at once:

1. Start the backend on `5001`
2. Start the frontend on `3000`
3. Start the dashboard on another port, for example `3001`

Example terminal split:

```bash
# terminal 1
swapNShare-backend
npm run dev

# terminal 2
swapshare-frontend
npm run dev

# terminal 3
swapNShare-dashboard
PORT=3001 npm run dev
```

## 9. Useful Checks

- Backend health is easiest to confirm by opening `http://localhost:5001/api-docs`
- Frontend should talk to the backend through `NEXT_PUBLIC_URL`
- Dashboard uses the same backend base URL as the frontend

