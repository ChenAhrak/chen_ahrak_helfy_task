# Task Manager App

A full-stack Task Manager: create, view, update, and delete tasks, displayed in an endless auto-scrolling carousel built from scratch in vanilla React (no carousel libraries).

- **Frontend:** React 18 + Vite (port 3000)
- **Backend:** Express.js on Node.js (REST API on port 4000, in-memory storage)

---

## Setup and Installation

Node.js 18+ and npm are required.

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## How to Run

Start the backend first — the frontend fetches from it on load.

**Backend:**
```bash
cd backend
npm start
# Running at http://localhost:4000
```

**Frontend** (second terminal):
```bash
cd frontend
npm start
# Opens http://localhost:3000 automatically
```

---

## API Documentation

Base URL: `http://localhost:4000/api`

### Task model

```js
{
  id: number,
  title: string,
  description: string,
  completed: boolean,
  createdAt: Date,
  priority: 'low' | 'medium' | 'high',
  dueDate: string // 'YYYY-MM-DD'
}
```

### Endpoints

- `GET /api/tasks` - get all tasks - `200 OK`
- `POST /api/tasks` - create a task - `201 Created`
- `PUT /api/tasks/:id` - update a task - `200 OK`
- `PATCH /api/tasks/:id/toggle` - toggle completion - `200 OK`
- `DELETE /api/tasks/:id` - delete a task - `204 No Content`

**Create / Update body:**

```json
{
  "title": "Write the report",
  "description": "Q3 summary",
  "priority": "high",
  "dueDate": "2026-09-01"
}
```

- `title` - required, non-empty string.
- `dueDate` - required, `YYYY-MM-DD` string (a `400` is returned with `"Due date is required and must be a valid YYYY-MM-DD date."` if missing or invalid).
- `priority` - one of `low`, `medium`, `high` (defaults to `medium`).
- `description` - optional string.

**Errors** are returned as JSON:

```json
{ "error": "Title is required and must be a non-empty string." }
```

- `400` - validation failed (missing title, invalid priority, bad id).
- `404` - task not found or unknown route.

**Quick test with curl:**

```bash
curl http://localhost:4000/api/tasks
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New task","priority":"high","dueDate":"2026-09-01"}'
curl -X PATCH http://localhost:4000/api/tasks/1/toggle
curl -X DELETE http://localhost:4000/api/tasks/1
```

---

## Assumptions and Design Decisions

- **Vite instead of Create React App** - faster dev server, actively maintained; configured to port 3000 to match assignment instructions. Files use `.js` extensions with JSX inside; `vite.config.js` opts the React plugin and esbuild into transforming them.
- **Layered backend** - routes --> validation middleware --> store, with a centralized error handler so HTTP status codes stay consistent everywhere.
- **Endless carousel** - `TaskList.js` renders the task set several times side by side in a flex track; a `requestAnimationFrame` loop drives the offset via a ref (never React state), giving zero re-renders per frame. Wrap is seamless (modulo set width). Speed is time-based (px/sec) so it's consistent across refresh rates. Pauses on hover and focus; supports drag-to-scrub.
- **Inline delete confirmation** - two-step "Delete? Yes / No" instead of `window.confirm`, which would freeze the carousel animation.


### Bonus
- **Due dates as `YYYY-MM-DD` strings** - stored and transmitted as plain date strings (not `Date` objects) and parsed to local midnight for display and overdue checks, which avoids the UTC off-by-one that `new Date('2026-09-01')` causes. Tasks sort soonest-due-first, and a past-due task that isn't completed gets an overdue highlight.
- **Dark/light theme toggle** - built on the existing CSS custom properties: a `[data-theme='dark']` block overrides the palette, so every surface adapts automatically. An inline script in `index.html` sets the theme before paint (no flash); the default follows the OS `prefers-color-scheme`, and the user's manual choice is persisted to `localStorage`.

---

## Time Spent

- Backend API : 80 min
- Frontend Core Features : 70 min
- Bonus : 40 min
- Styling & Polish : 20 min
- Testing & Debugging : 30 min
