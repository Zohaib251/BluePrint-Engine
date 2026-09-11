<div align="center">

# ⚡ Blueprint Engine

### Automated Software Architecture, Database Schema & Master PRD Generator

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon.tech-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Flash_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Blueprint Engine</b> bridges the divide between non-technical founders, product managers, and engineering teams.
  <br />
  Transform rough concepts into production-grade, 5-module technical architecture blueprints, interactive Mermaid.js system diagrams, complete database schemas, and structured documentation in seconds.
</p>

[Key Features](#-key-features) • [Architecture](#-architecture--tech-stack) • [Quick Start](#-quick-start-guide) • [Security](#-enterprise-grade-security) • [Deployment](#-render-deployment) • [API Reference](#-api-endpoints)

---

</div>

## 🌟 Key Features

### 📐 5-Module Master Blueprint Generation
Every generated blueprint follows a rigorous 5-module architectural standard:
- **Module 1: Product Requirements Document (PRD)**
  - Executive summary and core value proposition.
  - Scope Matrix: Prioritized MVP scope (P0 Critical) vs. Phase 2 enhancements (P1 High).
  - User Stories with binary, testable Acceptance Criteria.
- **Module 2: Traffic-Driven Infrastructure & Scaling**
  - Concrete hosting tier recommendations tailored to expected monthly active users (MAU).
  - Caching & global edge CDN strategies (e.g., Redis, Cloudflare, Memcached).
  - High-availability guidelines, performance latency targets (<300ms), and automated backup cadences.
- **Module 3: Budget-Optimized Tech Stack Selection**
  - Curated frontend, backend, database, and third-party tools optimized for targeted budget constraints.
  - Line-by-line itemized monthly operational cost estimation table.
- **Module 4: Information Architecture & Database Blueprint**
  - Sitemap route hierarchy with explicit authentication access controls.
  - Complete database relational table schema with column constraints, data types, and indexes.
  - RESTful API endpoints specification.
  - Interactive, rendered **Mermaid.js** architecture flowcharts.
- **Module 5: Engineering Runbook & Milestone Execution Plan**
  - Sequential development milestone roadmap breaking down technical implementation into actionable task phases.

---

### 🛡️ Enterprise-Grade Security & Anti-Tamper Protection
- **Client-Side Anti-Inspection Shield (`SecurityProvider`)**:
  - Global capture-phase blocking of right-click (`contextmenu`) across all input fields, textareas, and application pages.
  - Interception and lockout of Developer Tools keyboard shortcuts (`F12`, `Ctrl+Shift+I/J/C/K/E`, `Cmd+Opt+I/J/C/K/E`, `Ctrl+U`, `Ctrl+S`).
  - Active DevTools docked window detection that triggers anti-tamper security alerts and blurs active input fields to prevent live memory or DOM scraping.
  - Hardened input attributes (`secureInputProps`) disabling unauthorized drag/drop, browser autofill credential snooping, and spellcheck sniffing.
- **Backend Defense-in-Depth**:
  - **Cryptographic Token Security**: PyJWT token issuance with automatic 32-byte cryptographic key generation in production.
  - **Rate Limiting (`SlowAPI`)**: Enforces rate limits on authentication and AI generation endpoints (`/api/prd/generate`, `/api/auth/*`).
  - **Strict HTTP Security Headers**: HSTS (`max-age=31536000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive `Permissions-Policy`.
  - **Strict XSS Isolation**: Mermaid diagram rendering isolated under `securityLevel: "strict"`.
  - **Input Sanitization & Injection Prevention**: Pydantic v2 validators strip script injection vectors and cap brief lengths.
  - **Error Traceback Masking**: Raw database or internal exceptions are never leaked in client 500 error responses.

---

### 📑 High-Fidelity Multi-Format Export
- **Vector PDF Export**: One-click generation of beautifully formatted PDFs using `jsPDF` and `jspdf-autotable`, complete with embedded vector-rasterized Mermaid diagrams and structured data tables.
- **Structured Markdown Export**: Instant copyable GitHub-flavored Markdown for integration into engineering wikis, Jira, or Notion.

---

### ⚡ Automated 30-Day Data Pruning & Quotas
- **Automated Lifecycle Maintenance**: Asynchronous background daemon runs daily to prune non-admin PRD history records older than 30 days, optimizing database capacity.
- **Role-Based Quotas**:
  - **Standard Users**: Capped at 5 blueprint generations per calendar month.
  - **Admin Accounts**: Unlimited generation access, platform analytics dashboard, and on-demand manual pruning triggers.

---

## 🏗 Architecture & Tech Stack

```
Blueprint-Engine/
├── backend/                  # FastAPI Python Service
│   ├── routers/              # API Route Controllers (Auth, PRD, Admin)
│   ├── ai_service.py         # Google Gemini Flash AI Engine + Tenacity Retries
│   ├── auth.py               # OAuth2 Bearer & JWT Dependencies
│   ├── config.py             # Centralized Environment & CORS Policy
│   ├── database.py           # Async SQLAlchemy Engine & Session Factory
│   ├── init_db.py            # DB Schema Migration & Admin Seeder
│   ├── limiter.py            # SlowAPI In-Memory Rate Limiter
│   ├── models.py             # SQLAlchemy Relational ORM Models
│   ├── pruning.py            # Async 30-Day Data Pruning Daemon
│   ├── requirements.txt      # Python Dependencies (with greenlet & asyncpg)
│   └── schemas.py            # Pydantic v2 Validation & Strict JSON Schemas
├── frontend/                 # Next.js 14 App Router (TypeScript + Tailwind)
│   ├── src/
│   │   ├── app/              # Next.js Pages (Landing, Auth, Dashboard, Admin)
│   │   ├── components/       # UI Components (SecurityProvider, Mermaid, PRDViewer)
│   │   ├── context/          # React Authentication Context Provider
│   │   └── lib/              # Typed API Client & Export Utilities
├── render.yaml               # Infrastructure as Code for Render PaaS Deployment
└── .gitignore                # Airtight Git Security Exclusion Configuration
```

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | Server-Side Rendering, Static Generation & Client Hydration |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Responsive Dark Slate Aesthetic & Modern Micro-animations |
| **Diagram Engine** | Mermaid.js | Dynamic Client-Side System Architecture Flowcharting |
| **Export Engines** | jsPDF + jspdf-autotable | High-Resolution PDF Blueprint Export |
| **Backend Framework** | FastAPI (Python 3.10+) | Asynchronous High-Performance REST API |
| **AI LLM Engine** | Google Gemini (3.5 Flash-Lite) | Structured JSON Blueprint Reasoning & Schema Synthesis |
| **Database ORM** | SQLAlchemy 2.0 (Asyncio) | Type-Safe Relational Database Modeling |
| **DB Driver & DB** | AsyncPG + Neon.tech PostgreSQL | Serverless Cloud PostgreSQL with Connection Pooling |
| **Security & Auth** | PyJWT + Bcrypt | Cryptographic Password Hashing & Access Token Handling |
| **Traffic Limiter** | SlowAPI | IP-Based Endpoint Rate Limiting |
| **Deployment Orchestration**| Render Blueprint (`render.yaml`) | Unified PaaS Cloud Infrastructure Deployment |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher & `npm`
- **Database**: Cloud PostgreSQL (e.g. [Neon.tech](https://neon.tech)) or local PostgreSQL
- **Google AI API Key**: Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Copy .env.example to .env
cp .env.example .env    # Linux / macOS
copy .env.example .env  # Windows
```

Edit `backend/.env` with your credentials:
```env
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000

# Neon.tech Async PostgreSQL Connection String
DATABASE_URL=postgresql+asyncpg://<USER>:<PASSWORD>@<HOST>/<DATABASE>?ssl=require

# JWT Authentication Configuration
JWT_SECRET_KEY=generate_a_secure_32_character_random_string_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Google Gemini API Key and Model
GEMINI_API_KEY=AIzaSyYourGeneratedGeminiApiKeyHere
GEMINI_MODEL=gemini-3.5-flash-lite

# Optional Custom Admin Credentials
ADMIN_USERNAME=ZohaibAli
ADMIN_PASSWORD=hellfire123
```

```bash
# 5. Initialize database tables and seed default admin
python init_db.py

# 6. Launch the FastAPI server
uvicorn main:app --reload --port 8000
```
> **Backend API**: `http://localhost:8000`  
> **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2. Frontend Setup

Open a **second terminal window**:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env.local
cp .env.example .env.local    # Linux / macOS
copy .env.example .env.local  # Windows
```

Ensure `frontend/.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# 4. Start the Next.js development server
npm run dev
```
> **Frontend App**: `http://localhost:3000`

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account | 5 / min |
| `POST` | `/api/auth/signin` | Authenticate user and issue JWT Bearer token | 5 / min |
| `GET` | `/api/auth/me` | Fetch authenticated user profile and quota usage | None |

### 📐 PRD & Blueprint Generation (`/api/prd`)
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/prd/generate` | Synthesize full 5-module blueprint via Gemini AI | 10 / min |
| `POST` | `/api/prd` | Save a custom PRD document manually | 20 / min |
| `GET` | `/api/prd` | List all blueprints created by authenticated user | None |
| `GET` | `/api/prd/{prd_id}` | Retrieve specific blueprint by ID | None |
| `DELETE` | `/api/prd/{prd_id}` | Delete specific blueprint by ID | None |

### 🛠️ Admin Control Panel (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics` | View system statistics, user lists, and PRD totals | `admin` only |
| `POST` | `/api/admin/prune` | Manually trigger 30-day expired data cleanup | `admin` only |

### 🩺 Health & Diagnostics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status, environment mode, and CORS origins |

---

## 🌐 Render Deployment

Blueprint Engine is pre-configured for automated **1-click Blueprint Deployment** on Render via [render.yaml](render.yaml).

### Steps to Deploy:
1. Push your repository to **GitHub**.
2. Navigate to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** ➡️ **Blueprint**.
4. Select your `Blueprint-Engine` GitHub repository.
5. Render reads `render.yaml` and spins up two services:
   - **`blueprint-engine-backend`**: Python web service running `uvicorn main:app --host 0.0.0.0 --port $PORT`.
   - **`blueprint-engine-frontend`**: Node web service running `npm install && npm run build` and `npm start`.
6. Add the secret environment variables in the Render console:
   - `DATABASE_URL`: Your Neon.tech connection URI.
   - `GEMINI_API_KEY`: Your Google AI Studio key.
   - `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Your chosen admin credentials.
7. Click **Apply** — Render automatically builds, links, and launches both services.

---

## 🔒 Security Best Practices

- **Never Commit Credentials**: All `.env` files, `.key`, `.pem`, and database credentials are excluded via an airtight `.gitignore`.
- **Secret Isolation**: In production, `JWT_SECRET_KEY` automatically initializes a cryptographically random token if not provided.
- **Client-Side Anti-Tamper**: DevTools detection and inspect element disabling prevent trivial scraping of active forms and sensitive token states.
- **Input Validation**: All payloads pass through Pydantic v2 schemas stripping script tags, null bytes, and malicious characters.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for modern software architects and engineering teams.</sub>
</div>
