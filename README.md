# Respondly

Respondly is a full-stack survey builder that allows users to create, manage, and share custom surveys. Users can build forms with different question types, publish them using a unique link, collect responses, and export submission data.

## Screenshots

![Survey Editor](.public/editor.png)

## Features

- Secure user authentication
- Create, edit, rename, and delete surveys
- Add and manage survey questions
- Drag-and-drop question reordering
- Publish surveys with a shareable public link
- Submit responses without requiring authentication
- View collected responses
- Export responses as CSV
- Search and paginate surveys
- Responsive design for desktop and mobile
- Light and dark mode support

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- TanStack Form
- Tailwind CSS v4
- shadcn/ui
- dnd-kit
- Zustand
- Zod

### Backend

- Hono
- TypeScript
- Better Auth
- Drizzle ORM
- Cloudflare Workers

### Database

- Cloudflare D1 (SQLite)

## How It Works

1. Sign up and create an account.
2. Create a survey and add questions.
3. Share the generated public link.
4. Collect responses from participants.
5. Review submissions and response data.
6. Export responses as CSV when needed.

## Getting Started

Since Respondly is a monorepo, install dependencies and start all applications from the repository root:

```bash
pnpm install
pnpm dev
```

