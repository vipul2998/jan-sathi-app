require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const featuresRouter = require('./routes/features');
const authRouter = require('./routes/auth');
const catalogRouter = require('./routes/catalog');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const jobsRouter = require('./routes/jobs');
const servicesRouter = require('./routes/services');
const ordersRouter = require('./routes/orders');
const expensesRouter = require('./routes/expenses');
const communityRouter = require('./routes/community');
const assistantRouter = require('./routes/assistant');
const karosubRouter = require('./routes/karosub');
const adminRouter = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,https://jan-sathi-9lnsf4h6b-jansathi.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    status: mongoose.connection.readyState === 1 ? 'ok' : 'degraded',
    service: 'jan-sathi-api',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api', featuresRouter);
app.use('/api', authRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api', usersRouter);
app.use('/api', productsRouter);
app.use('/api', jobsRouter);
app.use('/api', servicesRouter);
app.use('/api', ordersRouter);
app.use('/api', expensesRouter);
app.use('/api', communityRouter);
app.use('/api', assistantRouter);
app.use('/api', karosubRouter);
app.use('/api', adminRouter);

function startServer() {
  app.listen(port, () => {
    console.log(`Jan Sathi API is running on http://localhost:${port}`);
  });

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Running without MongoDB for now.');
    return;
  }

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.warn('MongoDB connection failed, continuing without database:', error.message));
}

startServer();