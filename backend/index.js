const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes will be added here
app.use('/api/resume', require('./routes/resume'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('AI Interview Simulator API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
