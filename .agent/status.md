# Project Status

## Current Phase
Phase 3 Complete: API Validation Hardening (DTOs, Global ValidationPipe, and ParseUUIDPipe)

## Completed
- Installed `class-validator` and `class-transformer` in `backend/package.json`.
- Created `CreateTaskDto` (`backend/src/tasks/dto/create-task.dto.ts`):
  - `title` is required (`@IsNotEmpty()`, `@IsString()`).
  - Inputs are sanitized and trimmed appropriately (`@Transform()`).
- Created `UpdateTaskDto` (`backend/src/tasks/dto/update-task.dto.ts`):
  - `title` is optional, trimmed, non-empty when provided.
  - `completed` is optional, boolean when provided (`@IsBoolean()`).
- Enabled NestJS global `ValidationPipe` in `backend/src/main.ts` with:
  - `whitelist: true`
  - `forbidNonWhitelisted: true`
  - `transform: true`
- Integrated `ParseUUIDPipe` on all `:id` route parameters in `TasksController` (`findOne`, `update`, `remove`) returning HTTP 400 for malformed UUIDs.
- Preserved thin controller pattern and encapsulated database logic in `TasksService`.
- Preserved existing REST API contract: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`.
- Maintained zero changes to `frontend/` and zero changes to Prisma schema or database tables.
- Verified live HTTP validation behavior against PostgreSQL:
  - Valid POST creates task with 201 Created.
  - Empty or whitespace title is rejected with 400 Bad Request.
  - Unknown payload fields are rejected with 400 Bad Request (`forbidNonWhitelisted: true`).
  - Valid PUT updates title and completion status.
  - Invalid UUID parameter is rejected with 400 Bad Request (`Validation failed (uuid is expected)`).
  - `npm run build` succeeds cleanly with zero errors.

## In Progress
- Awaiting next instruction (frontend TypeScript migration & API integration).

## Blocked
- None.

## Known Limitations
- Frontend (`frontend/src/api.js`, `App.jsx`, `TaskList.jsx`) still expects `task._id` and points to remote Render backend URL until frontend modernization is executed.
- Advanced TaskFlow attributes (`priority`, `tags`, `dueDate`, `status`) will be introduced in subsequent model evolutions as instructed.

## Verification Status
- NestJS compilation & build: Passed (`npm run build`).
- DTO validation & transformation: Verified live over HTTP.
- UUID validation pipe: Verified live over HTTP.
- Non-whitelisted field rejection: Verified live over HTTP.
- Database & Prisma integrity: Unmodified and functioning.
- Frontend isolation: Verified untouched (0 changes).

## Next Recommended Action
Proceed to frontend modernization (React + TypeScript, API client update to `task.id` and dynamic `VITE_API_URL`, Kanban UI evolution).
