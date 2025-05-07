


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

const app = express();
connectDB();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);



const authMiddleware = require('./middleware/authMiddleware'); 
const dashboardController = require('./controllers/dashboardController');

app.get('/', authMiddleware, dashboardController.getDashboard);


const authRoutes = require('./routes/auth');
app.use( "/", authRoutes);

const projectRoutes = require('./routes/project');
app.use("/",projectRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use( "/", taskRoutes);



app.get('/test-project', (req, res) => {
  res.send('Project route is working');
});


const PORT = process.env.PORT || 5500;
app.get("/test", (req, res) => {
  res.send(" Route is working!");
});

app.listen(PORT, () => {
  console.log(`Server is running  http://localhost:${PORT}`);
});
