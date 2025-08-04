const express = require('express');
const cors = require("cors");
const app = express();
const connectDB = require('./src/models/index');
const { authRoutes, userRoutes, jobRoutes, postRoutes, paymentRoutes } = require('./src/routes/index');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Job Portal Server is running!');
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);


app.listen(PORT, async() => {
     await connectDB.connectDB()
     .then(() => console.log('Database connected successfully'))
     .catch(err => console.error('Database connection error:', err));

     console.log(`Server started on http://localhost:${PORT}`);
     console.log('Press Ctrl+C to stop the server.');
});