const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Import posts routes
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API Server Running',
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api/posts`);
});