const express = require('express');
const db = require('./Config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const agentRoutes = require('./Routes/agentRoutes');
const taskRoutes = require('./Routes/taskRoutes');

dotenv.config();

// Connect to MongoDB
db.connect();


// Create an Express app
const app = express();


// Middlewares
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api', taskRoutes);


//Port
const PORT = process.env.PORT || 5055;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
