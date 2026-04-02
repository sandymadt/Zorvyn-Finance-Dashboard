# 💎 Zorvyn Finance Dashboard

A premium, full-stack financial analytics and management platform. Build with **Node.js**, **Express**, and **React**, featuring robust **Role-Based Access Control (RBAC)** and localized **INR (₹)** tracking. ✨💰📊

---

## 🚀 **Backend Architecture & Approach**

Our backend is built with a **Scalable MVC (Model-View-Controller) Pattern** to ensure separation of concerns and maintainability as the project grows.

### 🛡️ **1. Security & Authentication**
- **JWT (JSON Web Tokens)**: I implemented stateless authentication using signed tokens stored securely on the client.
- **Bcrypt.js**: All user passwords are salt-and-hashed before being saved to the database.
- **ProtectedRoute Middleware**: A custom middleware that intercepts API requests to verify tokens and enforce permissions.

### 👥 **2. User & Role Management**
We support three distinct roles, each with varying levels of access:
- **👑 Admin**: Full control to Create, Update, and Delete records.
- **📊 Analyst**: Read-only access to all records and advanced Dashboard Analytics.
- **👁️ Viewer**: Read-only access to the Records Ledger only (Dashboard summaries are restricted).

### 📈 **3. Dashboard Analytics Pipeline**
The dashboard summary uses a **Mongoose Aggregation Pipeline** to calculate financial metrics in a single database pass:
-   **Total Income/Expense**: Calculated via `$group` and `$sum` operations.
-   **Net Balance**: Dynamically derived arithmetic.
-   **Category Breakdown**: Indexed grouping to map transactions to their respective categories.

---

## 🛠️ **Tech Stack**

### 🔙 **Backend:**
- **Node.js & Express.js**: Standard for lightweight, high-performance REST APIs.
- **MongoDB & Mongoose**: NoSQL database for flexible financial records.
- **Cors & Morgan**: Security and detailed development logging.
- **Dotenv**: Environment variable management.

### 🎨 **Frontend:**
- **React (Vite)**: Modern, blazing-fast single-page application.
- **Tailwind CSS**: Utility-first styling for a premium, glassmorphism UI.
- **Recharts**: High-end data visualization (Pie and Bar charts).
- **Lucide-React**: Modern, consistent iconography.
- **React Hot Toast**: Beautiful, non-blocking user notifications.

---

## 📂 **Project Structure**

```text
/zorvyn
├── backend/                # Express API
│   ├── config/             # DB & Config settings
│   ├── controllers/        # Business Logic (Auth, Records, Dashboard)
│   ├── middleware/         # Auth & RBAC logic
│   ├── models/             # Mongoose Schemas (User, Record)
│   ├── routes/             # API Endpoints
│   └── server.js           # Entry point
├── frontend/               # React Vite App
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── context/        # Auth State Management
│   │   ├── layouts/        # Sidebar & Navigation
│   │   ├── pages/          # Dashboard, Records, Forms
│   │   └── services/       # Axios API integration
└── docker-compose.yml      # Local DB setup
```

---

## 🏁 **Installation & Setup**

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/sandymadt/Zorvyn-Finance-Dashboard.git
    ```
2.  **Install Dependencies**: (Inside root folder)
    ```bash
    npm run install-all
    ```
3.  **Setup Environment**: Create a `.env` file in the `backend/` folder:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_atlas_uri
    JWT_SECRET=your_super_secret_key
    ```
4.  **Run Development Mode**:
    ```bash
    npm run dev
    ```

---

## 🛡️ **License**
This project is licensed under the MIT License. Created with precision by **Dhanush & sandymadt**. 🚀🏁✨
