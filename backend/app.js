const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const connectDb = require('./config/db');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

connectDb();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Nearby Services Finder API' });
});

app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server Error' });
});

module.exports = app;
