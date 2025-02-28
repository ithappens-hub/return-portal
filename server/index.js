// Modify server/index.js to include database connection
const app = require('./app');
const connectDB = require('./config/database');
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});