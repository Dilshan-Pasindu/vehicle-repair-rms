const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/v1/auth', require('./src/routes/auth'));
// app.use('/api/v1/vehicles', require('./src/routes/vehicles'));
// app.use('/api/v1/workshops', require('./src/routes/workshops'));
// app.use('/api/v1/appointments', require('./src/routes/appointments'));
// app.use('/api/v1/records', require('./src/routes/records'));
// app.use('/api/v1/reviews', require('./src/routes/reviews'));

app.get('/', (req, res) => {
  res.send('VSRMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
