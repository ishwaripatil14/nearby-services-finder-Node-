# Nearby Services Finder (Full-Stack Geo App)

Production-ready full-stack project with:

- Backend: Node.js + Express + MongoDB (Mongoose) + Geo queries (2dsphere) + Admin JWT
- Frontend: React (Vite) + Tailwind CSS + Leaflet maps + Axios

## Folder Structure

```
project-node/
  backend/
  frontend/
```

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)

## Backend Setup (Express + MongoDB)

### 1) Install dependencies

Open terminal in `backend/`:

```
npm install
```

### 2) Configure environment

Copy `backend/.env.example` to `backend/.env` and update values:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### 3) Seed Admin User

```
npm run seed:admin
```

### 4) Seed Sample Services

```
npm run seed:services
```

### 5) Run backend

Dev:

```
npm run dev
```

Prod:

```
npm start
```

Backend runs on:

- `http://localhost:5000`

## Frontend Setup (Vite + React)

### 1) Install dependencies

Open terminal in `frontend/`:

```
npm install
```

### 2) Configure environment

Copy `frontend/.env.example` to `frontend/.env`:

- `VITE_API_BASE_URL=http://localhost:5000`

### 3) Run frontend

```
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

## Admin Login

- URL: `http://localhost:5173/admin/login`
- Uses token stored in localStorage key: `admin_token`

## API Documentation (Postman)

Postman collection included:

- `backend/postman/Nearby-Services-Finder.postman_collection.json`

In Postman set:

- `baseUrl` = `http://localhost:5000`

## API Endpoints

### Auth

- `POST /auth/login`

Body:

```
{ "email": "admin@example.com", "password": "admin1234" }
```

### Public Services

- `GET /services`
- `GET /services?category=hospital`
- `GET /services/nearby?lat=..&lng=..&radius=..` (radius in km)

### Admin Services (JWT protected)

Send header:

- `Authorization: Bearer <token>`

Endpoints:

- `GET /admin/services`
- `POST /services`
- `PUT /services/:id`
- `DELETE /services/:id`

## Notes

- Service `location` is stored as GeoJSON Point `{ type: "Point", coordinates: [lng, lat] }`.
- `2dsphere` index is created on `location` in `backend/models/Service.js`.
