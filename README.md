# SMK Digital Media LMS Portal

A modern, highly aesthetic Learning Management System (LMS) with Role-Based Access Control (RBAC) designed specifically for digital media & tech vocational high schools (SMK). 

This portal enables students, teachers, and administrators to interact seamlessly in a tech-focused workspace. Built using Next.js 16 (App Router), Tailwind CSS v4, Prisma 7, PostgreSQL, and MinIO (S3-compatible object storage).

---

## 🛠 Tech Stack

*   **Frontend & Backend**: Next.js 16 (App Router, Server Actions, Route Handlers)
*   **Database ORM**: Prisma 7 (utilizing PostgreSQL driver adapters)
*   **Databases**: PostgreSQL (Docker container)
*   **Object Storage**: MinIO / S3 API (Docker container, for course materials and schoolwork attachments)
*   **Authentication**: JWT Token Cookies (RBAC middleware security)
*   **Styling**: Tailwind CSS v4 + Lucide Icons (Sleek dark mode design)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Docker**, **Docker Compose**, and **Node.js** installed on your system.

### 2. Start Infrastructure
Launch the PostgreSQL and MinIO instances running in the background:
```bash
docker compose up -d
```

*   **PostgreSQL**: `localhost:5432` (db: `lmsdb`)
*   **MinIO Console**: `http://localhost:9001` (username: `minioadmin`, password: `minioadminpassword`)
*   **MinIO S3 Endpoint**: `http://localhost:9000`

### 3. Install Dependencies
Run pnpm/npm to install all project libraries:
```bash
pnpm install
```

### 4. Database Setup & Seeding
Deploy database schemas and seed default entries:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 5. Start Development Server
Run the Next.js dev server:
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🔑 Demo Access Credentials

The login screen contains a click-to-autofill selector to log in as any role:

| Role | Email | Password | Scope / Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@smk.sch.id` | `admin123` | Provision programs, design courses, register members |
| **Teacher** | `budi@smk.sch.id` | `teacher123` | Add materials (text/files), create assignments, review & grade work |
| **Student** | `joko@smk.sch.id` | `student123` | Access materials, download files, submit work, view grades/feedback |

---

## 📂 Project Architecture Overview

*   [`lib/db.ts`](file:///home/kenneth/dev/lms-pm/lib/db.ts): Manages the Prisma client connection utilizing PostgreSQL driver adapters for Prisma 7 compatibility.
*   [`lib/auth.ts`](file:///home/kenneth/dev/lms-pm/lib/auth.ts): Sets up secure token generation, verification, and HTTP-only cookie handlers.
*   [`lib/s3.ts`](file:///home/kenneth/dev/lms-pm/lib/s3.ts): Connects to MinIO, configures file streams, creates buckets, and generates presigned download URLs.
*   [`app/actions.ts`](file:///home/kenneth/dev/lms-pm/app/actions.ts): Hosts core backend Server Actions for all CRUD mutations.
*   [`app/api/download/route.ts`](file:///home/kenneth/dev/lms-pm/app/api/download/route.ts): Handles secure redirect downloads using presigned URLs.
*   [`app/dashboard/admin`](file:///home/kenneth/dev/lms-pm/app/dashboard/admin): Admin overview stats, programs, courses, and user directories.
*   [`app/dashboard/teacher`](file:///home/kenneth/dev/lms-pm/app/dashboard/teacher): Teacher portals for managing course materials, assignment instructions, and grading submissions.
*   [`app/dashboard/student`](file:///home/kenneth/dev/lms-pm/app/dashboard/student): Student view of class materials, and assignment portals with file uploads.
