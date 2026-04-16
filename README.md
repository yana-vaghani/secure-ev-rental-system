# 🚗 Secure EV Rental System (Cybersecurity-Focused)

A full-stack web application for renting electric vehicles with a strong focus on **security, fraud prevention, and system design**.
This project demonstrates real-world cybersecurity practices integrated into a modern web application.

---

## 🔥 Features

### 🔐 Authentication & Security

* JWT-based authentication
* OTP-based 2-Factor Authentication (2FA)
* Password hashing using bcrypt
* Secure token handling

### 👥 Role-Based Access Control (RBAC)

* **User** → Book EVs
* **Station Master** → Approve/Reject bookings
* **Admin** → Full system access

### 🚗 EV Booking System

* Book electric vehicles with time slots
* Booking status: `pending`, `approved`, `rejected`
* Approval workflow for secure operations

### 🚨 Fraud Detection System

* Detects suspicious activity (e.g., multiple bookings in short time)
* Prevents misuse and bot-like behavior

### 📜 Activity Logging (Audit Trail)

* Tracks user actions (login, booking, approval)
* Useful for monitoring and forensic analysis

### 🛡️ Cybersecurity Features

* Input validation
* Token verification
* Role-based authorization
* Error handling and secure APIs

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Atlas)

### Security

* JWT (Authentication)
* bcrypt (Password hashing)
* Nodemailer (OTP email)

---

## 📁 Project Structure

```
secure-ev-rental/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```
git clone https://github.com/your-username/secure-ev-rental.git
cd secure-ev-rental
```

---

### 🔹 2. Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

Run backend:

```
node server.js
```

---

### 🔹 3. Setup Frontend

```
cd frontend
npm install
npm start
```

---

## 🔄 Application Flow

1. User registers & logs in
2. OTP is sent for verification
3. User verifies OTP → receives JWT token
4. User books EV → status = pending
5. Station Master/Admin approves booking
6. Fraud detection monitors activity
7. All actions are logged

---

## 🧪 API Endpoints (Sample)

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| POST   | `/api/auth/register`        | Register user     |
| POST   | `/api/auth/login`           | Login & send OTP  |
| POST   | `/api/auth/verify-otp`      | Verify OTP        |
| POST   | `/api/bookings`             | Create booking    |
| PUT    | `/api/bookings/approve/:id` | Approve booking   |
| GET    | `/api/bookings/my`          | User bookings     |
| GET    | `/api/logs`                 | View logs (admin) |

---

## 🚀 Future Enhancements

* 🔐 KYC verification (face + document match)
* 💳 Secure payment integration
* 📍 GPS tracking for EVs
* 📊 Advanced analytics dashboard
* 🤖 AI-based fraud detection

---

## 🎯 Learning Outcomes

* Full-stack development (React + Node.js)
* REST API design
* Authentication & Authorization
* Cybersecurity implementation in real systems
* Database design and integration

---

## 👩‍💻 Author

**Yana Vaghani**
Computer Science Engineering Student
Aspiring Data Analyst

---

## ⭐ Contribute / Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🛠️ Contribute improvements

---

## 📜 License

This project is for educational purposes.
