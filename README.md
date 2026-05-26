# 🎬 Ritik's Watch Vault — React (CRA) + Node.js + MongoDB

---

## 📁 Project Structure

```
watchvault/
├── backend/
│   ├── src/
│   │   ├── config/db.js                  MongoDB connection
│   │   ├── models/Watchlist.js           Mongoose schema
│   │   ├── controllers/
│   │   │   ├── watchlistController.js    CRUD logic
│   │   │   └── authController.js         Password verify
│   │   ├── middleware/errorHandler.js
│   │   ├── routes/
│   │   │   ├── watchlist.js              /api/watchlist
│   │   │   └── auth.js                   /api/auth
│   │   └── server.js
│   ├── .env                              ← YOUR SECRETS
│   └── package.json
│
└── frontend/                             ← create-react-app
    ├── public/index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Hero.js
    │   │   ├── Controls.js
    │   │   ├── Grid.js
    │   │   ├── Card.js
    │   │   ├── AddModal.js
    │   │   ├── DetailModal.js
    │   │   ├── PasswordModal.js
    │   │   ├── FAB.js
    │   │   └── Toast.js
    │   ├── context/AppContext.js         Global state
    │   ├── hooks/useHeartsCanvas.js      Canvas animation
    │   ├── styles/global.css
    │   ├── utils/
    │   │   ├── api.js                    Axios client
    │   │   └── helpers.js
    │   ├── App.js
    │   └── index.js                      CRA entry point
    ├── .env                              ← REACT_APP_API_URL
    └── package.json
```

---

## 🚀 Setup

### 1. MongoDB Atlas
1. Go to https://cloud.mongodb.com → create free **M0** cluster
2. Database Access → create user with read/write
3. Network Access → add `0.0.0.0/0`
4. Connect → Drivers → copy connection string

### 2. Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and password
npm run dev
```

`backend/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/watchvault?retryWrites=true&w=majority
PORT=5000
VAULT_PASSWORD=your_pass
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```
> ⚠️ Change `CLIENT_URL` to `http://localhost:3000` for CRA (not 5173)

### 3. Frontend
```bash
cd frontend
npm install
npm start        # runs on http://localhost:3000
```

`frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔌 API Endpoints

| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/watchlist`       | Get all (with filters)   |
| GET    | `/api/watchlist/stats` | Get stats counts         |
| POST   | `/api/watchlist`       | Create item              |
| PUT    | `/api/watchlist/:id`   | Update item              |
| DELETE | `/api/watchlist/:id`   | Delete item              |
| POST   | `/api/auth/verify`     | Verify vault password    |

---

## 🐛 Bugs Fixed
- **Delete not working** — `detailItem` was cleared before PasswordModal could use it. Fixed with a `pendingItemRef` that persists the target item across modal transitions.
- **Edit not working** — same root cause. Now resolved via `executePendingAction()` called after successful password verification.
- **Star rating hover** — properly resets on mouse leave.
