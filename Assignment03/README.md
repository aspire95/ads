# University Student MIS (PEAN Stack)

This project is a detailed implementation of a Student Management Information System utilizing PostgreSQL, Express, Angular 19, and Node.js.

## Prerequisites
- **Node.js**: v18+
- **PostgreSQL**: v15+ (Running locally or via cloud)
- **pgAdmin**: For executing SQL queries

## Port Allocation
- **Backend API**: http://localhost:3000
- **Frontend App**: http://localhost:4200

## Setup Instructions

### 1. Database Setup
1. Open **pgAdmin**.
2. Create a new database named `DB03`.
3. Open the Query Tool and execute the contents of `university_database.sql`.
   - This will create all 11 university schema tables + RBAC tables.
   - It will also seed initial data for Departments, Courses, and Instructors.

### 2. Backend Configuration
1. Navigate to the `backend/` folder.
2. Open `.env` and update your PostgreSQL credentials (`DB_USER`, `DB_PASSWORD`).
3. Run the following commands:
   ```bash
   npm install
   npm run setup   # Initializes the admin user (admin / admin123)
   npm start       # Starts the server
   ```

### 3. Frontend Configuration
1. Navigate to the `frontend/` folder.
2. Run the following commands:
   ```bash
   npm install
   npm start       # Launches the Angular 19 application
   ```

## Key Features
- **Role-Based Access Control (RBAC)**: Supports Admin, Faculty, and Student roles with JWT security.
- **Generic Entity Explorer**: CRUD interface that dynamically adapts to any database table.
- **Generic Report Generator**: Multi-table data visualization with CSV export capability.
- **Modern UI**: Built with Tailwind CSS and Angular 19 Signals for a premium, reactive experience.

## Developer Info
- **ID**: 23510014
- **Project**: Assignment No. 03 - Student MIS
