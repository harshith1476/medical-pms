# Medichain - Full-Stack Healthcare Platform

A comprehensive healthcare management system that connects patients with doctors, facilitating seamless appointment booking, profile management, and healthcare services.

## 🏗️ Architecture

This is a **three-tier full-stack application** consisting of:

1. **Frontend** - Patient-facing React application
2. **Admin Panel** - Administrative dashboard for managing the platform
3. **Backend** - RESTful API server built with Node.js/Express

## ✨ Features

### Patient Features
- 🔐 **User Authentication** - Secure registration and login with JWT
- 🔍 **Doctor Search** - Search doctors by specialty or name
- 📅 **Appointment Booking** - Book appointments with preferred time slots
- 💳 **Payment Integration** - Secure payments via Razorpay and Stripe
- 👤 **Profile Management** - Complete user profile with medical information
- 📱 **My Appointments** - View and manage all appointments
- 📄 **QR Code Generation** - Digital appointment confirmations
- 🏥 **Multiple Specialties** - Access to various medical specialties
- ✅ **Email Verification** - Account verification system
- 🚨 **Emergency Fast-Lane** - Quick emergency assistance with automatic location sharing
- ✨ **Queue Management System**:
  - 🎯 **Token Number Tracking** - Automatic token assignment for appointments
  - ⏰ **Real-time Wait Time** - Live estimated wait time calculation
  - 🔔 **Token Alerts** - Browser notifications when your turn is next
  - 📍 **Live Doctor Status** - See if doctor is in-clinic, in-consult, or on-break
  - ⚠️ **Delay Alerts** - Automatic notifications for appointment delays

### Doctor Features
- 👨‍⚕️ **Doctor Dashboard** - View appointments and manage schedule
- 📊 **Appointment Management** - Track and manage patient appointments
- 👤 **Profile Management** - Update doctor profile and availability
- 📈 **Schedule Management** - Manage available time slots
- ✨ **Smart Queue Management System**:
  - 📋 **Live Queue Display** - Real-time view of patient queue with token numbers
  - 🔄 **Status Management** - Update status (In-clinic, In-consult, On-break, Unavailable)
  - 💡 **Smart Scheduling Suggestions**:
    - Automatically suggests pulling next patient when consultation runs short
    - Recommends moving follow-up patients to fill gaps
    - Detects no-show patients and suggests queue adjustments
  - ⚡ **Quick Actions** - Start consultation, mark complete, or mark no-show with one click
  - ⏱️ **Performance Tracking** - Average consultation time tracking for better scheduling
  - 📊 **Delay Monitoring** - Automatic detection and alerts for delayed appointments

### Admin Features
- 📊 **Dashboard Analytics** - Overview of doctors, patients, and appointments
- 👨‍⚕️ **Doctor Management** - Add, view, and manage doctors
- 📋 **Appointment Management** - View and manage all appointments
- 👥 **Patient Management** - Monitor patient registrations
- 💰 **Revenue Tracking** - Track platform earnings

## 🛠️ Tech Stack

### Frontend & Admin Panel
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **React Toastify** - Notification system
- **React QR Code** - QR code generation
- **HTML2Canvas** - Screenshot utility

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and management
- **Razorpay** - Payment gateway
- **Stripe** - Payment gateway
- **Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
prescripto-full-stack/
├── frontend/          # Patient-facing React application
│   ├── src/
│   │   ├── assets/    # Images, icons, SVG files
│   │   ├── components/ # Reusable UI components
│   │   ├── context/   # React Context providers
│   │   ├── pages/     # Page components
│   │   └── App.jsx    # Main app component
│   └── package.json
│
├── admin/             # Admin dashboard React application
│   ├── src/
│   │   ├── assets/    # Admin-specific assets
│   │   ├── components/ # Admin components
│   │   ├── context/   # Admin context providers
│   │   ├── pages/     # Admin pages
│   │   │   ├── Admin/ # Admin-specific pages
│   │   │   └── Doctor/ # Doctor dashboard pages
│   │   └── App.jsx
│   └── package.json
│
├── backend/           # Node.js/Express API server
│   ├── api/           # API configuration
│   ├── config/        # Database and service configs
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth and file upload middleware
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   └── server.js      # Entry point
│
├── DEPLOYMENT_GUIDE.md
├── QUICK_DEPLOY.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Razorpay/Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prescripto-full-stack
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd ../admin
   npm install
   ```

### Environment Configuration

#### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
CURRENCY=INR
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### Frontend (.env)
Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

#### Admin (.env)
Create a `.env` file in the `admin/` directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

### Running the Application

#### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm run server  # Uses nodemon for auto-reload
   ```
   Backend will run on `http://localhost:4000`

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or another port)

3. **Start Admin Panel**
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel will run on a separate port

#### Production Mode

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Admin Panel**
   ```bash
   cd admin
   npm run build
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

## 🌐 Deployment

This application is configured for deployment on **Vercel**. See the detailed deployment guides:
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
- `QUICK_DEPLOY.md` - Quick deployment in 5 minutes

### Quick Deployment Steps

1. Deploy backend to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy frontend and admin panel separately
4. Update frontend/admin `.env` with production backend URL

## 🔐 Authentication & Authorization

- **JWT-based authentication** for all user types
- Role-based access control:
  - **Patients** - Can book appointments, manage profile
  - **Doctors** - Can view appointments, manage schedule
  - **Admins** - Full system access

## 📱 API Endpoints

### User Routes (`/api/user`)
- POST `/register` - User registration
- POST `/login` - User login
- GET `/verify` - Email verification
- GET `/appointment/:id` - Get appointment details
- POST `/appointment/:docId` - Book appointment
- GET `/my-appointments/:id` - Get user appointments
- GET `/queue-status?appointmentId=xxx` - Get queue status for patient appointment
- GET `/doctor-status?docId=xxx` - Get live doctor status
- POST `/mark-alerted` - Mark appointment as alerted

### Doctor Routes (`/api/doctor`)
- POST `/login` - Doctor login
- GET `/appointments/:docId` - Get doctor appointments
- GET `/profile/:docId` - Get doctor profile
- GET `/queue-status?slotDate=xxx` - Get queue status and suggestions
- POST `/update-status` - Update doctor status (in-clinic, in-consult, on-break)
- POST `/start-consultation` - Start consultation with patient
- POST `/complete-consultation` - Complete consultation and get suggestions
- POST `/move-appointment` - Move appointment in queue (smart scheduling)
- GET `/smart-suggestions` - Get AI-powered scheduling suggestions

### Admin Routes (`/api/admin`)
- POST `/login` - Admin login
- GET `/dashboard` - Get dashboard statistics
- POST `/add-doctor` - Add new doctor
- GET `/doctors` - Get all doctors
- GET `/appointments` - Get all appointments

## 🗄️ Database Models

- **User Model** - Patient information and profile
- **Doctor Model** - Doctor details, specialties, availability, queue status
  - `status`: in-clinic, in-consult, on-break, unavailable
  - `currentAppointmentId`: Currently consulting patient
  - `averageConsultationTime`: For wait time calculations
- **Appointment Model** - Booking information, payment status, queue data
  - `tokenNumber`: Assigned token number
  - `queuePosition`: Current position in queue
  - `estimatedWaitTime`: Calculated wait time in minutes
  - `status`: pending, in-queue, in-consult, completed, no-show, cancelled
  - `actualStartTime`, `actualEndTime`: Consultation timing
  - `consultationDuration`: Actual consultation duration
  - `isDelayed`: Delay flag
  - `alerted`: Whether patient has been notified

## 🎨 Key Features Implementation

- **Image Upload** - Cloudinary integration for profile and doctor images
- **Payment Processing** - Dual payment gateway support (Razorpay & Stripe)
- **QR Codes** - Digital appointment confirmation
- **SMS Notifications** - SMS service disabled (development mode) - appointment bookings, emergency alerts, queue updates are logged but not sent
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Context API for state management
- **Queue System** - Optimized queue management with:
  - Automatic token number assignment
  - Real-time wait time calculation
  - Browser notifications for token alerts
  - Smart scheduling suggestions using consultation duration data
  - Automatic delay detection and alerts
  - Live doctor status tracking

## 📝 Available Scripts

### Backend
```bash
npm start        # Start production server
npm run server   # Start development server with nodemon
npm run fix-index # Fix MongoDB indexes
```

### Frontend/Admin
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use and modify

## 👥 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
