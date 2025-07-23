# 🚀 Premium Dashboard

Welcome to **Premium Dashboard**! This is a full-stack web application for managing products, analytics, and user authentication, built with Next.js (Frontend) and Express/MongoDB (Backend).

## ✨ Features

- 🔐 User Registration, Login, OTP Verification
- 📦 Product Management & Analytics
- 📊 Dashboard with charts and tables
- 🛡️ Secure authentication (JWT, cookies)
- 📧 Password reset via email
- 🎨 Modern, responsive UI (Tailwind CSS)

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AbhisekhNayek/MyDashboard.git
cd MyDashboard
```

### 2. Install Dependencies

#### Frontend
```bash
cd Frontend
pnpm install
```

#### Backend
```bash
cd ../Backend
npm install
```

### 3. Configure Environment Variables

- Edit `Frontend/.env` and `Backend/.env` with your API URLs, database, and email credentials.

### 4. Run the App

#### Start Backend
```bash
cd Backend
npm start
```

#### Start Frontend
```bash
cd Frontend
pnpm dev
```

## 📚 API Endpoints

- `POST /api/v1/user/register` — Register new user
- `POST /api/v1/user/otp-verification` — Verify OTP
- `POST /api/v1/user/login` — Login
- `GET /api/v1/user/logout` — Logout
- `GET /api/v1/user/me` — Get current user
- `POST /api/v1/user/password/forgot` — Forgot password
- `PUT /api/v1/user/password/reset/:token` — Reset password

## 🧑‍💻 Project Structure

- `Frontend/` — Next.js app (UI, pages, components)
- `Backend/` — Express server (API, models, controllers)

## 🧪 Sample User Credentials

Use the following credentials to log in during development or testing:

📧 Email: user@gmail.com
<br>
🔑 Password: Somu@1234

## 📝 License

This project is licensed under the MIT License.

---

Made with ❤️ by Abhisekh Nayek
