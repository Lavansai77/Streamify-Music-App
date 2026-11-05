# 🎵 Streamify

<p align="center">
  <strong>Real-time audio streaming platform for music, messaging, and live listening activity.</strong>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white" alt="Express.js" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.IO-Real--time-010101?logo=socket.io&logoColor=white" alt="Socket.IO" /></a>
  <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Clerk-Auth-6C47FF" alt="Clerk" /></a>
  <a href="https://cloudinary.com/"><img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="streamify-music-app-kappa.vercel.app">Live Demo</a>
  ·
  <a href="https://github.com/Lavansai77/Streamify-Music-App.git">Repository</a>
</p>

---

## Overview

**Streamify** is a full-stack, Spotify-inspired audio streaming application built to demonstrate modern web application architecture, real-time communication, secure authentication, cloud media management, and responsive UI development.

The platform supports music discovery and playback alongside real-time messaging, online presence, listening activity, and an admin dashboard for managing the music library.

## Features

### Music
- Featured, trending, and Made For You sections
- Album and song browsing
- Audio playback with queue management
- Previous / next controls
- Volume control

### Real-time
- One-to-one messaging
- Instant message delivery
- Online/offline presence
- Live listening activity
- Socket.IO-based events

### Administration
- Protected admin dashboard
- Manual album creation
- Manual song uploads
- Album artwork and audio management
- Platform statistics

### Platform
- Clerk authentication
- JWT-based API authorization
- MongoDB persistence
- Cloudinary media storage
- Temporary upload cleanup
- Responsive frontend

## Architecture

```text
                         ┌──────────────────┐
                         │     Browser      │
                         │ React + TS + UI  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                 REST API                  Socket.IO
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────▼────────┐
                         │  Express.js API │
                         └───────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
           Clerk              MongoDB           Cloudinary
       Authentication         Database          Media Storage
```

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| API Client | Axios |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time | Socket.IO |
| Authentication | Clerk |
| Media | Cloudinary |
| Deployment | Render |

## Project Structure

```text
streamify/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── utils/
│   │   └── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── stores/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas
- Clerk account
- Cloudinary account

## Getting Started

### 1. Clone

```bash
git clone https://github.com/thvvamshi/Real-time_audio_streaming_application.git
cd Real-time_audio_streaming_application
```

### 2. Install

```bash
npm install

cd backend
npm install

cd ../frontend
npm install

cd ..
```

### 3. Configure Environment

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

ADMIN_EMAIL=

CLIENT_URL=http://localhost:5173

CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=http://localhost:5000
```

### 4. Start Development Servers

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Application:

```text
http://localhost:5173
```

API:

```text
http://localhost:5000
```

Health check:

```http
GET /health
```

## API Reference

### Base URL

```text
Development: http://localhost:5000/api
Production:  /api
```

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/callback` | Authenticated |

### Users

| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Authenticated |
| GET | `/users/messages/:userId` | Authenticated |

### Songs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/songs` | Public |
| GET | `/songs/featured` | Public |
| GET | `/songs/made-for-you` | Public |
| GET | `/songs/trending` | Public |
| GET | `/songs/:songId` | Public |

### Albums

| Method | Endpoint | Access |
|---|---|---|
| GET | `/albums` | Public |
| GET | `/albums/:albumId` | Public |

### Admin

| Method | Endpoint | Access |
|---|---|---|
| GET | `/admin/check` | Admin |
| POST | `/admin/albums` | Admin |
| POST | `/admin/songs` | Admin |

### Statistics

| Method | Endpoint | Access |
|---|---|---|
| GET | `/stats` | Authenticated |

Protected requests use a Clerk JWT:

```http
Authorization: Bearer <clerk-jwt>
```

## Socket.IO Events

### Client → Server

```text
user_connected
send_message
update_activity
```

### Server → Client

```text
users_online
user_connected
user_disconnected
receive_message
message_sent
activities
activity_updated
```

## Authentication Flow

```text
Clerk Login
     ↓
JWT
     ↓
Axios Authorization Header
     ↓
Clerk / Express Middleware
     ↓
Protected Route
     ↓
Controller
     ↓
MongoDB
```

## Media & Data Flow

Streamify does not require a database seed script. Music and albums are managed manually through the protected Admin Dashboard.

```text
Admin Dashboard
      ↓
Upload Song / Album
      ↓
Express API
      ↓
Cloudinary
      ↓
Media URL
      ↓
MongoDB
      ↓
Frontend
```

## Production Deployment

Streamify can be deployed as a **single Render Web Service**. The backend serves the compiled React application from `frontend/dist`.

Root `package.json`:

```json
{
  "scripts": {
    "build": "npm ci --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "npm start --prefix backend"
  }
}
```

### Render Configuration

| Setting | Value |
|---|---|
| Environment | Node |
| Branch | `master` |
| Root Directory | Leave blank |
| Build Command | `npm run build` |
| Start Command | `npm start` |

### Deployment Flow

```text
GitHub
  ↓
Render
  ↓
Install dependencies
  ↓
Build React frontend
  ↓
Express serves frontend/dist
  ↓
MongoDB + Cloudinary + Clerk
  ↓
Streamify
```

## Security

- Authentication handled by Clerk
- JWT authorization for protected APIs
- Server-side admin authorization
- Secrets stored in environment variables
- CORS configured for application origins
- Temporary upload files cleaned automatically
- Production frontend served through the backend

## Development Notes

Music data is intentionally managed through the Admin Dashboard rather than a seed script.

For local development, make sure MongoDB, Clerk, and Cloudinary credentials are configured before starting the backend.

## Roadmap

- [ ] Playlist management
- [ ] Search and filtering
- [ ] Likes and favorites
- [ ] Recently played
- [ ] Advanced recommendations
- [ ] Friend requests
- [ ] Lyrics integration
- [ ] Collaborative listening
- [ ] Push notifications
- [ ] PWA / mobile application

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Author

**Vamshi Kumar**

- GitHub: https://github.com/thvvamshi
- LinkedIn: https://www.linkedin.com/in/bodavamshikumar/

---

<p align="center">
  Built with React, Node.js, MongoDB, Socket.IO, Clerk, and Cloudinary.
</p>
