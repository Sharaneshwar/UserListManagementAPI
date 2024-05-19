require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send(`This is a User List API developed by Sharaneshwar Punjal
    <br><br>
    <b>Routes:</b>
    <br>
    GET /
    <br>
    POST /api/users/list - Create a new list
    <br>
    POST /api/users/list/:id/users - Create users from a CSV file in a list
    <br>
    POST /api/users/list/:id/send-email - Send an email to all users in a list
    `);
});
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Start Server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
});
