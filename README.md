ExpensePro - MERN Stack Expense Tracker
ExpensePro is a full-stack web application designed to help users track their expenses and manage their budgets. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it features user authentication, private data for each user, and core expense tracking functionalities.

This repository contains two main folders:

/frontend: The React (Vite) client application.

/backend: The Node.js & Express.js REST API server.

Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens).

Private Data: Users can only access and manage their own expenses and budgets.

Dashboard: An overview of total expenses, total budget, and remaining funds.

Expense Management: Users can add and view their recent expenses.

Budget Management: Users can set and view budgets by category.

Protected Routes: Frontend and backend routes are protected to ensure only authenticated users can access private data.

Tech Stack
Frontend:

React.js

Vite

React Router

React Bootstrap

Axios

Backend:

Node.js

Express.js

MongoDB (with Mongoose)

JSON Web Token (JWT)

bcryptjs (for password hashing)

cors

🚀 Getting Started
Prerequisites
Node.js (v18 or newer)

MongoDB (A local instance or a free MongoDB Atlas account)

npm (comes with Node.js)

1. Backend Setup
Navigate to the backend directory:

Bash

cd backend
Install dependencies:

Bash

npm install
Create your environment file: Create a file named .env in the /backend directory. Copy the contents of your existing .env file into it:

Code snippet

PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_RANDOM_STRING
MONGO_URI: Your connection string from MongoDB Atlas.

JWT_SECRET: A long, random string for securing tokens (e.g., mysecretkey123abc).

Run the backend server:

Bash

npm run dev
The server will start on http://localhost:5000.

2. Frontend Setup
Open a new terminal.

Navigate to the frontend directory:

Bash

cd frontend
Install dependencies:

Bash

npm install
Run the frontend development server:

Bash

npm run dev
The React app will start, usually on http://localhost:5173.

Open the app: Open http://localhost:5173 in your browser to use the application. The frontend is already configured to connect to your backend server at http://localhost:5000/api.