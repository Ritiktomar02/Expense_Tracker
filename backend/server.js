require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const connectDB=require('./config/db')
const authRoute=require('./routes/authRoute')
const incomeRoute=require('./routes/incomeRoute')
const expenseRoute=require('./routes/expenseRoute')
const dashboardRoute=require('./routes/dashboardRoute')

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectDB();

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/income',incomeRoute)
app.use('/api/v1/expense',expenseRoute)
app.use('/api/v1/dashboard',dashboardRoute)

app.use("/uploads",express.static(path.join(__dirname,"uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
