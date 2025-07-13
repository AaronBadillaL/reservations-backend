# 🗓️ Reservations Backend API

A robust booking system backend built with **Node.js**, **TypeScript**, and **PostgreSQL**. This API handles user management, schedule creation, booking management, and real-time notifications for medical offices, coworking spaces, and professional services.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Role-Based Access**: CLIENT, PROFESSIONAL, and ADMIN roles
- **Schedule Management**: Professionals can create and manage available time slots
- **Booking System**: Clients can book available appointments
- **Real-time Notifications**: Automated notifications for bookings and updates
- **Email Integration**: Automatic email notifications for confirmations and cancellations
- **Secure Authentication**: JWT-based authentication with middleware protection
- **Data Validation**: Comprehensive DTOs and input validation
- **Error Handling**: Structured error responses and logging
- **Debug Support**: Full debugging configuration for development

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: NodeMailer
- **Validation**: Custom DTOs and middleware
- **Security**: bcrypt for password hashing, CORS enabled

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts           # Database configuration
├── controllers/              # Request handlers
│   ├── bookingController.ts
│   ├── notificationController.ts
│   ├── scheduleController.ts
│   └── userController.ts
├── dtos/                     # Data Transfer Objects
│   ├── booking.ts
│   ├── notification.ts
│   ├── schedule.ts
│   └── user.ts
├── interfaces/               # TypeScript interfaces
│   ├── booking.ts
│   ├── notification.ts
│   ├── schedule.ts
│   └── user.ts
├── middlewares/              # Express middleware
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/                   # API routes
│   ├── bookingRoutes.ts
│   ├── notificationRoutes.ts
│   ├── scheduleRoutes.ts
│   └── userRoutes.ts
├── services/                 # Business logic
│   ├── bookingService.ts
│   ├── notificationService.ts
│   ├── scheduleService.ts
│   └── userService.ts
├── utils/                    # Utility functions
│   ├── apiResponse.ts
│   └── emailService.ts
├── index.ts                  # Application entry point
└── server.ts                 # Express server configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/reservations-backend.git
   cd reservations-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/reservations_db"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed database
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📋 Available Scripts

```bash
# Development
npm run dev                    # Start development server with hot reload
npm run dev:debug             # Start with debugging enabled
npm run dev:debug:brk         # Start with breakpoint debugging

# Building
npm run build                 # Compile TypeScript to JavaScript
npm run build:clean           # Clean build directory and rebuild
npm start                     # Start production server

# Database
npm run db:generate           # Generate Prisma client
npm run db:migrate            # Run database migrations
npm run db:migrate:deploy     # Deploy migrations to production
npm run db:reset              # Reset database (development only)
npm run db:seed               # Seed database with initial data
npm run db:studio             # Open Prisma Studio
npm run db:push               # Push schema changes to database
npm run db:pull               # Pull schema from database

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint issues
npm run type-check            # Check TypeScript types
npm run type-check:watch      # Watch TypeScript types

# Utilities
npm run clean                 # Clean build artifacts
npm run clean:all             # Clean all artifacts and reinstall
```

## 🔗 API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Schedules
- `GET /api/schedules` - Get available schedules
- `POST /api/schedules` - Create schedule (Professional only)
- `DELETE /api/schedules/:id` - Delete schedule (Professional only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/confirm` - Confirm booking (Professional only)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `GET /api/notifications/unread-count` - Get unread count

### Health Check
- `GET /health` - API health status

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-Based Access**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation using DTOs
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Protection against abuse (configurable)
- **Secure Headers**: Security headers for API responses

## 🧪 Development & Debugging

### Running in Debug Mode

1. **VS Code Debugging**
   - Open the project in VS Code
   - Go to Run and Debug (Ctrl+Shift+D)
   - Select "Debug Server (Simple)" or "Attach to Process"
   - Set breakpoints and start debugging

2. **Terminal Debugging**
   ```bash
   npm run dev:debug
   ```
   Then attach your debugger to `ws://127.0.0.1:9229`

3. **Chrome DevTools**
   - Run `npm run dev:debug`
   - Open Chrome and go to `chrome://inspect`
   - Click "Open dedicated DevTools for Node"

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📧 Email Configuration

The system sends automatic emails for:
- Booking confirmations
- Booking cancellations
- New booking notifications to professionals

Configure SMTP settings in your `.env` file. For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

## 🗃️ Database Schema

The system uses the following main entities:

- **User**: Stores user information and roles
- **AvailableSlot**: Professional's available time slots
- **Booking**: Client bookings with professionals
- **Notification**: System notifications for users

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
PORT=3000
```

### Docker Support

```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run

# Docker Compose
npm run docker:compose
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Aaron Badilla**  
Full Stack Developer 🇨🇷  
[GitHub](https://github.com/aaronbadillaL) | [LinkedIn](https://www.linkedin.com/in/aar%C3%B3n-badilla-ledezma-92a0821a5/)

## 🔄 Changelog

### Version 1.0.0
- Initial release with core booking functionality
- User management and authentication
- Schedule and booking management
- Email notifications
- Real-time notifications
- Debug configuration
- Security implementation

---

For detailed API documentation and examples, please refer to [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
