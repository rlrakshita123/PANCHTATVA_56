const express = require('express');
const app = express();
const port = 3000;

// Parse JSON bodies (for POST requests if needed)
app.use(express.json());

// Import routes
const medicineRoutes = require('./routes/pharmacyRoutes');
app.use('/api/medicines', medicineRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Medicine Locator API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
