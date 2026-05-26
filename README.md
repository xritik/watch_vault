# 🎬 Ritik's Watch Vault — React + Node.js + MongoDB

A full-stack cinematic watchlist app. All data is stored in **MongoDB Atlas**.

---

## 📁 Project Structure

```
watchvault/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── watchlistController.js   # CRUD logic
│   │   │   └── authController.js        # Password verification
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Watchlist.js    # Mongoose schema
│   │   ├── routes/
│   │   │   ├── watchlist.js    # /api/watchlist
│   │   │   └── auth.js         # /api/auth
│   │   └── server.js           # Express entry point
│   ├── .env                    # ← YOUR SECRETS (not committed)
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/                   # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Controls.jsx
    │   │   ├── Grid.jsx
    │   │   ├── Card.jsx
    │   │   ├── AddModal.jsx
    │   │   ├── DetailModal.jsx
    │   │   ├── PasswordModal.jsx
    │   │   ├── FAB.jsx
    │   │   └── Toast.jsx
    │   ├── context/
    │   │   └── AppContext.jsx   # Global state (React Context)
    │   ├── hooks/
    │   │   └── useHeartsCanvas.js  # Floating hearts animation
    │   ├── styles/
    │   │   └── global.css       # All styles (ported from style.css)
    │   ├── utils/
    │   │   ├── api.js           # Axios API client
    │   │   └── helpers.js       # Constants & helpers
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env                     # ← VITE_API_URL
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Setup Guide

### 1. MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. Under **Database Access** → create a user with read/write access
4. Under **Network Access** → add `0.0.0.0/0` (allow all) or your IP
5. Click **Connect** → **Drivers** → copy the connection string

### 2. Backend Setup

```bash
cd backend
npm install

# Copy env template and fill in your values
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/watchvault?retryWrites=true&w=majority
PORT=5000
VAULT_PASSWORD=7777777        # Change this to your preferred password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev     # Development (with nodemon)
# or
npm start       # Production
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env
# .env already contains: VITE_API_URL=http://localhost:5000/api

npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Route                      | Description           |
|--------|----------------------------|-----------------------|
| GET    | `/api/watchlist`           | Get all items (filterable) |
| GET    | `/api/watchlist/stats`     | Get counts/statistics |
| POST   | `/api/watchlist`           | Add new item          |
| PUT    | `/api/watchlist/:id`       | Update item           |
| DELETE | `/api/watchlist/:id`       | Delete item           |
| POST   | `/api/auth/verify`         | Verify vault password |
| GET    | `/api/health`              | Health check          |

### Query Params for GET /api/watchlist
- `status` — `all | watched | watching | plan | dropped`
- `type` — `all | movie | series | anime | documentary`
- `search` — search by title or genre
- `sort` — `newest | oldest | rating | az | year`

---

## 🌱 Seeding

The DB auto-seeds with 12 default titles on first load if the collection is empty. No manual step needed.

---

## 🔐 Vault Password

The password is stored in **backend `.env`** as `VAULT_PASSWORD`. Change it to whatever you want. The frontend sends it to `/api/auth/verify` — never stores it.
