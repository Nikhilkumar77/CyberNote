# Cyber Notes 📝

Cyber Notes is a simple full-stack note-taking app where users can securely create, edit, and delete their own notes.

## Tech Stack

Frontend: **React**, **TypeScript**, **Vite**, **Tailwind CSS**
Backend: **Supabase (PostgreSQL + Auth + RLS)**

## Features

* Email/password authentication
* Create, read, update, delete notes
* Protected routes (only logged-in users can see notes)
* Row Level Security so users can only access their own data
* Responsive and clean UI

## How to Run

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Notes

This project uses Supabase for authentication and database, with secure RLS policies enabled.
Built as a small full-stack practice project.
