Store Rating Application

This project is a FullStack Intern Coding Challenge implementation. It is a web application that allows users to register, log in, and submit ratings for stores. The platform supports three user roles with distinct functionalities: System Administrator, Normal User, and Store Owner.

🚀 Tech Stack

Frontend: React.js (Vite)

Backend: Express.js / Loopback / Nest.js (choose one)

Database: PostgreSQL / MySQL

📌 Features & User Roles

1. System Administrator

Add new stores, normal users, and admin users.

Dashboard displaying:

Total number of users

Total number of stores

Total number of submitted ratings

Manage users (Name, Email, Address, Role).

Manage stores (Name, Email, Address, Ratings).

Apply filters on listings (Name, Email, Address, Role).

View detailed profiles of users and stores.

Log out securely.

2. Normal User

Sign up with Name, Email, Address, Password.

Log in securely.

Update password.

Browse and search stores by Name or Address.

Store listing includes:

Store Name

Address

Overall Rating

User’s Submitted Rating

Option to submit/modify rating (1–5).

Submit or update ratings for stores.

Log out securely.

3. Store Owner

Log in securely.

Update password.

Dashboard:

View all users who submitted ratings for their store.

View average rating of their store.

Log out securely.

🛡️ Form Validations

Name: Min 20 characters, Max 60 characters

Address: Max 400 characters

Password: 8–16 characters, must include at least one uppercase letter and one special character

Email: Standard email format validation

⚙️ Additional Notes

All tables should support sorting (ascending/descending) for key fields (Name, Email, etc.).

Follow best practices for frontend and backend development.

Database schema should adhere to relational database design standards.

📂 Project Structure (Suggested)
store-rating-app/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── app.js
│ └── db.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│ ├── index.html
│ ├── vite.config.js
│ └── package.json
├── README.md
└── package.json

🔧 Installation & Setup

1. Clone the repository
   git clone https://github.com/your-username/store-rating-app.git
   cd store-rating-app

2. Install dependencies

Backend:

cd backend
npm install

Frontend (Vite + React):

cd frontend
npm install

3. Configure environment variables

Create a .env file in backend:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store_rating
JWT_SECRET=your_jwt_secret

4. Run backend server
   cd backend
   npm run dev

5. Run frontend server (Vite)
   cd frontend
   npm run dev

Vite will start on http://localhost:5173 by default.
# Store-rating-app
# Store-rating-app
