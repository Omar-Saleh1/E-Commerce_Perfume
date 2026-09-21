# E-Commerce Perfume 🌸

A full-stack luxury E-Commerce platform for haute parfumerie, built with **TypeScript**, **Next.js 14**, **Express.js**, and **MongoDB**.

## ✨ Features

- 🛍️ Product catalog with filtering & search
- 🛒 Shopping cart with coupon codes
- ❤️ Wishlist system
- 📦 Multi-tier shipping (Standard / DHL Express / VIP White-Glove)
- 💳 Multiple payment methods (Credit Card, Apple Pay, Cash on Delivery)
- 📧 Automated Gmail order confirmation emails
- 👤 JWT Authentication (User & Admin roles)
- 🔐 Admin dashboard with RBAC
- 📊 Order tracking system
- 🌙 Dark mode support

## 🏗️ Architecture — Design Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Abstract Factory** | `backend/src/patterns/payments/` | Payment providers (Stripe/PayPal/COD) |
| **Abstract Factory** | `backend/src/patterns/fulfillment/` | Shipping tiers (Standard/DHL/VIP) |
| **Abstract Factory** | `backend/src/patterns/notifications/` | Email & SMS notifications |
| **Abstract Factory** | `backend/src/patterns/database/` | MongoDB repository layer |
| **Abstract Factory** | `frontend/src/patterns/api/` | API client abstraction |

## 🚀 Tech Stack

**Backend**
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Gmail SMTP (raw TLS)

**Frontend**
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Lucide React icons
- Context API (Cart, Auth, Toast)

## 🛠️ Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Add your MongoDB URI, JWT secret, Gmail credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── patterns/
│   │   │   ├── database/      # Repository Abstract Factory
│   │   │   ├── payments/      # Payment Abstract Factory
│   │   │   ├── fulfillment/   # Fulfillment Abstract Factory
│   │   │   └── notifications/ # Notification Abstract Factory
│   │   └── server.ts
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── context/
    │   └── patterns/
    │       └── api/           # API Client Abstract Factory
```

## 👤 Default Credentials (seed data)

- **Admin:** `admin@store.com` / `admin123456`
- **User:** `user@store.com` / `user123456`
