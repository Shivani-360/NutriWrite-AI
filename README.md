# NutriWrite AI

An AI-powered tool that helps food businesses generate professional product descriptions in three tones — **Premium**, **Traditional**, and **Health-Focused** — using Google Gemini AI.

Built as part of a 9-week AI-Assisted Full Stack Web Development internship.

---

## 🚀 Live Demo

- **Live App:** [https://nutri-write-ai.vercel.app](https://nutri-write-ai.vercel.app)
- **Live API:** [https://nutriwrite-ai-backend.onrender.com](https://nutriwrite-ai-backend.onrender.com)

> **Note:** The backend runs on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time can take 30–60 seconds to respond while the server wakes up — this is expected, not a bug.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini API |
| Auth | JWT (httpOnly cookies) + GitHub OAuth (Passport.js) |
| Hosting | Vercel (frontend) + Render (backend) |

---

## Features

- Generate food product descriptions in 3 tones using Gemini AI
- Save and manage products (full CRUD)
- Auto-save every AI-generated description to history
- Regenerate a description and compare old vs. new before keeping one
- User accounts — email/password registration and login, plus GitHub OAuth
- Secure, httpOnly-cookie-based session handling
- Soft delete with an Undo option on product removal
- Dark / light mode toggle
- RESTful API with search support

---

## Database

### Why MongoDB?

MongoDB was chosen over a relational database for the following reasons:

- **Flexible schema** — food product data varies widely; some products have weights, others don't. A document model handles this naturally without nullable columns.
- **JSON-native** — our Express API already works with JSON. MongoDB stores data in BSON (binary JSON), so there's no impedance mismatch between the API layer and the database.
- **Free hosted tier** — MongoDB Atlas M0 is free forever, making it ideal for an internship project with a ₹0 budget.
- **Mongoose ODM** — provides schema validation, timestamps, and query helpers on top of MongoDB's flexibility.

### Schema Diagram

![NutriWrite AI Schema Diagram](./docs/W5_SchemaDiagram.png)

### Collections

**User**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | Primary key |
| `email` | String | ✅ | Unique |
| `password` | String | ❌ | Hashed; not set for OAuth-only accounts |
| `name` | String | ❌ | |
| `githubId` | String | ❌ | Set for GitHub OAuth accounts |
| `avatar` | String | ❌ | |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Product**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | ✅ | Product name |
| `ingredients` | String | ✅ | Comma-separated ingredients |
| `weight` | String | ❌ | e.g. "100g" |
| `features` | String | ❌ | Key selling points |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**GeneratedDescription**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | Primary key |
| `productName` | String | ✅ | Name at time of generation |
| `ingredients` | String | ✅ | Ingredients at time of generation |
| `weight` | String | ❌ | |
| `features` | String | ❌ | |
| `tone` | String | ✅ | One of: premium, traditional, health-focused |
| `description` | String | ✅ | AI-generated text |
| `product` | ObjectId | ❌ | FK reference to Product (optional) |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### Relationship

A `Product` can have zero or many `GeneratedDescription` records linked to it via the `product` field. The link is optional — descriptions can be generated without saving a product first.

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in with email/password |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/auth/me` | Get the currently logged-in user |
| GET | `/api/auth/github` | Start GitHub OAuth flow |
| GET | `/api/auth/github/callback` | GitHub OAuth callback |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?q=` search) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product (auth required) |
| PUT | `/api/products/:id` | Update product (auth required) |
| DELETE | `/api/products/:id` | Delete product (auth required) |

### Generate

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate AI description |
| GET | `/api/generate/history` | Get all past generations |

---

## Project Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free M0 tier)
- Google Gemini API key (from [aistudio.google.com](https://aistudio.google.com/apikey))
- A GitHub OAuth App (for GitHub login) — create one at [github.com/settings/developers](https://github.com/settings/developers)

### 1. Clone the repository

```bash
git clone https://github.com/Shivani-360/NutriWrite-AI.git
cd NutriWrite-AI
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (never commit this) — see [Environment Variables](#environment-variables) below for the full list.

Start the backend:

```bash
npm run dev
```

You should see:
```
✅ Server running on http://localhost:5000
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 4. Set up the database

1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Under **Network Access**, allow connections from `0.0.0.0/0`
4. Get your connection string and paste it into `backend/.env` as `MONGODB_URI`
5. The `nutriwrite` database and collections are created automatically when you first write data — no manual migration needed

---

## Environment Variables

**Backend** (`backend/.env`):

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=a_long_random_string
SESSION_SECRET=a_different_long_random_string
FRONTEND_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

In production (Render/Vercel), the same variables are set via each platform's dashboard rather than a `.env` file, with `FRONTEND_URL`/`NEXT_PUBLIC_API_URL`/`GITHUB_CALLBACK_URL` pointing at the live URLs and `NODE_ENV=production`.

---

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com), built from the `frontend/` directory.
- **Backend** is deployed on [Render](https://render.com), built from the `backend/` directory.
- **Database** is hosted on MongoDB Atlas.

### Known Limitations (Free Tier)

- Render's free web service spins down after 15 minutes of inactivity — the first request after that can take 30–60 seconds.
- GitHub OAuth login currently works reliably in Microsoft Edge; a browser-specific cookie-handling issue affecting Chrome is being investigated.

---

## Roadmap

- [x] Week 1–2: Project setup, Next.js frontend skeleton
- [x] Week 3–4: UI components, dark/light mode, backend REST API
- [x] Week 5: MongoDB/Mongoose integration, schema design
- [x] Week 6: Authentication (JWT + GitHub OAuth)
- [x] Week 7: Gemini AI integration polish
- [x] Week 8: Frontend–backend integration
- [x] Week 9: Deployment (Vercel + Render)
- [ ] Week 10: Capstone polish

---

## Author

**Shivani Rajput**  
AI-Assisted Full Stack Web Development Internship