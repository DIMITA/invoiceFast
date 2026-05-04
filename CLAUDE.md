# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**invoiceFast** is a SAP-style invoice management SaaS with an AI-powered "FastLane" feature that parses natural language into structured invoice data using a local Ollama LLM.

Stack: NestJS backend (port 3001) + Next.js 14 frontend (port 3000) + Ollama (port 11434), orchestrated via Docker Compose.

## Commands

### Running with Docker (recommended)
```bash
# Start everything (frontend, backend, ollama + model pull)
docker compose up --build

# Run without GPU support (remove deploy.resources section from docker-compose.yml if needed)
docker compose up --build
```

### Local development (without Docker)

**Backend** (from `backend/`):
```bash
npm install
npm run start:dev        # ts-node with tsconfig-paths
npm run build            # tsc compile → dist/
npm run lint
```

**Frontend** (from `frontend/`):
```bash
npm install
npm run dev              # Next.js dev server on :3000
npm run build
npm run lint
```

### Environment
Copy `.env.example` to `.env` and set `OLLAMA_MODEL` (default: `qwen2.5:7b`).
The backend reads `OLLAMA_URL` (default: `http://ollama:11434`) and `OLLAMA_MODEL` from env.
The frontend reads `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001/api`).

## Architecture

### Backend (`backend/src/`)

Three NestJS modules, all **in-memory** (no database — data resets on restart):

| Module | Controller prefix | Responsibility |
|---|---|---|
| `InvoiceModule` | `/api/invoices` | CRUD + status updates + stats |
| `CustomerModule` | `/api/customers` | Read-only customer list |
| `AiModule` | `/api/ai` | FastLane NLP parsing + health check |

**Key design pattern:** `InvoiceService` depends on `CustomerService` to resolve `customerName` from `customerId` at creation time. Both services hold their state as private in-memory arrays seeded with fixture data.

**AI / FastLane flow:** `POST /api/ai/fastlane` → `AiService.parseInvoiceInput()` sends a structured JSON-format prompt to Ollama's `/api/generate` endpoint. On failure (Ollama unavailable), it falls back to a regex parser. Returns `{ customerName, amount, description, confidence }`.

**No test files exist yet.** The `nest-cli.json` is present but `@nestjs/cli` is not in dependencies — build uses `tsc` directly.

### Frontend (`frontend/src/`)

Next.js App Router. All pages are under `src/app/dashboard/`. The dashboard layout wraps pages in a `<Sidebar>` component.

**API client** (`src/lib/api.ts`): single `api` object with namespaced methods (`api.invoices.*`, `api.customers.*`, `api.ai.*`). All calls go to `NEXT_PUBLIC_API_URL`.

**Shared types** (`src/lib/types.ts`): `Invoice`, `Customer`, `InvoiceStats`, `ParsedInvoice` — these mirror the backend types and are used across all frontend pages.

**FastLane page** (`dashboard/fastlane/`): user types natural language → calls `api.ai.fastlane()` → pre-fills invoice creation form with the parsed result.

### Invoice statuses
`pending | paid | rejected | processing` — defined in both `backend/src/invoice/invoice.types.ts` and `frontend/src/lib/types.ts`.
