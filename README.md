SmartBookmark Application
Overview

SmartBookmark is a secure, cloud-based bookmark management web application that allows users to save, organize, and access their bookmarks from any device. The application focuses on simplicity, data privacy, and a clean user experience while ensuring real-time synchronization.
Key Features

Secure Google authentication
Add, view, search, and filter bookmarks
Soft delete (Trash) functionality
User profile with activity insights
Responsive and modern UI
Strict data isolation using Row Level Security (RLS)
Technology Stack
Frontend

React (Vite)

Tailwind CSS

Lucide Icons

Backend & Database

Supabase (PostgreSQL)

Supabase Authentication (Google OAuth)

Row Level Security (RLS)

Deployment

Vercel

Authentication & Security

Google OAuth authentication via Supabase

Secure session handling and token refresh

Each bookmark is associated with the authenticated user

RLS policies enforce strict access control at the database level
