# 📋 Taskly — Full-Stack Kanban & Task Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS_10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
</p>

---

## 📖 Overview

**Taskly** is a modern, enterprise-grade task management and Kanban platform. Originally evolved from a simple MERN to-do list, Taskly has been systematically refactored into a strongly-typed, production-hardened full-stack application featuring:

- **Backend**: **NestJS 10** + **TypeScript** with modular architecture, declarative DTO validation, and **Prisma 7 ORM** (`@prisma/adapter-pg` native driver adapter) running on **PostgreSQL**.
- **Frontend**: **React 19** + **TypeScript** + **Tailwind CSS v4** + **Vite**, featuring an interactive 3-column Kanban board, native HTML5 drag-and-drop, Task Insights analytics, and customizable color-coded labels.
- **Infrastructure as Code**: Root-level **Render Blueprint** (`render.yaml`) automating deployment across managed PostgreSQL, NestJS Web Service, and Vite Static Site.

---

## 📜 Agentic Workflow & Architecture Documentation

Every architectural change, phased migration, and design decision is documented in the version-controlled `.agent/` documentation suite:

- 🏛️ **[Architectural Decisions Log (`.agent/prompts/decisions.md`)](.agent/prompts/decisions.md)**  
  Detailed records of all 13 formal architectural decisions (NestJS modular structure, Prisma 7 driver adapter, boundary DTO validation, React 19 Kanban, native HTML5 drag-and-drop, Task Insights analytics, normalized tag modeling, Render Blueprint, etc.).
- 📜 **[Prompt History & Audit Trail (`.agent/prompts/prompt-history.md`)](.agent/prompts/prompt-history.md)**  
  Chronological audit trail detailing user instructions, agent interpretations, exact actions taken, files modified, verification commands executed, and results across all development phases.
- 📊 **[Current Project Status (`.agent/status.md`)](.agent/status.md)**  
  Live status of completed features, active verification gates, and next recommended actions.
- 🧠 **[System Architecture & Blueprint (`.agent/context.md`)](.agent/context.md)**  
  Comprehensive technical specifications, entity models, REST API specifications, and component hierarchies.

---

## ✨ Features

### 📌 Interactive 3-Column Kanban Board
- Organize tasks across **To Do**, **In Progress**, and **Done** status columns.
- **Native HTML5 Drag-and-Drop**: Drag task cards between columns with automatic state reconciliation and optimistic UI updates with automatic failure rollback.
- Quick status dropdown selector directly on each card.

### 📊 Task Insights Analytics Dashboard
- **Real-Time Derived Metrics**: Total Tasks, Completed, In Progress, To Do, Completion Rate (%) with an animated Tailwind progress bar.
- **Overdue Task Tracking**: Identifies overdue tasks with actionable alert indicators (completed tasks are strictly excluded).
- **Priority Distribution Breakdown**: Visual indicator counts for Low, Medium, and High priority items (invariant: `low + medium + high === total`).
- 100% computed in-memory via `useMemo` with zero network overhead.

### 🏷️ Customizable Tags & Category Labels
- **Normalized Relational Model**: Stored in PostgreSQL with unique names and color codes, linked to tasks via Prisma implicit many-to-many relationship (`_TagToTask` with `ON DELETE CASCADE`).
- **Color-Coded Pills**: Visual badges with subtle tinted backgrounds, borders, and color dots on cards.
- **Tag Manager Modal**: Dedicated interface to create, preview, edit, and delete tags using curated swatches or native color pickers.
- **Task Modal Integration**: Select multiple tags or create new tags on-the-fly during task creation or editing.

### 🔍 Unified Multi-Filter Toolbar
- **Real-Time Title Search**: Instant, client-side case-insensitive text matching.
- **Composed AND Logic**: Filter simultaneously by Search Query + Priority (`LOW`, `MEDIUM`, `HIGH`) + Status (`TODO`, `IN_PROGRESS`, `DONE`) + Tag.
- Active filter counter and single-click **Reset Filters** button.

### 🛡️ Production-Hardened Security & Validation
- **Boundary Validation**: Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.
- **UUID Protection**: All route parameters strictly validated via NestJS `ParseUUIDPipe` (returns 400 Bad Request on malformed IDs).
- **Zero Secrets in Git**: Enforced via multi-level `.gitignore` rules (root, backend, frontend).

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (Browser)"]
        UI["React 19 + TypeScript (Vite)"]
        KB["Kanban Board (HTML5 Drag & Drop)"]
        TI["Task Insights Analytics (useMemo)"]
        TB["Multi-Filter Toolbar (AND Logic)"]
        TM["Tag Manager & Modals"]
    end

    subgraph Backend ["Backend API Layer (NestJS 10)"]
        Main["main.ts (Global Prefix /api, CORS, ValidationPipe)"]
        TasksCtrl["TasksController (/api/tasks)"]
        TagsCtrl["TagsController (/api/tags)"]
        TasksSvc["TasksService (Business Logic)"]
        TagsSvc["TagsService (Tag Management)"]
        PrismaSvc["PrismaService (@prisma/adapter-pg + pg.Pool)"]
    end

    subgraph Database ["Persistence Layer (PostgreSQL)"]
        DB[("PostgreSQL 16")]
        T_Tasks["tasks table (UUID, status, priority, dueDate)"]
        T_Tags["tags table (UUID, name unique, color)"]
        T_Join["_TagToTask join table (CASCADE)"]
    end

    UI -->|HTTP Requests / JSON| Main
    Main --> TasksCtrl
    Main --> TagsCtrl
    TasksCtrl --> TasksSvc
    TagsCtrl --> TagsSvc
    TasksSvc --> PrismaSvc
    TagsSvc --> PrismaSvc
    PrismaSvc --> DB
    DB --> T_Tasks
    DB --> T_Tags
    DB --> T_Join
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v20+ (v22 LTS recommended)
- **PostgreSQL**: v14+ running locally or in Docker
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/vedant48/mern-task-manager.git
cd mern-task-manager
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Copy the example environment file and configure your local PostgreSQL connection string:
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"
```

Run Prisma migrations and generate the client:
```bash
npx prisma migrate dev
npx prisma generate
```

Start the NestJS development server:
```bash
npm run start:dev
```
The backend API is now running at `http://localhost:5000/api`.

### 3. Configure Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to explore Taskly!

---

## 📡 REST API Reference

All endpoints are mounted under the `/api` global prefix.

### Tasks (`/api/tasks`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | List all tasks with associated tags | None |
| `GET` | `/api/tasks/:id` | Get single task by UUID | None |
| `POST` | `/api/tasks` | Create task | `{ title, status?, priority?, dueDate?, tagIds? }` |
| `PUT` | `/api/tasks/:id` | Update task fields / status / tags | `{ title?, status?, completed?, priority?, dueDate?, tagIds? }` |
| `DELETE` | `/api/tasks/:id` | Delete task by UUID | None |

### Tags (`/api/tags`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tags` | List all tags | None |
| `GET` | `/api/tags/:id` | Get single tag by UUID | None |
| `POST` | `/api/tags` | Create tag (unique name, hex color) | `{ name, color? }` |
| `PUT` | `/api/tags/:id` | Update tag name or color | `{ name?, color? }` |
| `DELETE` | `/api/tags/:id` | Delete tag (cascades from tasks) | None |

---

## ☁️ Production Deployment (Render Blueprint)

The entire full-stack application is defined as Infrastructure as Code in [`render.yaml`](render.yaml).

### Architecture on Render:
1. **`taskly-db`**: Managed PostgreSQL database (`taskmanager`).
2. **`taskly-backend`**: Node.js Web Service running NestJS (`rootDir: backend`, port `10000`).
3. **`taskly-frontend`**: Static Site running Vite SPA (`rootDir: frontend`, publish `./dist`, rewrite `/* -> /index.html`).

### Deploy in 3 Steps:
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
3. Select your repository. Render automatically provisions the PostgreSQL database, executes migrations via `npx prisma migrate deploy`, builds the NestJS web service, and compiles the Vite static site.

---

## 🧪 Quality Assurance & Verification

Every phase satisfies rigorous automated verification:

```bash
# Backend Verification
cd backend
npx prisma validate       # Verifies schema integrity
npx prisma migrate status   # Verifies database migration synchronization
npm run build              # Runs prisma generate && nest build

# Frontend Verification
cd ../frontend
npx tsc --noEmit           # Strict TypeScript type-checking
npm run build              # Production Vite bundle build
npm run lint               # ESLint verification with zero warnings
```

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.
