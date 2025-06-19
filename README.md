# 🗓️ Booking System (Medical Office/Coworking) - Backend

This is a booking system developed with **Node.js** and **TypeScript**, using **PostgreSQL** as the database engine and **Prisma ORM** for data management. It allows managing users, available schedules, bookings, notifications, and email sending.

---

## 🚀 Technologies Used

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT (Authentication)
- NodeMailer (Emails)
- dotenv (Environment variables)

---

## 📁 Project Structure

```
/reservas-backend/
├── src/
│   ├── config/                # Configurations (db, env)
│   ├── controllers/           # Route logic
│   ├── dtos/                  # Data validations and definitions
│   ├── interfaces/            # Data types and contracts
│   ├── middlewares/
│   ├── models/                # Prisma schema
│   ├── routes/
│   ├── services/
│   ├── utils/                 # Helpers: email, logger, etc.
│   ├── index.ts               # Entry Point
│   └── server.ts              # Express initialization
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Getting Started

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/reservations-backend.git

# Navigate to the project directory
cd reservations-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 🔗 Entity Relationships

- `User` can have many `AvailableSchedules`, `Bookings`, and `Notifications`.
- `AvailableSchedule` is related to a `user` (professional).
- `Booking` connects a `client` with a `professional` and has date, time, and status.
- `Notification` is linked to a `user` and records events like bookings and cancellations.

---

## 📦 Planned Endpoints

### Users
- `POST /api/users` – Create user
- `POST /api/login` – Login with JWT
- `GET /api/users/:id` – Get profile
- `PUT /api/users/:id` – Edit user

### Schedules
- `POST /api/schedules` – Create available schedule
- `GET /api/schedules?professional_id=1` – View availability
- `DELETE /api/schedules/:id` – Delete schedule

### Bookings
- `POST /api/bookings` – Create booking
- `GET /api/bookings/my-bookings` – View my bookings
- `PUT /api/bookings/:id/cancel` – Cancel booking
- `PUT /api/bookings/:id/confirm` – Confirm booking

### Notifications
- `GET /api/notifications` – View notifications
- `PUT /api/notifications/:id/read` – Mark as read

---

## ⚙️ Scripts

```bash
# Development with hot-reload
npm run dev

# TypeScript compilation
npm run build

# Production run
npm start
```

---

## 📬 Email Features

- Booking confirmations
- Booking cancellations
- Scheduled reminders (optional with `node-cron`)

---

## 🔐 Security

- JWT Authentication
- Protected routes middleware
- Data validation with DTOs and middlewares

---

## 🧠 Business Considerations

- Professionals register available schedules
- Clients book in available time slots
- Cannot book expired or already occupied slots
- Automatic notifications and emails for both parties

---

## 🧪 Future Improvements

- WebSockets for real-time notifications
- Administration dashboard
- Multi-language support
- Frontend integration with React or Angular

---

## 🛠️ Author

Aaron Badilla – Full Stack Developer – 🇨🇷

---
