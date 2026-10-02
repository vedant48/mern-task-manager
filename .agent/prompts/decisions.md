# Architectural & Technical Decisions

## Decision 1 — Establish Persistent Agentic Development Documentation in `.agent/`

### Context
As the project progresses through analysis, refactoring, feature work, and potential architectural evolution, a consistent, reproducible, and transparent development workflow is required. Without structured documentation, context is easily lost between sessions and prompt cycles.

### Options considered
1. **Ad-hoc in-chat instructions**: Rely only on chat context without persistent workspace files.
2. **Standard documentation in README**: Append workflow instructions directly to the user-facing `README.md`.
3. **Dedicated isolated workflow directory (`.agent/`)**: Maintain persistent context, status, skill references, and prompt records in a separate, isolated root folder.

### Decision
Adopt the dedicated `.agent/` folder structure containing `context.md`, `status.md`, `skills/*.md`, and `prompts/*.md`. Application code will remain strictly isolated and never import anything from `.agent/`.

### Reason
Provides clear separation between runtime application code and agent workflow tracking. Preserves an auditable record of instructions, architectural decisions, and repository status across sessions without polluting production assets.

### Consequences
- All subsequent prompts and architectural decisions must be recorded in `prompt-history.md` and `decisions.md`.
- Runtime code must never import or reference `.agent/`.
- Documentation remains auditable, version-controlled, and easily referenced.

---

## Decision 2 — Target Architecture & Product Evolution to NestJS, Prisma, PostgreSQL, and Kanban Experience

### Context
The baseline application is a minimal demonstration MERN app with a single flat task list, untyped JavaScript, inline Express routes, and MongoDB persistence. To evolve into an enterprise-ready, maintainable task management platform with rich workflow capabilities (To Do, In Progress, Done, priorities, tags, due dates, and analytics), the architecture requires robust type safety, modular boundaries, relational data integrity, and a TaskFlow-inspired user experience.

### Options considered
1. **Keep MERN Stack and expand features incrementally**: Continue with Express, JavaScript, and MongoDB, adding extra fields to Mongoose.
   - *Pros*: Familiarity, minimal architectural disruption.
   - *Cons*: Weak typing, unstructured business logic, lack of relational schema enforcement, prone to regressions.
2. **Migrate to Next.js Fullstack Monolith**: Consolidate backend and frontend into Next.js App Router with Server Actions.
   - *Pros*: Single framework, unified deployment.
   - *Cons*: Violates the clear decoupled client-server architecture established for the project and complicates independent backend scaling.
3. **Adopt NestJS + Prisma + PostgreSQL Backend and React + TypeScript + Tailwind Kanban Frontend (Selected)**:
   - Modernize backend into a modular NestJS service with TypeScript, DTO validation, and Prisma ORM backed by PostgreSQL.
   - Evolve frontend into a React 19 + TypeScript Kanban board with native HTML5 drag-and-drop, category tags, priority levels, due date tracking, and a Task Insights analytics dashboard.

### Decision
Adopt Option 3:
- **Backend**: NestJS (TypeScript, modular dependency injection, class-validator DTOs, global exception filters).
- **ORM / Database**: Prisma ORM with PostgreSQL.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4, transforming the UI into a 3-column Kanban workflow with Task Insights analytics.
- **Entity Identification**: Transition from MongoDB `_id` to standard UUID string `id` across the database, API DTOs, and frontend components.

### Reason
NestJS provides clear separation of concerns (Controllers, Services, Modules) and out-of-the-box validation pipelines. PostgreSQL + Prisma ensures relational integrity, type-safe queries, and deterministic schema migrations. The TaskFlow-inspired Kanban workflow dramatically upgrades user productivity and UX while preserving core CRUD capabilities.

### Consequences
- Backend codebase must be restructured into TypeScript and NestJS conventions.
- Data access layer will use Prisma Client instead of Mongoose.
- Frontend components must be typed with TypeScript and updated to use `task.id` instead of `task._id`.
- The frontend API client must dynamically configure its baseURL via `VITE_API_URL` to support local and Render cloud deployments.
