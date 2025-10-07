# Educards

A modern, full‑stack flashcards app for fast learning and spaced repetition.

[![Static Badge](https://img.shields.io/badge/Frontend-React%2018-0A7EA4?logo=react&logoColor=white)](https://react.dev)
[![Static Badge](https://img.shields.io/badge/Build-Vite%205-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Static Badge](https://img.shields.io/badge/Styles-Tailwind%20CSS%203-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Static Badge](https://img.shields.io/badge/Backend-Express-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Static Badge](https://img.shields.io/badge/Database-SQLite3-044A64?logo=sqlite&logoColor=white)](https://www.sqlite.org)

---

## Overview

- **Smart study**: deck management, interactive flips, difficulty ratings, progress.
- **Spaced repetition**: configurable scheduling and review statistics.
- **Fast DX**: Vite dev server, hot reload, and a Windows helper script.
- **Clean UI**: Tailwind, motion, and iconography.

---

## Screenshots

![App screenshot 1](frontend/public/screenshots/home.png)

![App screenshot 2](frontend/public/screenshots/studying-2.png)

![App screenshot 3](frontend/public/screenshots/Cards-3.png)

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, SQLite3, CORS, UUID

---

## Quickstart

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install
```bash
# Clone
git clone https://github.com/CodeByMed/Educards-flashcards
cd Educards

# Backend deps
cd backend && npm install

# Frontend deps
cd ../frontend && npm install
```

### Run (Windows)
```powershell
# From repo root
./start-dev.bat
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### Run (manual)
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

---

## Usage

1) Create a deck, add cards (front/back), choose difficulty.
2) Start study mode, flip cards, rate recall (Easy/Medium/Hard).
3) Track accuracy and review queue over time.

---

## API (summary)

- `GET /api/decks` — list decks
- `POST /api/decks` — create deck
- `GET /api/decks/:id` — deck by id
- `PUT /api/decks/:id` — update deck
- `DELETE /api/decks/:id` — delete deck
- `GET /api/decks/:deckId/flashcards` — list cards
- `POST /api/decks/:deckId/flashcards` — create card
- `PUT /api/flashcards/:id` — update card
- `DELETE /api/flashcards/:id` — delete card
- `PUT /api/flashcards/:id/review` — update review stats

---

## Build
```bash
# Frontend production build
cd frontend && npm run build

# Start backend (production)
cd ../backend && npm start
```

---

## Project Structure
```text
Educards/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  └─ educards.db
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.js
│  └─ tailwind.config.js
└─ README.md
```

---

## Contributing

- Fork, branch, commit, and open a pull request. Keep commits focused.
- Use clear naming and descriptive messages.

## License

MIT — see `LICENSE`.

---

## Version notes

- Node.js: >= 18 recommended
- React: 18.x
- Vite: 5.x
- Tailwind CSS: 3.x
- Express: 4.x
- SQLite3: 5.x

All pinned with caret ranges to receive compatible minor/patch updates. Update with `npm install` in each folder to pick up the latest compatible versions.

# medc-0