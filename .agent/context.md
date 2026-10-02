# Project Context

## Project Goal
A modern, production-grade task management system evolved from a basic MERN demonstration into a TaskFlow-inspired Kanban workflow platform with real-time analytics, robust type safety, and relational data persistence.

## Original Repository & Source
- Current Workspace Repository: `https://github.com/vedant48/mern-task-manager.git`
- Upstream Reference / Original Source: `https://github.com/lovnishverma/mern-task-manager.git`
- Baseline Tag: `baseline-original` (created on branch `main` at commit `2e4ccdc`)
- Active Feature Branch: `feat/taskflow-migration`
- Product Reference: TaskFlow (`https://github.com/parthlashkari/taskflow`) for Kanban UX, native drag-and-drop, priority tags, and clean modal interactions.

## Current Architecture (Post Phase 1)
- **Monorepo Structure**: Two decoupled subprojects in a single repository:
  - `frontend/`: React 19 Single Page Application (untouched in Phase 1).
  - `backend/`: NestJS TypeScript application foundation.
- **Backend Architecture (NestJS Foundation)**:
  - Runtime: Node.js `v24.21.0` with TypeScript `^5.7.2` compiled to CommonJS via `@nestjs/cli`.
  - Server Entry Point: `backend/src/main.ts` listening on `0.0.0.0` at `process.env.PORT || 5000`.
  - Global API Prefix: `api` configured via `app.setGlobalPrefix('api')`.
  - CORS: Configured in `main.ts` with `credentials: true` and all standard REST methods enabled.
  - Module Structure:
    - `AppModule` (`backend/src/app.module.ts`): Root application module.
    - `TasksModule` (`backend/src/tasks/tasks.module.ts`): Feature module for task domain.
    - `TasksController` (`backend/src/tasks/tasks.controller.ts`): Exposes REST routes at `/api/tasks`.
    - `TasksService` (`backend/src/tasks/tasks.service.ts`): Service layer managing task boundaries (persistence deferred to Phase 2).
  - Obsolete Express Artifacts: Removed `server.js`, `routes/taskRoutes.js`, and `models/Task.js`.
  - Persistence Status: Mongoose removed; Prisma ORM and PostgreSQL integration scheduled for Phase 2.
- **Frontend Architecture**:
  - Runtime/Bundler: Vite 7 (`7.1.2`).
  - Framework: React 19 (`19.1.1`), React DOM (`19.1.1`).
  - Styling: Tailwind CSS v4 (`4.1.13`) via `@tailwindcss/vite` and `@import "tailwindcss";` in `frontend/src/index.css`.
  - State Management: Component-local state via React `useState` hooks in `App.jsx` and `AddTask.jsx`. No centralized store.
  - Client Networking: Axios (`1.11.0`) in `frontend/src/api.js`.
  - Component Tree:
    - `main.jsx` (mounts `App` into `#root` inside `StrictMode`)
    - `App.jsx` (holds `tasks` state; manages CRUD callbacks)
      - `AddTask.jsx` (controlled form with title input)
      - `TaskList.jsx` (renders list, toggles completion, handles deletion)
- **Database Architecture**:
  - Current Status: Disconnected from MongoDB. Transitioning to PostgreSQL via Prisma in Phase 2.
- **Communication Protocol**:
  - RESTful JSON API over HTTP.
  - Resource path: `/api/tasks`.

---

## Target Architecture (Planned Evolution)

### 1. Technology Stack
- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS v4.
- **Backend**: NestJS (TypeScript, modular dependency injection, class-validator DTOs, global exception filter).
- **ORM / Data Layer**: Prisma ORM v6 with declarative schema migrations and strongly-typed Prisma Client.
- **Database**: PostgreSQL (relational database).
- **Hosting / Deployment Target**: Render (Backend Web Service running NestJS Node runtime; Frontend Static Site on Render CDN).

### 2. Product Experience & Features
- **Kanban Board**: 3 workflow columns: `To Do` (`TODO`), `In Progress` (`IN_PROGRESS`), and `Done` (`DONE`).
- **Native HTML5 Drag-and-Drop**: Fluid card movement between columns without external bulky DnD libraries.
- **Task Attributes**: Title, optional description, priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), category tags (`String[]`), and due dates (`DateTime`).
- **Search & Filter Bar**: Real-time title search, priority filtering, and tag filtering.
- **Task Insights / Analytics Dashboard**:
  - Total tasks count
  - Completed tasks count
  - In-progress tasks count
  - Overdue tasks count
  - Completion percentage progress indicator
  - Task counts broken down by priority level
- **Full Modal CRUD**: Modal-driven creation, inline/modal editing, and safe deletion confirmation.

### 3. Database Design (PostgreSQL / Prisma)
```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model Task {
  id          String        @id @default(uuid())
  title       String        @db.VarChar(255)
  description String?       @db.Text
  status      TaskStatus    @default(TODO)
  priority    TaskPriority  @default(MEDIUM)
  tags        String[]      @default([])
  dueDate     DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([status])
  @@index([priority])
  @@index([dueDate])
  @@index([createdAt])
  @@map("tasks")
}
```

#### Field Specifications:
- `id` (`String`, UUID, Primary Key): Non-null, default `uuid()`. Standardized entity identifier replacing MongoDB `_id`.
- `title` (`String`, `VarChar(255)`): Non-null, validated min 1 character.
- `description` (`String?`, `Text`): Nullable optional description for detailed card context.
- `status` (`TaskStatus` enum): Non-null, default `TODO`. Indexed for Kanban column segmentation.
- `priority` (`TaskPriority` enum): Non-null, default `MEDIUM`. Indexed for priority filtering and analytics aggregation.
- `tags` (`String[]` array): Non-null scalar array in PostgreSQL, default `[]`. Enables categorization (e.g. Frontend, Backend, Urgent).
- `dueDate` (`DateTime?`): Nullable timestamp. Indexed for overdue calculations (`dueDate < now() && status != DONE`).
- `createdAt` (`DateTime`): Non-null, default `now()`.
- `updatedAt` (`DateTime`): Non-null, auto-updated timestamp on modification.

### 4. Target API Contract
Base path: `/api/tasks`

| Method | Endpoint | Description | Request Body / Query | Success Response | Error Cases |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | List tasks with optional query filters | Query: `search?`, `status?`, `priority?`, `tag?`, `sortBy?`, `sortOrder?` | `200 OK` -> `TaskDto[]` | `400 Bad Request` (invalid query params) |
| `POST` | `/api/tasks` | Create a new task | Body: `CreateTaskDto` (`title`, `description?`, `status?`, `priority?`, `tags?`, `dueDate?`) | `201 Created` -> `TaskDto` | `400 Bad Request` (validation error) |
| `GET` | `/api/tasks/:id` | Get task details by ID | Param: `:id` (UUID) | `200 OK` -> `TaskDto` | `400 Bad Request` (invalid UUID), `404 Not Found` |
| `PUT` | `/api/tasks/:id` | Full or partial update of task fields | Param: `:id` (UUID)<br>Body: `UpdateTaskDto` | `200 OK` -> `TaskDto` | `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/api/tasks/:id/status` | Fast status transition (drag-and-drop) | Param: `:id` (UUID)<br>Body: `UpdateTaskStatusDto` (`status`) | `200 OK` -> `TaskDto` | `400 Bad Request` (invalid status), `404 Not Found` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | Param: `:id` (UUID) | `200 OK` -> `{ "message": "Task deleted successfully" }` | `400 Bad Request` (invalid UUID), `404 Not Found` |
| `GET` | `/api/tasks/analytics` | Get aggregate task metrics and insights | None | `200 OK` -> `TaskInsightsDto` | `500 Internal Server Error` |

### 5. Frontend Component Hierarchy
```
AppShell
├── Header
│   ├── Logo & Title ("TaskFlow Kanban")
│   └── Actions ("+ New Task", ThemeToggle)
├── TaskInsights (collapsible / persistent analytics bar)
│   ├── StatCard (Total, Completed, In Progress, Overdue)
│   ├── ProgressBar (Visual completion percentage)
│   └── PriorityBreakdown (Pill counts by priority)
├── FilterBar
│   ├── SearchInput (instant title filter)
│   ├── PriorityFilter (All, Low, Medium, High, Urgent)
│   ├── TagFilter (Dynamic list of existing tags)
│   └── ClearFiltersButton
├── KanbanBoard (HTML5 drag & drop container)
│   ├── KanbanColumn (id: "TODO", title: "To Do", badge: count)
│   │   └── TaskCard[] (draggable, priority badge, tags, due date, actions)
│   ├── KanbanColumn (id: "IN_PROGRESS", title: "In Progress", badge: count)
│   │   └── TaskCard[]
│   └── KanbanColumn (id: "DONE", title: "Done", badge: count)
│       └── TaskCard[]
├── TaskModal (dialog for Create and Edit)
│   └── TaskForm (title, description, status, priority, tag input chips, due date picker)
├── ConfirmDeleteModal (accessible alert dialog to confirm task deletion)
└── ToastNotification / ErrorBanner (for user feedback on network failure)
```

### 6. State Management Strategy
- **Server State**: Managed via a dedicated `useTasks` and `useTaskAnalytics` custom hook layer:
  - Fetches tasks and analytics on mount.
  - Exposes mutation methods (`createTask`, `updateTask`, `updateStatus`, `deleteTask`).
  - Supports optimistic UI updates during drag-and-drop status transitions for instant responsiveness, with automatic rollback if the API responds with an error.
  - Manages `isLoading` and `error` states cleanly.
- **Local Client State**:
  - `searchQuery` (`string`): local search filter state.
  - `selectedPriority` (`string | null`): filter criteria.
  - `selectedTag` (`string | null`): filter criteria.
  - `modalState`: `{ isOpen: boolean, mode: 'create' | 'edit', initialData?: Task }`.
  - `deleteModalState`: `{ isOpen: boolean, taskId?: string }`.
  - `draggedTaskId` (`string | null`): tracks active card being dragged.
- No heavy global state management library (Redux / Zustand) is required.

---

## Important Constraints
- **Zero Premature Code Changes**: Application source code must not be modified outside the current authorized phase.
- **Strict Documentation Isolation**: `.agent/` documentation must remain strictly isolated from application code. Application code must never import anything from `.agent/`.
- **Security & Privacy**: Secrets, environment credentials, database connection URIs with credentials, passwords, and API keys must never be committed or written to documentation.
- **Verification Integrity**: No verification, test, or build may be documented as passing unless it has actually been executed.
- **Platform**: Windows environment with PowerShell shell.

## Deployment Target
- Documented Target: Render (Backend Web Service + Frontend Static Site).
  - Backend Web Service: NestJS app (`npm run build`, `npm run start:prod`, running on dynamic `PORT`).
  - Frontend Static Site: React + Vite (`npm run build`, output: `dist`).
  - Database: Hosted PostgreSQL on Render or compatible cloud PostgreSQL provider (`DATABASE_URL`).
