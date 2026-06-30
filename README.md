# 🥗 NutriWrite AI

An AI-powered full-stack web application that helps food businesses automatically generate professional product descriptions using Google Gemini AI.

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **AI:** Google Gemini API (gemini-1.5-flash — free tier)

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/Shivani-360/NutriWrite-AI.git
cd NutriWrite-AI
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_key_here
PORT=5000
```

> Get a free Gemini API key at: https://aistudio.google.com/app/apikey

Start backend:
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

---

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features and how it works |
| Generate | `/generate` | Main AI description generator |
| Dashboard | `/dashboard` | View and manage products |
| About | `/about` | Project info and tech stack |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate AI product description |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products?q=` | Search products |

## Features

- ✅ AI-powered product description generation (Gemini)
- ✅ 3 writing tones: Premium, Traditional, Health-Focused
- ✅ One-click copy
- ✅ Regenerate descriptions
- ✅ Dark mode / Light mode with persistence
- ✅ Product dashboard with search
- ✅ Responsive design
- ✅ Quick-fill example products

## Roadmap

- [ ] MongoDB database integration
- [ ] User authentication (JWT)
- [ ] Product history & saved descriptions
- [ ] Export as PDF / DOCX
- [ ] Bulk CSV upload
- [ ] Multi-language support
- [ ] Deployment (Vercel + Render)
