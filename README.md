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
  <b>Blueprint Engine</b> transforms product concepts into comprehensive, production-ready technical architecture blueprints, interactive Mermaid.js system flowcharts, relational database schemas, and structured documentation in seconds.
</p>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Overview](#-api-overview) • [License](#-license)

---

</div>

## 🌟 Key Features

### 📐 5-Module Master Blueprint
- **Module 1: Product Requirements Document (PRD)**
  - Executive summary and strategic value proposition.
  - Scope Matrix: MVP (P0 Critical) vs. Phase 2 roadmap (P1 High).
  - User Stories with binary, testable Acceptance Criteria.
- **Module 2: Traffic-Driven Infrastructure & Scaling**
  - Concrete hosting tier recommendations tailored to target monthly active users (MAU).
  - Caching & global edge CDN strategies (Redis, Cloudflare, etc.).
  - High-availability targets, performance latency benchmarks (<300ms), and automated backup cadences.
- **Module 3: Budget-Optimized Tech Stack Selection**
  - Balanced frontend, backend, database, and infrastructure tooling matching targeted budget tiers.
  - Itemized monthly operational cost estimation table.
- **Module 4: Information Architecture & Database Blueprint**
  - Sitemap route hierarchy with explicit authentication access controls.
  - Complete database relational table schema with column constraints, data types, and indexes.
  - RESTful API endpoints specification.
  - Interactive, rendered **Mermaid.js** architecture flowcharts.
- **Module 5: Engineering Runbook & Milestone Roadmap**
  - Phased development milestones breaking down technical implementation into sequential tasks.

---

### 📑 Multi-Format Export
- **Vector PDF Export**: One-click generation of beautifully formatted PDFs using `jsPDF` and `jspdf-autotable`, with embedded vector-rasterized Mermaid diagrams and clean tables.
- **Markdown Export**: Instant copyable GitHub-flavored Markdown for easy sharing in engineering wikis, Jira, or Notion.

---

### 🛡️ Built-in Security & Anti-Tamper Protection
- **Client-Side Anti-Inspection Shield**:
  - Global context menu protection across input fields, forms, and pages.
  - Interception of Developer Tools shortcuts (`F12`, `Ctrl+Shift+I/J/C/K/E`, `Cmd+Opt+I/J/C/K/E`, `Ctrl+U`, `Ctrl+S`).
  - Active DevTools open detection that blurs active input fields to prevent live memory or DOM scraping.
  - Hardened input attributes (`secureInputProps`) disabling drag/drop tampering and unauthorized autofill snooping.
- **Backend Defense-in-Depth**:
  - JWT token authentication with bcrypt password hashing.
  - IP-based rate limiting on sensitive and AI endpoints via `SlowAPI`.
  - Strict HTTP security headers (HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
  - Strict XSS isolation for dynamic Mermaid diagram rendering.
  - Input sanitization and length validation via Pydantic v2 schemas.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **Diagrams & Visuals** | Mermaid.js |
| **Export Engines** | jsPDF, jspdf-autotable |
| **Backend API** | FastAPI (Python 3.10+), Pydantic v2 |
| **AI LLM Engine** | Google Gemini (3.5 Flash-Lite) |
| **Database & ORM** | PostgreSQL (Neon.tech), SQLAlchemy 2.0 (Asyncio), AsyncPG |
| **Security & Rate Limiting** | PyJWT, Bcrypt, SlowAPI |

---

## 🚀 Getting Started

### Prerequisites
- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher & `npm`
- **PostgreSQL Database**: Cloud (e.g. [Neon.tech](https://neon.tech)) or local PostgreSQL
- **Google AI Studio Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 1. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate Python virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment file
# Copy .env.example to .env
cp .env.example .env    # Linux / macOS
copy .env.example .env  # Windows
```

Configure `backend/.env`:
```env
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000

# PostgreSQL Connection String (asyncpg driver required)
DATABASE_URL=postgresql+asyncpg://<USER>:<PASSWORD>@<HOST>/<DATABASE>?ssl=require

# JWT Authentication Configuration
JWT_SECRET_KEY=your_secure_random_32_character_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

```bash
# 5. Initialize database tables
python init_db.py

# 6. Run the backend development server
uvicorn main:app --reload --port 8000
```
> Backend API: `http://localhost:8000`  
> Interactive Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup

In a new terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Set up environment file
# Copy .env.example to .env.local
cp .env.example .env.local    # Linux / macOS
copy .env.example .env.local  # Windows
```

Ensure `frontend/.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# 4. Start Next.js development server
npm run dev
```
> Frontend Application: `http://localhost:3000`

---

## 📡 API Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account | 5 / min |
| `POST` | `/api/auth/signin` | Authenticate user and issue JWT Bearer token | 5 / min |
| `GET` | `/api/auth/me` | Fetch authenticated user profile and quota usage | None |

### PRD & Blueprint Generation (`/api/prd`)
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/prd/generate` | Synthesize complete 5-module blueprint via Gemini AI | 10 / min |
| `POST` | `/api/prd` | Save a custom PRD document manually | 20 / min |
| `GET` | `/api/prd` | List blueprints owned by authenticated user | None |
| `GET` | `/api/prd/{prd_id}` | Retrieve specific blueprint by ID | None |
| `DELETE` | `/api/prd/{prd_id}` | Delete specific blueprint by ID | None |

### Health Check
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service operational health and status check |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for modern software architects, founders, and engineering teams.</sub>
</div>
