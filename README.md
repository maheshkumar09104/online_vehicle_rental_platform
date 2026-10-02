# AutoRent – Online Vehicle Rental Platform

A full-stack MERN web application where users can browse and book rental vehicles, and an admin can manage vehicles, bookings, and users. Built with a clean white, green, and black theme (60-30-10 rule).

**Live demo:** https://vehicle-rental-app-l4hj.onrender.com

**API:** https://vehicle-rental-api-ff4a.onrender.com

> The backend runs on Render's free tier and sleeps after about 15 minutes of inactivity. The first request after idle can take 30 to 60 seconds.

---

## Features

### User
- Register and log in (JWT authentication)
- Browse vehicles in a card grid with availability badges
- Search by name; filter by type and price range
- Book a vehicle with pickup and return dates (total price calculated automatically)
- View and cancel bookings (Pending, Confirmed, Cancelled, Completed)
- View and edit profile (name, phone)

### Admin
- Dashboard overview: total vehicles, bookings, users, and revenue
- Add, edit, and delete vehicles
- Approve, reject, and complete bookings
- View and delete users

### Security and rules
- Only users can register; the admin account is created by the seed script
- Passwords hashed with bcryptjs
- Role-based route protection (JWT + admin-only middleware)
- Double-booking prevention for overlapping dates on the same vehicle

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router, Axios, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens, bcryptjs |
| Hosting | Render (backend and static frontend), MongoDB Atlas |

---

## Project Structure

```
online_vehicle_rental_platform/
├── client/                  # React frontend (Vite)
│   ├── public/
│   └── src/
├── server/                  # Express backend
│   └── src/
│       ├── server.js
│       └── seed/seed.js     # Creates admin account and sample vehicles
├── .gitignore
└── README.md
```

---

## Getting Started (Local, Windows PowerShell)

### Prerequisites
- Node.js 18 or later
- MongoDB running locally (or a MongoDB Atlas connection string)
- Git

### 1. Clone the repository

```powershell
git clone https://github.com/maheshkumar09104/online_vehicle_rental_platform.git
cd online_vehicle_rental_platform
```

### 2. Set up the backend

```powershell
cd server
npm install
```

Create `server\.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vehicle_rental
JWT_SECRET=replace_with_a_long_random_string
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
```

Seed the database (creates the admin and 8 sample vehicles; it clears existing vehicles and bookings, so run it once):

```powershell
npm run seed
npm run dev
```

### 3. Set up the frontend

Open a new PowerShell window:

```powershell
cd client
npm install
```

Create `client\.env`:

```
VITE_API_URL=http://localhost:5000/api
```

```powershell
npm run dev
```

Open http://localhost:5173.

### Default admin (local development only)

| Field | Value |
|-------|-------|
| Email | `admin123@gmail.com` |
| Password | `admin123` |

Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server\.env` before seeding any public deployment.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (Render sets this automatically) |
| `MONGO_URI` | MongoDB connection string, including the database name |
| `JWT_SECRET` | Secret used to sign tokens |
| `ADMIN_EMAIL` | Admin email created by the seed script |
| `ADMIN_PASSWORD` | Admin password created by the seed script |
| `CLIENT_URL` | Frontend URL allowed by CORS (no trailing slash) |
| `NODE_ENV` | `development` or `production` |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL, ending in `/api` |

Never commit `.env` files. They are listed in `.gitignore`.

---

## API Overview

| Route | Description | Access |
|-------|-------------|--------|
| `POST /api/auth/register` | Register a user | Public |
| `POST /api/auth/login` | Log in (user or admin) | Public |
| `GET /api/auth/me` | Current user | Authenticated |
| `/api/vehicles` | List, view; create, update, delete | Read: authenticated; write: admin |
| `/api/bookings` | Create booking, my bookings, all bookings, update status | User / admin |
| `/api/users` | List and delete users, update profile | Admin / user |

---

## Deployment

| Part | Service | Settings |
|------|---------|----------|
| Database | MongoDB Atlas | Allow network access; use the `mongodb+srv://` URI with `/vehicle_rental` |
| Backend | Render Web Service | Root: `server`, Build: `npm install`, Start: `npm start` |
| Frontend | Render Static Site | Root: `client`, Build: `npm install && npm run build`, Publish: `dist` |

Additional steps:
- Set the server environment variables listed above in the Render dashboard.
- Set `VITE_API_URL` on the static site and redeploy after changing it (Vite reads it at build time).
- Add a rewrite rule on the static site: source `/*`, destination `/index.html`, action **Rewrite**, so page refreshes work with React Router.
- Seed the Atlas database once by running `npm run seed` with `MONGO_URI` pointing to Atlas.

---

## Theme

| Share | Color | Usage |
|-------|-------|-------|
| 60% | White (`#FFFFFF`, `#F5F7F6`) | Backgrounds, cards, forms |
| 30% | Green (`#1B7F4C`, `#14633B`, `#E6F4EC`) | Navbar, sidebar, buttons, badges |
| 10% | Black (`#111111`) | Headings, text, footer |

---

## Future Improvements

- Online payments (Razorpay or Stripe)
- Vehicle image upload (Multer + Cloudinary)
- Email confirmations (Nodemailer)
- Reviews and ratings
- Booking calendar view

---

## Author

**Mahesh Kumar**
GitHub: [maheshkumar09104](https://github.com/maheshkumar09104)
LinkedIn: [mahesh-kumar-824a47357](https://linkedin.com/in/mahesh-kumar-824a47357)
