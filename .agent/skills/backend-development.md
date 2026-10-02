# Skill: Backend Development

## Purpose
Guide backend API development, routing, controller logic, middleware integration, error handling, and server lifecycle management in the Node.js/Express service.

## When to Use It
- Designing and implementing new REST API endpoints.
- Implementing request validation, error handling, or logging middleware.
- Refactoring routing or service structure.
- Handling HTTP status codes, CORS configuration, and environment-driven port binding.

## Required Context
- Backend entry point (`backend/server.js`).
- Route definitions (`backend/routes/taskRoutes.js`).
- Database models (`backend/models/Task.js`).
- Backend configuration (`backend/package.json`, environment variables via `dotenv`).
- Expected HTTP status codes and RESTful design conventions.

## Recommended Workflow
1. **Route & Schema Definition**: Define endpoints, HTTP methods, and required URL parameters or request bodies.
2. **Request Validation**: Validate input payloads prior to database queries (e.g. non-empty title, valid types).
3. **Robust Error Handling**: Wrap async route handlers in `try/catch` blocks or use an async handler wrapper; return standard HTTP error responses (e.g., 400 for bad request, 404 for not found, 500 for server error).
4. **Middleware Discipline**: Configure security middleware (CORS, body parsing, helmet, rate limiting) appropriately.
5. **Runtime Verification**: Test endpoints using HTTP clients or automated scripts to verify response codes and payloads.

## Verification Checklist
- [ ] Are all async operations safeguarded against unhandled promise rejections?
- [ ] Are appropriate HTTP status codes returned (200, 201, 400, 404, 500)?
- [ ] Is CORS properly configured for local development and production environments?
- [ ] Does the server bind cleanly to `process.env.PORT || 5000`?
- [ ] Are input parameters sanitized and validated?

## Common Failure Modes
- Missing error handling in async Express route handlers, causing server crashes on database errors.
- Returning HTTP 200 OK for operations that failed.
- Hardcoding server port or host, breaking containerized or cloud deployments.
- Allowing unvalidated client payloads to be passed directly to persistence layers.

## Lessons Learned During This Project
*None yet. This section will be updated as backend development tasks proceed.*
