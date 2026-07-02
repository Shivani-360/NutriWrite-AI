# NutriWrite AI

An AI-powered tool that helps food businesses generate professional product descriptions in three tones — **Premium**, **Traditional**, and **Health-Focused** — using Google Gemini AI.

Built as part of a 9-week AI-Assisted Full Stack Web Development internship.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini API (gemini-2.0-flash) |

---

## Features

- Generate food product descriptions in 3 tones using Gemini AI
- Save and manage products (full CRUD)
- Auto-save every AI-generated description to history
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

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?q=` search) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

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

Create a `.env` file in the `backend/` folder (never commit this):

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nutriwrite?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
node server.js
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

See `backend/.env.example` for the full list of required variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Roadmap

- [x] Week 1–2: Project setup, Next.js frontend skeleton
- [x] Week 3–4: UI components, dark/light mode, backend REST API
- [x] Week 5: MongoDB/Mongoose integration, schema design
- [ ] Week 6: Authentication (JWT)
- [ ] Week 7: Gemini AI integration polish
- [ ] Week 8: Frontend–backend integration
- [ ] Week 9: Deployment (Vercel + Render)
- [ ] Week 10: Capstone polish

---

## Author

**Shivani Rajput**  
AI-Assisted Full Stack Web Development Internship