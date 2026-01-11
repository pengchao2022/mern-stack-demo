import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import connectDB from './config/db.js';

const app = express();

// connect to database
connectDB();

app.use("/api/notes", notesRoutes);

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

