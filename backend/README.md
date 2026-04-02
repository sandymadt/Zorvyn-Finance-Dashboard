# 📊 Finance Dashboard Backend System

A robust, production-level backend for a financial dashboard application built with **Node.js, Express.js, and MongoDB**.

---

## 🚀 Features

-   👤 **User & Role Management**: Registration, login, and profile tracking.
-   🔐 **JWT Authentication**: Secure API access using JSON Web Tokens.
-   🛡️ **Role-Based Access Control (RBAC)**:
    -   **Admin**: Full CRUD access for financial records.
    -   **Analyst**: Read records and view analytics charts.
    -   **Viewer**: Read-only access to existing records.
-   💰 **Financial Records Management**: Track income and expenses with amount, category, and notes.
-   📊 **Dashboard Analytics**: Real-time aggregation of financial data including balance and category breakdowns.
-   🔎 **Advanced Filtering & Search**: Filter by type, date, or category and search in notes.
-   ⚖️ **Pagination**: Efficient data handling for large sets of records.
-   ⚙️ **Error Handling**: Standardized error responses and input validation.

---

## 🛠️ Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JWT (jsonwebtoken) & bcryptjs
-   **Environment**: dotenv
-   **Logging**: Morgan
-   **Middleware**: CORS, Express JSON Parser

---

## 📂 Project Structure

```text
├── config/             # Database connection
├── controllers/        # Business logic for routes
├── middleware/         # Auth & Role-based guards
├── models/             # Mongoose schemas (User, Record)
├── routes/             # API endpoint definitions
└── server.js           # Main entry point
```

---

## 📝 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Register a new user (`name`, `email`, `password`, `role`).
- `POST /login`: Login and receive JWT (`email`, `password`).

### 💰 Financial Records (`/api/records`)
- `GET /`: Get all records (Support filters: `type`, `category`, `search`, `page`, `limit`).
- `GET /:id`: Get specific record.
- `POST /`: Create a record (**Admin only**).
- `PUT /:id`: Update a record (**Admin only**).
- `DELETE /:id`: Delete a record (**Admin only**).

### 📊 Dashboard Analytics (`/api/dashboard`)
- `GET /summary`: Returns total income, expenses, balance, and category breakdown (**Analyst/Admin only**).

---

## 🛠️ Installation

1.  Clone or extract the project.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` file (one is provided by default):
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/finance-dashboard
    JWT_SECRET=your_super_secret_jwt_key
    NODE_ENV=development
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

---

## 🧪 Testing with Postman/Thunder Client

1.  **Register User**: Use `POST /api/auth/register` with role `admin`.
2.  **Login User**: Use `POST /api/auth/login` to get the `token`.
3.  **Use Token**: Add the token in the **Authorization** header as `Bearer <token>`.
4.  **Test Operations**: Use the token to access protected routes like creating records or viewing the dashboard.

---

## 🎯 Role Descriptions & Access

| Role | Browse Records | View Analytics | Create/Delete Records |
| :--- | :---: | :---: | :---: |
| Admin | ✅ | ✅ | ✅ |
| Analyst | ✅ | ✅ | ❌ |
| Viewer | ✅ | ❌ | ❌ |

---

## ⚙️ Assumptions & Design Choices

-   **Mongoose Pre-save Hook**: Used for secure password hashing before saving to DB.
-   **Aggregation Pipelines**: Used in dashboard routes for efficient data processing.
-   **Populate**: Used to link records with the users who created them for audit trails.
-   **Search**: Implemented case-insensitive regex search for record notes.
