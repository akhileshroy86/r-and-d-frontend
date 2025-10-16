# 🔗 Backend-Only Setup

This frontend now uses **ONLY** the backend database. No local database or localStorage.

## 🚀 Setup

1. **Start Backend Server** (must be running on `localhost:3002`)
2. **Start Frontend**:
   ```bash
   npm install
   npm run dev
   ```

## 🔧 Backend Requirements

Your backend must have these endpoints:

### Staff Authentication
- `POST /api/v1/auth/staff/login`
- `POST /api/v1/auth/staff/change-password`

### Staff Management  
- `GET /api/v1/staff` - Get all staff
- `POST /api/v1/staff` - Create staff
- `PUT /api/v1/staff/:id` - Update staff
- `DELETE /api/v1/staff/:id` - Delete staff

## 🎯 Password Change Flow

1. Staff logs in → Backend validates credentials
2. Staff changes password → Frontend calls `POST /api/v1/auth/staff/change-password`
3. Backend updates password in database
4. Staff can login with new password

## 🔍 Database Access

- Frontend: No database access
- Backend: Full database control
- Database UI: `http://localhost:5560/` (your database interface)

## ✅ What's Removed

- ❌ Local Prisma database
- ❌ localStorage credentials  
- ❌ Local API routes
- ❌ Database seeding scripts
- ❌ Prisma dependencies

## 🎉 Pure Backend Integration

All data operations now go through your backend API at `localhost:3002`.