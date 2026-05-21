const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse incoming request JSON bodies
app.use(express.json());

// Import custom routes
const aiRouter = require('./routes/ai');
const trackingRouter = require('./routes/tracking');

// Use custom routes
app.use('/api/ai', aiRouter);
app.use('/api/tracking', trackingRouter);

// Global status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'Adaptive AI Learning Universe Backend'
  });
});

// Start listening for connections
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🌌 ADAPTIVE AI LEARNING UNIVERSE BACKEND ONLINE  `);
  console.log(`🔌 Listening on port: http://localhost:${PORT}   `);
  console.log(`=================================================`);
});
