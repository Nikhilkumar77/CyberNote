# Cyber Notes - Secure Note-Taking Application

A full-stack web application that allows users to securely create, read, update, and delete notes with user authentication and authorization.

## Tech Stack

### Frontend
- **React 18.3** - UI library for building interactive components
- **TypeScript 5.5** - Type-safe JavaScript for maintainability
- **Vite 5.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework for responsive design
- **Lucide React 0.344** - Icon library for UI elements

### Backend & Database
- **Supabase** - Open-source Firebase alternative providing:
  - PostgreSQL database for data persistence
  - Built-in authentication with email/password
  - Real-time database capabilities
  - Row Level Security (RLS) for data protection
  - RESTful API auto-generated from database schema

### Build & Development Tools
- **PostCSS 8.4** - CSS transformation tool
- **Autoprefixer 10.4** - Automatic CSS vendor prefixes
- **ESLint 9.9** - Code quality and consistency
- **TypeScript ESLint** - Type-aware linting

## Project Structure

```
src/
├── components/
│   ├── Auth.tsx           # Authentication UI (sign up/sign in)
│   └── NotesList.tsx      # Notes management UI (CRUD operations)
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
├── lib/
│   └── supabase.ts        # Supabase client configuration
├── App.tsx                # Main app component
├── main.tsx               # Entry point with AuthProvider
└── index.css              # Global styles
```

## Implementation Details

### Authentication System
- **Email/Password Authentication**: Users sign up and log in with email credentials
- **Session Management**: Supabase Auth handles user sessions automatically
- **State Management**: React Context API manages global authentication state
- **Protected Routes**: Notes are only accessible to authenticated users

### Database Schema

#### Notes Table
```sql
- id (UUID): Unique identifier
- user_id (UUID): Foreign key to auth.users
- title (TEXT): Note title
- content (TEXT): Note content
- created_at (TIMESTAMPTZ): Creation timestamp
- updated_at (TIMESTAMPTZ): Last modified timestamp
```

### Security Features

#### Row Level Security (RLS)
All database operations enforce strict RLS policies:
- **SELECT Policy**: Users can only read their own notes
- **INSERT Policy**: Users can only create notes under their own user_id
- **UPDATE Policy**: Users can only modify their own notes
- **DELETE Policy**: Users can only delete their own notes

These policies prevent unauthorized data access at the database level, ensuring no user can access another user's notes.

#### CORS & API Security
- Secure CORS headers configuration for API requests
- JWT-based authentication for all API calls
- Environment variables protect sensitive credentials

### CRUD Operations

**Create**: Users click "New Note" to add notes with title and content
```typescript
INSERT INTO notes (user_id, title, content) VALUES (...)
```

**Read**: Notes are automatically loaded and displayed in a responsive grid
```typescript
SELECT * FROM notes WHERE user_id = current_user ORDER BY created_at DESC
```

**Update**: Users can edit note title and content with inline editing
```typescript
UPDATE notes SET title = ?, content = ?, updated_at = now() WHERE id = ?
```

**Delete**: Users can permanently delete notes with confirmation
```typescript
DELETE FROM notes WHERE id = ?
```

### Frontend Architecture

#### AuthContext
- Manages authentication state across the application
- Provides `useAuth()` hook for accessing user info and auth functions
- Handles session persistence and real-time auth changes

#### Auth Component
- Registration form with email/password validation
- Sign-in form with error handling
- Toggle between sign-up and sign-in modes
- Password minimum requirement (6 characters)

#### NotesList Component
- Displays all user's notes in a responsive grid
- Inline note creation and editing forms
- Real-time UI updates after CRUD operations
- Confirmation dialogs for destructive actions

### Key Features

1. **Responsive Design**: Mobile-first approach with responsive grid layouts
2. **Real-time Updates**: Notes refresh immediately after any operation
3. **Error Handling**: User-friendly error messages for failed operations
4. **Loading States**: Visual feedback during async operations
5. **Clean UI**: Professional design with consistent spacing and typography
6. **Icons**: Lucide React icons for intuitive navigation

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are pre-configured in `.env`

### Running the Application

**Development Server**:
```bash
npm run dev
```
The app runs on `http://localhost:5173`

**Production Build**:
```bash
npm run build
```

**Preview Production Build**:
```bash
npm preview
```

**Type Checking**:
```bash
npm run typecheck
```

**Linting**:
```bash
npm run lint
```

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Log in with your credentials
3. **Create Notes**: Click "New Note" and enter title and content
4. **View Notes**: All notes display in a grid with date information
5. **Edit Notes**: Click "Edit" on any note to modify it
6. **Delete Notes**: Click "Delete" and confirm removal
7. **Sign Out**: Click "Sign Out" in the header

## Security Best Practices

- All user data is encrypted in transit (HTTPS)
- Passwords are securely hashed by Supabase Auth
- RLS policies enforce data isolation at the database level
- No sensitive data stored in local storage
- API keys properly managed through environment variables
- CORS headers prevent unauthorized cross-origin requests

## Performance Optimizations

- Code splitting and lazy loading via Vite
- Efficient database queries with proper indexing
- Optimized CSS with Tailwind's JIT compilation
- Minimal re-renders with React hooks
- Fast build times with Vite

## Future Enhancements

- Rich text editing support
- Note sharing and collaboration
- Tags and categories for organization
- Search functionality
- Note templates
- Export to PDF/Markdown
- Dark mode toggle
- Multi-language support

## License

This project is open source and available under the MIT License.
