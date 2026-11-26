# HelpDesk — Full-Stack Support Ticketing & RBAC System

A complete **PERN Stack** (**P**ostgreSQL, **E**xpress.js, **R**eact, **N**ode.js) Support Ticketing & Issue Management web application featuring real email verification, JWT HTTP-only cookie authentication, password recovery, threaded conversations, live filtering, and dual-layer Role-Based Access Control (`USER`, `AGENT`, `ADMIN`).

---

## Key Features

- **Secure Authentication & Account Recovery**
  - Password hashing with `bcryptjs` (10 salt rounds).
  - Real transactional email verification (24-hour expiring token) via Nodemailer + Gmail SMTP.
  - Forgot & Reset Password flow (1-hour expiring token).
  - Persistent 7-day sessions using signed JWTs stored in **HTTP-only cookies**.
- **Dual-Layer Role-Based Access Control (RBAC)**
  - Enforced on both the React frontend (`ProtectedRoute`) and Express backend (`protect` & `authorizeRoles` middleware).
  - **USER:** Create support tickets, search/filter personal tickets, and reply to own threads.
  - **AGENT:** View the global Support Queue, claim unassigned tickets (`OPEN` → `IN_PROGRESS`), update ticket statuses, and reply to users.
  - **ADMIN:** View live KPI analytics, manage users and promote/demote roles from the UI, and manage or permanently delete any ticket.
- **Ticketing & Collaboration**
  - Priority levels (`LOW`, `MEDIUM`, `HIGH`) and status lifecycle (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
  - Real-time keyword search, status filter, and priority filter across all dashboards.
  - Expandable comment threads with role badges (`USER`, `AGENT`, `ADMIN`).

---

## Tech Stack (100% Free Tier)

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS v4, React Router DOM, Axios |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database & ORM** | PostgreSQL (Neon Serverless Free Tier) + Prisma ORM v6 |
| **Auth & Security** | `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `cors` |
| **Email Service** | `nodemailer` + Gmail SMTP (Google App Password) |

---

## Project Structure

```text
helpdesk-app/
├── docs/                            # Project Report (.docx) & Presentation (.pptx)
├── server/                          # Node.js + Express Backend (Port 5000)
│   ├── prisma/schema.prisma         # PostgreSQL schema (User, Ticket, TicketComment)
│   ├── src/config/mailer.js         # Nodemailer Gmail SMTP setup
│   ├── src/middleware/              # authMiddleware.js & roleMiddleware.js
│   ├── src/controllers/             # authController, ticketController, adminController
│   ├── src/routes/                  # authRoutes, ticketRoutes, adminRoutes
│   ├── src/server.js                # Express entry point
│   └── .env.example                 # Environment variable template
└── client/                          # React + Vite Frontend (Port 5173)
    └── src/
        ├── api/axios.js             # Axios instance (withCredentials: true)
        ├── context/AuthContext.jsx  # Global auth state & session restore
        ├── components/              # ProtectedRoute, Navbar, TicketCard, TicketFilters
        └── pages/                   # Login, Register, VerifyEmail, Forgot/ResetPassword,
                                     # UserDashboard, AgentDashboard, AdminDashboard
```

---

## How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/TeachFeastKunal/helpdesk-app.git
cd helpdesk-app
```

### 2. Setup & Start the Backend (`server/`)
```bash
cd server
npm install
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRET, EMAIL_USER, and EMAIL_PASS in .env
npx prisma migrate dev
npm run dev
```

### 3. Setup & Start the Frontend (`client/`)
```bash
cd client
npm install
npm run dev
```

Create a `.env` file in `server/` based on `.env.example`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/neondb?sslmode=require"
JWT_SECRET="your_long_random_secret_string"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_16_char_google_app_password"
