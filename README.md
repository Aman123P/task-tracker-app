#  Task Tracker App (Node.js + Express + MongoDB + EJS)

This is a full-stack Task Tracker app built using **ExpressJS**, **MongoDB**, **EJS**, and **Node.js**.  
It supports authentication, project management, task CRUD, and session-based login.

---

## Features

-  User Signup / Login with JWT + Session
-  Only one active login allowed per user
-  Create up to **4 projects** per user
-  Add, edit, and delete tasks inside each project
-  Task fields: title, description, status, timestamps
-  Clean UI using plain CSS (responsive + styled)
-  Auth middleware & protected routes
-  MongoDB session store (`connect-mongo`)
-  Fully EJS templated — **no React used**

---



- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Templating**: EJS
- **Authentication**: JWT + Express-session
- **Session Store**: connect-mongo
- **Styling**: Plain CSS
- **Hosting**: Can be deployed on Render / Railway

  ## 🔧 Setup Instructions

### 1. Clone the repo

```bash

git clone https://github.com/YOUR_USERNAME/task-tracker-app.git
cd task-tracker-app
npm install
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tasktracker
JWT_SECRET=your_jwt_secret_key
node app.js

Visit: http://localhost:5000

Developed by Aman
my github: https://github.com/Aman123P/

