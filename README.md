ChalkBot — Miami APA Rules Assistant

Chatbot that answers APA league rule questions using the OpenAI Platform (Assistants v2), grounded in uploaded bylaws/manuals. Front end in React (Vite + TypeScript), back end in ASP.NET Core 8 Web API. Retrieval is division/state-aware, and answers render in safe Markdown with human-readable document titles.

Purpose

Provide quick, authoritative APA rulings by reading league documents instead of manually searching PDFs.

Features

OpenAI Assistant (RAG): Answers are grounded in uploaded Miami APA bylaws and APA manuals.

Division/State aware: Scope retrieval to the relevant rule set (e.g., Open, Ladies, Masters).

Clean citations: UI shows document titles and pinpoint refs (not raw filenames).

React chat UI: Simple prompt → answer flow; safe Markdown (GFM + sanitize).

ASP.NET Core API: Creates threads, runs the Assistant, polls to completion, and returns structured JSON (ProblemDetails on errors).

Docs-friendly repo: Optional docs/ folder (or separate docs repo/LFS) for storing rule PDFs.

Repo layout
chalkbot/
├─ api/                    # ASP.NET Core 8 Web API (source only)
│  ├─ Controllers/
│  ├─ Program.cs
│  ├─ appsettings.json            # no secrets
│  └─ appsettings.example.json    # placeholders
├─ web/                    # React + Vite + TypeScript
│  ├─ src/
│  ├─ public/              # favicons, manifest, etc.
│  ├─ package.json
│  └─ vite.config.ts
├─ docs/                   # OPTIONAL: bylaws/manuals (use Git LFS or a separate repo)
├─ README.md
├─ .gitignore
├─ .gitattributes
└─ .editorconfig

Prerequisites

Node.js 20+ and npm

.NET SDK 8.0+

OpenAI Project API key and an Assistant created in the Platform (Assistants v2 with File Search enabled)

Setup
1) Create/Configure the Assistant (Platform)

Create an Assistant; write system instructions (scope to APA rules).

Enable File Search and upload your rule PDFs (optionally organize per division/state).

(Recommended) Set a metadata.title for each file (e.g., “Miami APA Local Bylaws (2025)”).

Copy the Assistant ID for the backend.

2) Environment variables

Backend (api/):

OPENAI_API_KEY — Project API key

ASSISTANT_ID — Your Assistant’s ID (or keep in config)

(Optional) division/state → store mapping as config

Set via your shell or user secrets (dev):

# mac/linux
export OPENAI_API_KEY=sk-proj-...
export ASSISTANT_ID=asst_...

# windows powershell
$env:OPENAI_API_KEY="sk-proj-..."
$env:ASSISTANT_ID="asst_..."


Frontend (web/):

VITE_API_BASE — Base URL for the API (http://localhost:5219 in dev, or empty to use relative /api in single-site hosting)

Create web/.env.local:

VITE_API_BASE=http://localhost:5219

3) Install dependencies
# frontend
cd web
npm i

# backend
cd ../api
dotnet restore

Running locally

Two terminals:

# terminal 1 — backend
cd api
dotnet run
# prints e.g. http://localhost:5219 and https://localhost:7208

# terminal 2 — frontend
cd web
npm run dev
# visit http://localhost:5173 (or shown port)


If you prefer a single-site run later, build the web app and copy web/dist into api/wwwroot, then ensure the API uses UseStaticFiles() and MapFallbackToFile("/index.html").

API (dev)

POST /api/chat
Request:

{
  "message": "How many timeouts for SL3 in 8-Ball?",
  "threadId": null,
  "division": "open"
}


Response:

{
  "reply": "<markdown answer here>",
  "threadId": "thread_...",
  "citations": [
    { "fileId": "file_...", "title": "Miami APA Local Bylaws (2025)" }
  ]
}


Notes:

The API creates/continues an OpenAI thread, starts a run, polls until completion, and returns full assistant text.

The backend resolves file_id → title for clean citation chips.

Security & best practices

Never commit secrets: keep real keys in env vars or dotnet user-secrets.

.gitignore excludes node_modules/, dist/, bin/, obj/, and local env files.

Store large PDFs with Git LFS or in a separate docs repo to keep the main repo lean.

Use a Project API key with permissions for Assistants/Files. Include header OpenAI-Beta: assistants=v2 in requests.

Troubleshooting

401 / invalid_api_key: verify you’re using a Project key and it’s set in the API process environment.

403 / insufficient scopes: ensure the key has access to Assistants/Threads/Files within the Project/Org.

Short answers: raise output caps and add per-run guidance in the backend; ensure you aggregate all assistant messages created after the run started.

Weird filenames in citations: upload files with a friendly metadata.title; the UI displays titles.

License

Choose a license (e.g., MIT) and place it in LICENSE.

Acknowledgments

APA documentation is used for grounding.

Built with React, Vite, TypeScript, ASP.NET Core, and OpenAI Assistants v2.

If you want this tailored to your exact folder names or ports, paste them here and I’ll adjust the README.
